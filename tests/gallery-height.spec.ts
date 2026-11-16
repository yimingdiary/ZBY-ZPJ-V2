import { test, expect } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
const published = new URL("../content/published/home.json", import.meta.url);
test("作品预览统一最大高度，宽度0随真实比例自适应且点击框贴图", async ({
  page,
}) => {
  const original = await readFile(published, "utf8");
  try {
    const data = JSON.parse(original);
    for (const module of data.content)
      if (["OverlayGallery", "DouyinGallery"].includes(module.type)) {
        module.props.layout.imageWidth = 0;
        module.props.layout.imageHeight = 1600;
      }
    await writeFile(published, JSON.stringify(data));
    for (const width of [1920, 1280]) {
      await page.setViewportSize({ width, height: 1080 });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      const sizes: number[] = [];
      for (const id of ["overlay", "douyin-shop"]) {
        const cards = page.locator(`#${id} figure`);
        for (const card of await cards.all()) {
          await card.scrollIntoViewIfNeeded();
          const img = card.locator("img").first();
          await expect
            .poll(() => img.evaluate((e: HTMLImageElement) => e.naturalWidth))
            .toBeGreaterThan(0);
          const result = await img.evaluate((e: HTMLImageElement) => {
            const r = e.getBoundingClientRect(),
              a = e.parentElement!.getBoundingClientRect(),
              canvas = e.closest("[data-page-scroll]")!.getBoundingClientRect();
            return {
              width: r.width,
              height: r.height,
              ratio: e.naturalWidth / e.naturalHeight,
              linkWidth: a.width,
              linkHeight: a.height,
              cap: (canvas.width * 724.9252) / 1920,
            };
          });
          expect(
            Math.abs(result.width / result.height - result.ratio),
          ).toBeLessThan(0.005);
          expect(Math.abs(result.linkWidth - result.width)).toBeLessThan(1);
          expect(Math.abs(result.linkHeight - result.height)).toBeLessThan(1);
          expect(result.height).toBeLessThanOrEqual(result.cap + 1);
          sizes.push(result.height);
        }
      }
      expect(Math.max(...sizes) - Math.min(...sizes)).toBeLessThan(1);
      await page.locator("#douyin-shop").scrollIntoViewIfNeeded();
      await page.screenshot({ path: `.cache/gallery-height-${width}.png` });
    }
  } finally {
    await writeFile(published, original);
  }
});
