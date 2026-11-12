import { test, expect } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
const draft = new URL("../content/draft/home.json", import.meta.url);
test("第二屏桌面与手机排版、真实照片及首屏高度", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [1920, 390]) {
    await page.setViewportSize({ width, height: width === 1920 ? 1080 : 844 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const about = page.getByRole("region", { name: "个人介绍" });
    await about.scrollIntoViewIfNeeded();
    const portrait = about.getByRole("img", { name: "朱宝玉个人照片" });
    await expect(portrait).toBeVisible();
    await expect
      .poll(() => portrait.evaluate((e: HTMLImageElement) => e.naturalWidth))
      .toBe(2100);
    await expect(
      about.getByRole("heading", { name: "About Me", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    const top = await about.evaluate(
      (e) => e.getBoundingClientRect().top + scrollY,
    );
    expect(top).toBeGreaterThan(width === 1920 ? 1000 : 780);
    await page.screenshot({
      path: `.cache/about-${width}.png`,
      fullPage: true,
    });
  }
  expect(errors).toEqual([]);
});
test("个人介绍后台修改真实保存重载，草稿不影响公开页", async ({ page }) => {
  const original = await readFile(draft, "utf8");
  try {
    await page.goto("/admin");
    const frame = page.frameLocator("iframe");
    await frame.getByRole("heading", { name: "About Me", exact: true }).click();
    const art = frame.locator("#about [data-framed-title]");
    const widthBefore = await art.evaluate(
      (e) => e.getBoundingClientRect().width,
    );
    await page
      .getByRole("textbox", { name: "页面标题", exact: true })
      .fill("About Barry");
    await expect(
      frame.getByRole("heading", { name: "About Barry", exact: true }),
    ).toBeVisible();
    await expect
      .poll(() => art.evaluate((e) => e.getBoundingClientRect().width))
      .toBeGreaterThan(widthBefore);
    const name = page.getByRole("textbox", { name: "中文姓名", exact: true });
    await name.fill("第二屏保存验证");
    await expect(
      frame.getByText("第二屏保存验证", { exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "保存草稿", exact: true }).click();
    await expect(page.locator('span[role="status"]')).toContainText(
      "草稿已保存",
    );
    expect(
      JSON.parse(await readFile(draft, "utf8")).content.find(
        (m: { type: string }) => m.type === "AboutMe",
      ).props.name,
    ).toBe("第二屏保存验证");
    await page.reload();
    await expect(
      frame.getByText("第二屏保存验证", { exact: true }),
    ).toBeVisible();
    await page.goto("/");
    await expect(page.getByText("第二屏保存验证", { exact: true })).toHaveCount(
      0,
    );
    await expect(
      page.locator("#about").getByText("朱宝玉", { exact: true }),
    ).toHaveCount(1);
  } finally {
    await writeFile(draft, original);
  }
});
