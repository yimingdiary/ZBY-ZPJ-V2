import { test, expect } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
const published = new URL("../content/published/home.json", import.meta.url);

test("R2 内容加载后外壳控制原生滚动条，关闭后保留线框", async ({ browser }) => {
  const original = await readFile(published, "utf8");
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    for (const enabled of [true, false]) {
      const data = JSON.parse(original);
      data.root.props.chrome = enabled;
      await writeFile(published, JSON.stringify(data));
      await page.goto(`http://127.0.0.1:4323/?chrome=${enabled}`);
      await expect(page.locator("[data-page-scroll]")).toBeAttached();
      await expect
        .poll(() =>
          page
            .locator("html")
            .evaluate((el) => getComputedStyle(el).scrollbarWidth),
        )
        .toBe(enabled ? "none" : "auto");
      await expect(page.locator("object[data-photoshop-frame]")).toHaveCount(
        enabled ? 1 : 0,
      );
      for (const name of [
        "portfolio-guides",
        "about-guides",
        "contents-1-guides",
        "closing-guides",
      ]) {
        await expect(
          page.locator(`image[href="/decorations/${name}.svg"]`).first(),
        ).toBeAttached();
      }
    }
  } finally {
    await context.close();
    await writeFile(published, original);
  }
});

test("禁用脚本时明确提示，不展示旧的构建内容", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4323/");
    expect(
      await page.locator("noscript").evaluate((el) => el.textContent),
    ).toBe("请启用 JavaScript 以读取最新发布内容。");
    await expect(page.locator("[data-page-scroll]")).toHaveCount(0);
  } finally {
    await context.close();
  }
});
