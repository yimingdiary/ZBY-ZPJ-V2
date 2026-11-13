import { test, expect } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
const draft = new URL("../content/draft/home.json", import.meta.url);
const published = new URL("../content/published/home.json", import.meta.url);
test("贴片作品原图、响应式布局及目录真实跳转", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [1920, 390]) {
    await page.setViewportSize({ width, height: width === 1920 ? 1080 : 844 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await page.locator('#contents a[href="#overlay"]').click();
    await expect(page).toHaveURL(/#overlay$/);
    const images = page.locator(
      "#overlay figure > a > img, #overlay figure > img",
    );
    await expect(images).toHaveCount(4);
    for (const img of await images.all()) {
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() => img.evaluate((e: HTMLImageElement) => e.naturalWidth))
        .toBeGreaterThan(0);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.locator("#overlay").scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `.cache/overlay-${width}.png`,
      fullPage: false,
    });
  }
  expect(errors).toEqual([]);
});
test("贴片模块后台编辑、保存重载与草稿隔离", async ({ page }) => {
  const original = await readFile(draft, "utf8");
  const live = await readFile(published, "utf8");
  try {
    await page.goto("/admin");
    const frame = page.frameLocator("iframe");
    await frame.getByRole("heading", { name: "Overlay", exact: true }).click();
    await page
      .getByRole("textbox", { name: "作品类型说明", exact: true })
      .fill("贴片模块保存验证");
    await page
      .getByRole("spinbutton", { name: "安全区域总宽度", exact: true })
      .fill("1500");
    await page
      .getByRole("spinbutton", { name: "图间距（0 自动均分）", exact: true })
      .fill("12.5");
    await page.getByRole("button", { name: "保存草稿", exact: true }).click();
    await expect(page.locator('span[role="status"]')).toContainText(
      "草稿已保存",
    );
    await page.reload();
    await expect(
      frame.getByText("贴片模块保存验证", { exact: true }),
    ).toBeVisible();
    const saved = JSON.parse(await readFile(draft, "utf8"));
    expect(
      saved.content.find((m: any) => m.type === "OverlayGallery").props.layout,
    ).toMatchObject({ safeWidth: 1500, gap: 12.5 });
    expect(await readFile(published, "utf8")).toBe(live);
  } finally {
    await writeFile(draft, original);
  }
});
