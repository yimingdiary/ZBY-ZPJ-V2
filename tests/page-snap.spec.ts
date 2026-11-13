import { test, expect } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
const published = new URL("../content/published/home.json", import.meta.url);

test("轻吸附对齐页首并避开 PS 顶栏，关闭 PS 后同样生效", async ({ page }) => {
  const original = await readFile(published, "utf8");
  try {
    for (const enabled of [true, false]) {
      const data = JSON.parse(original);
      data.root.props.chrome = enabled;
      await writeFile(published, JSON.stringify(data));
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(`/?snap=${enabled}`);
      await page.evaluate(() => document.fonts.ready);
      const target = await page.locator("#contents").evaluate((el) => {
        const offset =
          parseFloat(
            getComputedStyle(document.documentElement).scrollPaddingTop,
          ) || 0;
        return el.getBoundingClientRect().top + scrollY - offset;
      });
      await page.evaluate(
        (y) => scrollTo({ top: y + 35, behavior: "instant" }),
        target,
      );
      await expect
        .poll(() => page.evaluate(() => scrollY))
        .toBeCloseTo(Math.round(target), 0);
      expect(
        await page
          .locator("html")
          .evaluate((el) => getComputedStyle(el).scrollSnapType),
      ).toMatch(/^y(?: proximity)?$/);
      await page.evaluate(
        (y) => scrollTo({ top: y + 300, behavior: "instant" }),
        target,
      );
      await page.mouse.move(640, 400);
      await page.mouse.wheel(0, -265);
      await expect
        .poll(() => page.evaluate(() => scrollY))
        .toBeCloseTo(Math.round(target), 0);
    }
  } finally {
    await writeFile(published, original);
  }
});

test("手机长内容中间仍可停留，不强制跳到下一页", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const target = await page.locator("#about").evaluate((el) => {
    const r = el.getBoundingClientRect();
    return r.top + scrollY + r.height / 2;
  });
  await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), target);
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeCloseTo(Math.round(target), 0);
});
