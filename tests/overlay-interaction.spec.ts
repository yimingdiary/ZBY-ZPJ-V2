import { readFile, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
const catalog = JSON.parse(
  readFileSync(
    new URL("../public/images/works/catalog.json", import.meta.url),
    "utf8",
  ),
);
import { test, expect } from "@playwright/test";
test("贴片首次悬停才加载真实图层，离开恢复，点击新页打开分层详情", async ({
  page,
}) => {
  const published = new URL("../content/published/home.json", import.meta.url);
  const original = await readFile(published, "utf8");
  const fixture = JSON.parse(original);
  const defaults = JSON.parse(
    await readFile(
      new URL("../src/modules/OverlayGallery/defaults.json", import.meta.url),
      "utf8",
    ),
  );
  fixture.content.find(
    (m: { type: string }) => m.type === "OverlayGallery",
  ).props.items = defaults.items;
  await writeFile(published, JSON.stringify(fixture));
  try {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/#overlay");
    const work = page.locator('[data-overlay-work="pet-expo"]');
    await expect(work.locator("[data-overlay-preview] img")).toHaveCount(0);
    await work.hover();
    await expect(work).toHaveAttribute("data-preview-active", "true");
    expect(
      await work.locator("[data-overlay-preview] img").count(),
    ).toBeGreaterThan(5);
    const animated = work.locator(
      '[data-overlay-preview] img[src*="顶部挂件-文-动"]',
    );
    const first = await animated.screenshot();
    await expect
      .poll(async () => !(await animated.screenshot()).equals(first), {
        timeout: 10000,
      })
      .toBe(true);
    await page.mouse.move(0, 0);
    await expect(work).not.toHaveAttribute("data-preview-active", "true");
    const popup = page.waitForEvent("popup");
    await work.click();
    const detail = await popup;
    await detail.waitForSelector('[data-layers-ready="true"]');
    await expect(detail).toHaveURL(/\/overlay\/pet-expo\/?$/);
    await expect
      .poll(() => detail.locator(".stage-media").count())
      .toBeGreaterThan(5);
    await detail
      .locator("#previewScroll")
      .evaluate((e) => (e.scrollTop = e.scrollHeight));
    await expect(detail.locator("html")).toHaveClass(/is-layer-expanded/);
    await detail.screenshot({ path: ".cache/detail-verified.png" });
    await detail.close();
    for (const id of ["pet-life", "cat-litter", "alfie-buddy"]) {
      const item = page.locator(`[data-overlay-work="${id}"]`);
      await item.hover();
      await expect(item).toHaveAttribute("data-preview-active", "true");
      if (id === "pet-life") {
        const video = item.locator("video").first();
        await expect
          .poll(() => video.evaluate((e: HTMLVideoElement) => e.currentTime))
          .toBeGreaterThan(0);
        await page.mouse.move(0, 0);
        await expect
          .poll(() => video.evaluate((e: HTMLVideoElement) => e.paused))
          .toBe(true);
      }
    }
    await page.mouse.move(0, 0);
    expect(errors).toEqual([]);
  } finally {
    await writeFile(published, original);
  }
});
test("四张作品真实图层均可访问，无丢图；手机滚动可展开", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  try {
    for (const id of ["pet-life", "cat-litter", "pet-expo", "alfie-buddy"]) {
      await page.goto("/overlay/" + id);
      await page.waitForSelector('[data-layers-ready="true"]');
      await expect
        .poll(() => page.locator("#deviceStage img[src]").count())
        .toBe(
          catalog[id].files.filter((f: string) => !f.endsWith(".mp4")).length +
            1,
        );
      await expect
        .poll(() =>
          page
            .locator("#deviceStage img[src]")
            .evaluateAll(
              (es) =>
                es.filter((e) => !(e as HTMLImageElement).naturalWidth).length,
            ),
        )
        .toBe(0);
      if (id === "pet-life") {
        const cdp = await context.newCDPSession(page);
        await cdp.send("Input.dispatchTouchEvent", {
          type: "touchStart",
          touchPoints: [{ x: 195, y: 650 }],
        });
        await cdp.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [{ x: 195, y: 250 }],
        });
        await cdp.send("Input.dispatchTouchEvent", {
          type: "touchEnd",
          touchPoints: [],
        });
        await expect
          .poll(() =>
            page.locator("#previewScroll").evaluate((e) => e.scrollTop),
          )
          .toBeGreaterThan(0);
      }
      await page
        .locator("#previewScroll")
        .evaluate((e) => (e.scrollTop = e.scrollHeight));
      await expect(page.locator("html")).toHaveClass(/is-layer-expanded/);
    }
    await page.screenshot({ path: ".cache/detail-mobile-verified.png" });
    expect(errors).toEqual([]);
  } finally {
    await context.close();
  }
});
