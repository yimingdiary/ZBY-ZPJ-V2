import { test, expect } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
const published = new URL("../content/published/home.json", import.meta.url);

test("外壳开启时无脚本首屏即隐藏原生滚动条，关闭后保留线框并恢复原生滚动条", async ({
  browser,
}) => {
  const original = await readFile(published, "utf8");
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    for (const enabled of [true, false]) {
      const data = JSON.parse(original);
      data.root.props.chrome = enabled;
      await writeFile(published, JSON.stringify(data));
      await page.goto(`http://127.0.0.1:4321/?chrome=${enabled}`);
      expect(
        await page
          .locator("html")
          .evaluate((el) => getComputedStyle(el).scrollbarWidth),
      ).toBe(enabled ? "none" : "auto");
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
