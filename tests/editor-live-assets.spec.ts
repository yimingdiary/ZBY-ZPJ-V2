import { test, expect } from "@playwright/test";
import { readFile, writeFile, rm, rmdir } from "node:fs/promises";
const draft = new URL("../content/draft/home.json", import.meta.url),
  published = new URL("../content/published/home.json", import.meta.url);
test("新上传图片立即显示、路径修改不刷新、底部拖入按落点插入，发布入口唯一", async ({
  page,
  request,
}) => {
  const original = await readFile(draft, "utf8"),
    live = await readFile(published, "utf8");
  let imported = "";
  try {
    const data = JSON.parse(original),
      item = data.content
        .find((c: any) => c.type === "DouyinGallery")
        .props.items.find((i: any) => i.slug === "crocs-10-09-10-14");
    await page.goto("/admin");
    await expect(
      page.getByRole("button", { name: "发布页面", exact: true }),
    ).toHaveCount(1);
    const outer = page.frameLocator("iframe#preview-frame");
    await outer
      .getByRole("heading", { name: "Douyin Shop", exact: true })
      .click();
    await page
      .getByText(item.name, { exact: true })
      .filter({ visible: true })
      .click();
    const picker = page.locator('[class*="picker"]:visible');
    const replacement = item.page.components.find(
      (c: any) => c.type === "poster" && c.image !== item.cover,
    ).image;
    await picker.getByRole("textbox", { name: "图片路径" }).fill(replacement);
    await picker.getByRole("textbox", { name: "图片路径" }).press("Enter");
    await expect(outer.locator("#douyin-shop img").nth(1)).toHaveAttribute(
      "src",
      replacement,
    );
    await expect
      .poll(() =>
        outer
          .locator("#douyin-shop img")
          .nth(1)
          .evaluate((e: HTMLImageElement) => e.naturalWidth),
      )
      .toBeGreaterThan(0);
    await page
      .getByRole("button", { name: "装修完整店铺首页", exact: true })
      .click();
    const dialog = page.getByRole("dialog", { name: "抖音店铺首页装修" }),
      editor = dialog.frameLocator('iframe[title="店铺装修工作台"]'),
      canvas = editor.frameLocator("iframe#preview-frame");
    const carousel = canvas.locator(".carousel").first();
    await carousel.click({ position: { x: 4, y: 4 } });
    await editor
      .getByText("第 1 张", { exact: true })
      .filter({ visible: true })
      .click();
    const png = item.page.components.find(
      (c: any) => c.type === "flipGrid",
    ).buttonImage;
    const source = await (await request.get(png)).body();
    const bytes = Buffer.concat([
      source,
      Buffer.from("live-upload-" + Date.now()),
    ]);
    let navigations = 0;
    page.on("framenavigated", () => navigations++);
    const response = page.waitForResponse(
      (r) =>
        r.url().endsWith("/api/shop-assets") && r.request().method() === "POST",
    );
    await editor
      .locator('[class*="picker"]:visible input[type=file]')
      .first()
      .setInputFiles({
        name: "即时预览.png",
        mimeType: "image/png",
        buffer: bytes,
      });
    const result = await (await response).json();
    expect(result.imported).toBeTruthy();
    imported = result.src;
    expect((await request.get(imported)).status()).toBe(200);
    await expect(carousel.locator(".slides img").first()).toHaveAttribute(
      "src",
      imported,
    );
    await expect
      .poll(() =>
        carousel
          .locator(".slides img")
          .first()
          .evaluate((e: HTMLImageElement) => e.naturalWidth),
      )
      .toBeGreaterThan(0);
    await expect(
      editor.locator('[class*="picker"]:visible img').first(),
    ).toHaveAttribute("src", imported);
    expect(navigations).toBe(0);
    const originalIds = item.page.components.map((c: any) => c.id);
    await canvas.locator(".component").last().scrollIntoViewIfNeeded();
    const palette = await editor
        .getByText("抖音店铺-静态海报", { exact: true })
        .first()
        .boundingBox(),
      last = await canvas.locator(".component").last().boundingBox();
    if (!palette || !last) throw Error("拖入位置不存在");
    await page.mouse.move(
      palette.x + palette.width / 2,
      palette.y + palette.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(palette.x + 10, palette.y + 50, { steps: 5 });
    await page.mouse.move(last.x + last.width / 2, last.y + last.height - 8, {
      steps: 25,
    });
    await page.mouse.up();
    await expect(canvas.locator(".component")).toHaveCount(
      originalIds.length + 1,
    );
    await page.screenshot({
      path: ".cache/editor-live-assets-bottom-drop.png",
    });
    await editor.getByRole("button", { name: "保存", exact: true }).click();
    await expect(editor.locator("span[role=status]")).toContainText("已保存");
    await expect(dialog).toBeVisible();
    const saved = JSON.parse(await readFile(draft, "utf8"))
      .content.find((c: any) => c.type === "DouyinGallery")
      .props.items.find((i: any) => i.slug === item.slug);
    expect(saved.cover).toBe(replacement);
    expect(
      saved.page.components.slice(0, originalIds.length).map((c: any) => c.id),
    ).toEqual(originalIds);
    expect(saved.page.components.at(-1).type).toBe("poster");
    expect(
      saved.page.components.find((c: any) => c.type === "carousel").images[0],
    ).toBe(imported);
    expect(await readFile(published, "utf8")).toBe(live);
  } finally {
    await writeFile(draft, original);
    if (imported) {
      const path = new URL("../public" + imported, import.meta.url);
      await rm(path, { force: true });
      await rmdir(new URL(".", path)).catch(() => {});
    }
  }
});
