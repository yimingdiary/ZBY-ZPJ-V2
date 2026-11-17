import { test, expect } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
const draft = new URL("../content/draft/home.json", import.meta.url),
  published = new URL("../content/published/home.json", import.meta.url);
const origin = { Origin: "http://127.0.0.1:4321" };
test("KV入口打开完整店铺，真实素材、桌面手机布局与动画均正常", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  const cards = page.locator("#douyin-shop figure a");
  await expect(cards).toHaveCount(
    JSON.parse(await readFile(published, "utf8")).content.find(
      (c: any) => c.type === "DouyinGallery",
    ).props.items.length,
  );
  const [detail] = await Promise.all([
    page.waitForEvent("popup"),
    cards.filter({ has: page.locator('img[alt*="童享狂欢"]') }).click(),
  ]);
  detail.on("pageerror", (e) => errors.push(e.message));
  await detail.waitForLoadState();
  await expect(detail.locator(".poster")).toHaveCount(4);
  await expect(detail.locator(".carousel")).toHaveCount(2);
  await expect(detail.locator(".tab-carousel")).toHaveCount(2);
  await expect(detail.locator(".flip-grid")).toHaveCount(1);
  for (const width of [1440, 390]) {
    await detail.setViewportSize({ width, height: 844 });
    await expect
      .poll(() =>
        detail
          .locator('[data-shop-panel="0"] img')
          .evaluateAll((imgs: HTMLImageElement[]) =>
            imgs.every((i) => i.complete && i.naturalWidth > 0),
          ),
      )
      .toBeTruthy();
    expect(
      await detail.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    expect(
      await detail
        .locator("[data-shop-page]")
        .evaluate((e) => Math.round(e.getBoundingClientRect().width)),
    ).toBe(width === 390 ? 390 : 590);
    await detail.screenshot({ path: `.cache/douyin-${width}.png` });
    const header = detail.locator(".toolbar");
    const firstPoster = detail.locator(".poster").first();
    expect(
      await firstPoster.evaluate((e) => e.getBoundingClientRect().top),
    ).toBeGreaterThanOrEqual((await header.boundingBox())!.height);
    await detail.evaluate(() => window.scrollTo(0, 500));
    await expect.poll(() => header.boundingBox().then((b) => b?.y)).toBe(0);
    await detail.evaluate(() => window.scrollTo(0, 0));
  }
  const tabs = detail.locator(".tab-carousel").first();
  await tabs.locator(".tab-thumb").first().click();
  await expect(tabs.locator(".tab-slide").first()).toHaveClass(/active/);
  await detail.emulateMedia({ reducedMotion: "reduce" });
  const flip = detail.locator(".flip-grid");
  await flip.locator(".flip-button").click();
  await expect
    .poll(() =>
      flip.locator('[data-flip-item="0"]').getAttribute("data-image-index"),
    )
    .toBe("1");
  const carousel = detail.locator(".carousel").first();
  await expect
    .poll(() => carousel.locator(".slides").evaluate((e) => e.scrollLeft))
    .toBeGreaterThan(0);
  await detail.close();
  expect(errors).toEqual([]);
});
test("店铺组件独立装修、应用、草稿保存及刷新保持一致", async ({ page }) => {
  const original = await readFile(draft, "utf8"),
    live = await readFile(published, "utf8");
  try {
    await page.goto("/admin");
    const frame = page.frameLocator("iframe");
    await frame
      .getByRole("heading", { name: "Douyin Shop", exact: true })
      .click();
    await page
      .getByText("CROCS童鞋-10.09—10.14-童享狂欢-活动主题", { exact: true })
      .filter({ visible: true })
      .click();
    await page
      .getByRole("button", { name: "装修完整店铺首页", exact: true })
      .click();
    const dialog = page.getByRole("dialog", { name: "抖音店铺首页装修" });
    const editor = dialog.frameLocator('iframe[title="店铺装修工作台"]');
    await expect(dialog).toBeVisible();
    await expect(
      editor.getByText("抖音店铺-静态海报", { exact: true }).first(),
    ).toBeVisible();
    await expect(
      editor.getByText("抖音店铺-轮播图", { exact: true }).first(),
    ).toBeVisible();
    const shopFrame = editor.frameLocator("iframe#preview-frame");
    await shopFrame.locator(".poster").first().click();
    await editor
      .getByRole("textbox", {
        name: "整图跳转（网址或 /shop/作品标识）",
        exact: true,
      })
      .fill("https://example.com/shop");
    const reference = editor
      .getByAltText("框选热区参考图")
      .filter({ visible: true });
    await reference.scrollIntoViewIfNeeded();
    await editor
      .getByRole("button", { name: "框选新热区", exact: true })
      .click();
    const bounds = await reference.boundingBox();
    if (!bounds) throw Error("热区定位图不存在");
    await page.mouse.move(
      bounds.x + bounds.width * 0.1,
      bounds.y + bounds.height * 0.1,
    );
    await page.mouse.down();
    await page.mouse.move(
      bounds.x + bounds.width * 0.4,
      bounds.y + bounds.height * 0.35,
      { steps: 4 },
    );
    await page.mouse.up();
    await editor
      .getByRole("textbox", { name: "目标网址", exact: true })
      .fill("https://example.com/hotspot");
    await page.screenshot({ path: ".cache/douyin-shop-editor.png" });
    await editor.getByRole("button", { name: "保存", exact: true }).click();
    await expect(editor.locator('span[role="status"]')).toContainText("已保存");
    await expect(dialog).toBeVisible();
    const saved = JSON.parse(await readFile(draft, "utf8"));
    const item = saved.content
      .find((c: any) => c.type === "DouyinGallery")
      .props.items.find((i: any) => i.slug === "crocs-10-09-10-14");
    expect(item.page.components[0].link).toBe("https://example.com/shop");
    expect(item.page.components[0].hotspots[0]).toMatchObject({
      action: "url",
      target: "https://example.com/hotspot",
    });
    expect(item.page.components[0].hotspots[0].width).toBeGreaterThan(25);
    expect(await readFile(published, "utf8")).toBe(live);
    await expect(page).toHaveURL(/\?shop=/);
    await page.reload();
    await expect(dialog).toBeVisible();
    await editor
      .frameLocator("iframe#preview-frame")
      .locator(".poster")
      .first()
      .click();
    await expect(
      editor.getByRole("textbox", {
        name: "整图跳转（网址或 /shop/作品标识）",
        exact: true,
      }),
    ).toHaveValue("https://example.com/shop");
    await editor
      .getByRole("button", { name: "← 返回上级", exact: true })
      .click();
    await expect(dialog).toHaveCount(0);
    await expect(page).toHaveURL(/\/admin$/);
    await expect(
      page.getByRole("button", { name: "保存草稿", exact: true }),
    ).toBeVisible();
  } finally {
    await writeFile(draft, original);
  }
});
test("店铺素材与贴片库隔离，非法配置和重复路由被拒绝", async ({ request }) => {
  const normal = await (await request.get("/image-library.json")).json(),
    shop = await (await request.get("/shop-image-library.json")).json();
  expect(
    normal.images.some((i: any) => i.src.startsWith("/images/douyin-shop/")),
  ).toBeFalsy();
  expect(shop.images.length).toBeGreaterThan(30);
  expect(
    shop.images.every((i: any) => i.src.startsWith("/images/douyin-shop/")),
  ).toBeTruthy();
  const snapshot = await readFile(draft, "utf8");
  for (const change of [
    (m: any) =>
      (m.items[0].page.components[0].image = "/images/works/other.jpg"),
    (m: any) => (m.items[1].slug = m.items[0].slug),
    (m: any) => (m.items[0].page.components[0].link = "javascript:alert(1)"),
    (m: any) =>
      (m.items[0].page.components[0].hotspots = [
        {
          x: 90,
          y: 0,
          width: 20,
          height: 10,
          action: "url",
          target: "https://example.com",
        },
      ]),
  ]) {
    const data = JSON.parse(snapshot);
    change(data.content.find((c: any) => c.type === "DouyinGallery").props);
    expect(
      (await request.put("/api/content", { headers: origin, data })).status(),
    ).toBe(400);
  }
  expect(await readFile(draft, "utf8")).toBe(snapshot);
  const image = shop.images[0].src;
  const buffer = await (await request.get(image)).body();
  const upload = await request.post("/api/shop-assets", {
    headers: {
      ...origin,
      "Content-Type": "application/octet-stream",
      "X-File-Name": encodeURIComponent(image.split("/").at(-1)),
      "X-Shop-Project": image.split("/")[3],
    },
    data: buffer,
  });
  expect(upload.ok()).toBeTruthy();
  expect((await upload.json()).imported).toBeFalsy();
  expect(
    (
      await request.post("/api/shop-assets", {
        headers: {
          Origin: "https://example.com",
          "Content-Type": "application/octet-stream",
        },
        data: buffer,
      })
    ).status(),
  ).toBe(403);
});
test("装修默认手机、页头随滚动，选中后可点Tab并按独立数值修改", async ({
  page,
}) => {
  const original = await readFile(draft, "utf8");
  try {
    await page.goto("/admin");
    await page
      .frameLocator("iframe")
      .getByRole("heading", { name: "Douyin Shop", exact: true })
      .click();
    await page
      .getByText("CROCS童鞋-10.09—10.14-童享狂欢-活动主题", { exact: true })
      .filter({ visible: true })
      .click();
    await page
      .getByRole("button", { name: "装修完整店铺首页", exact: true })
      .click();
    const dialog = page.getByRole("dialog", { name: "抖音店铺首页装修" });
    const editor = dialog.frameLocator('iframe[title="店铺装修工作台"]');
    const frame = editor.frameLocator("iframe#preview-frame");
    expect(
      await frame
        .locator("body")
        .evaluate((e) => e.ownerDocument.defaultView!.innerWidth),
    ).toBe(390);
    const header = frame.getByAltText("店铺页头");
    const spacing = await frame
      .locator(".poster")
      .first()
      .evaluate((first) => {
        const root = first.closest("[data-shop-block]")!.parentElement!;
        const blocks = [
          ...root.parentElement!.querySelectorAll("[data-shop-block]"),
        ];
        const a = blocks[0]
          .querySelector(".component")!
          .getBoundingClientRect();
        const b = blocks[1]
          .querySelector(".component")!
          .getBoundingClientRect();
        return { width: a.width, left: a.left, gap: b.top - a.bottom };
      });
    expect(spacing.width).toBeCloseTo((390 * 750) / 790, 1);
    expect(spacing.left).toBeCloseTo((390 * 20) / 790, 1);
    expect(spacing.gap).toBeCloseTo((390 * 20) / 790, 1);

    expect(
      await header.evaluate((e) => getComputedStyle(e.parentElement!).position),
    ).toBe("relative");
    const tabs = frame.locator(".tab-carousel").first();
    await tabs.click({ position: { x: 3, y: 3 } });
    await expect(
      editor.getByRole("spinbutton", {
        name: "初始标签（从0开始）",
        exact: true,
      }),
    ).toBeVisible();
    await tabs.locator(".tab-thumb").first().click();
    await expect(tabs.locator(".tab-slide").first()).toHaveClass(/active/);
    await tabs.locator(".tab-thumb").nth(1).click();
    await expect(tabs.locator(".tab-slide").nth(1)).toHaveClass(/active/);
    await editor
      .getByRole("textbox", {
        name: "内容区域（宽度/高度/上距/左距）",
        exact: true,
      })
      .fill("718/744/0/12.5");
    await expect
      .poll(() =>
        tabs
          .locator(".tab-content")
          .evaluate((e) => parseFloat((e as HTMLElement).style.left)),
      )
      .toBeCloseTo((12.5 / 718) * 100, 3);
    await expect
      .poll(() => header.boundingBox().then((b) => b?.y ?? 0))
      .toBeLessThan(0);
    expect(
      await editor
        .getByRole("textbox", {
          name: "缩略图区域（宽度/高度/上距/左距）",
          exact: true,
        })
        .evaluate((e) => e.getBoundingClientRect().right <= window.innerWidth),
    ).toBeTruthy();
    await page.screenshot({ path: ".cache/shop-selected-tab-mobile.png" });
    await frame.locator(".flip-grid").click({ position: { x: 3, y: 3 } });
    await editor
      .getByRole("textbox", { name: "网格行列（行数/列数）", exact: true })
      .fill("4/3");
    await expect(frame.locator(".flip-grid .flip-item")).toHaveCount(12);
    await expect(
      editor.getByText("第 12 格", { exact: true }).filter({ visible: true }),
    ).toBeVisible();
    await expect(
      editor.getByRole("button", { name: "框选新热区", exact: true }),
    ).toBeVisible();

    await editor.getByRole("button", { name: "保存", exact: true }).click();
    await expect(editor.locator('span[role="status"]')).toContainText("已保存");
    await expect(dialog).toBeVisible();
    const data = JSON.parse(await readFile(draft, "utf8"));
    const item = data.content.find((c: any) => c.type === "DouyinGallery").props
      .items[1];
    expect(
      item.page.components.find((c: any) => c.type === "tabCarousel")
        .contentBox,
    ).toBe("718|744|0|12.5");
  } finally {
    await writeFile(draft, original);
  }
});
test("一级KV沿用贴片尺寸参数且无描述，单图选择归入当前店铺项目", async ({
  page,
  request,
}) => {
  const original = await readFile(draft, "utf8");
  try {
    await page.goto("/");
    await expect(page.locator("#douyin-shop figcaption")).toHaveCount(0);
    const data = JSON.parse(original),
      gallery = data.content.find((c: any) => c.type === "DouyinGallery").props;
    for (const item of gallery.items) {
      expect(item.cover).toContain(`/douyin-shop/${item.page.assetFolder}/`);
      expect(
        item.page.components.every(
          (c: any) =>
            !JSON.stringify(c).match(
              /\/images\/douyin-shop\/(?:素材|店铺页头)/,
            ),
        ),
      ).toBeTruthy();
    }
    await page.goto("/admin");
    await page
      .frameLocator("iframe")
      .getByRole("heading", { name: "Douyin Shop", exact: true })
      .click();
    await expect(
      page.getByRole("spinbutton", { name: "单图高度", exact: true }),
    ).toHaveValue(String(gallery.layout.imageHeight));
    await page
      .getByRole("spinbutton", { name: "单图高度", exact: true })
      .fill("500");
    await page
      .getByText("CROCS童鞋-10.09—10.14-童享狂欢-活动主题", { exact: true })
      .filter({ visible: true })
      .click();
    const expected = gallery.items[1];
    const image = await (await request.get(expected.cover)).body();
    const response = page.waitForResponse(
      (r) =>
        r.url().endsWith("/api/shop-assets") && r.request().method() === "POST",
    );
    await page
      .locator('[class*="picker"]:visible input[type="file"]')
      .setInputFiles({
        name: expected.cover.split("/").at(-1),
        mimeType: "image/jpeg",
        buffer: image,
      });
    const result = await response;
    expect(result.request().headers()["x-shop-project"]).toBe(
      expected.page.assetFolder,
    );
    const body = await result.json();
    expect(body.src).toBe(expected.cover);
    expect(body.imported).toBeFalsy();
    await page.getByRole("button", { name: "保存草稿", exact: true }).click();
    await expect(page.locator('span[role="status"]')).toContainText(
      "草稿已保存",
    );
    expect(
      JSON.parse(await readFile(draft, "utf8")).content.find(
        (c: any) => c.type === "DouyinGallery",
      ).props.layout.imageHeight,
    ).toBe(500);
  } finally {
    await writeFile(draft, original);
  }
});

test("新店铺页头满宽、组件750与左右20及上下20等比适配", async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/shop/crocs-11-01-11-11");
    await expect(page.locator(".store-header")).toBeVisible();
    const layout = await page.locator("[data-shop-page]").evaluate((root) => {
      const box = root.getBoundingClientRect();
      const blocks = [...root.querySelectorAll(".component")].map((e) =>
        e.getBoundingClientRect(),
      );
      const header = root.ownerDocument
        .querySelector(".tabs")!
        .getBoundingClientRect();
      return {
        width: box.width,
        inset: blocks[0].left - box.left,
        blockWidth: blocks[0].width,
        headerGap: blocks[0].top - header.bottom,
        gaps: blocks.slice(1).map((b, i) => b.top - blocks[i].bottom),
      };
    });
    expect(layout.width).toBe(width === 390 ? 390 : 590);
    expect(layout.inset).toBeCloseTo((layout.width * 20) / 790, 1);
    expect(layout.blockWidth).toBeCloseTo((layout.width * 750) / 790, 1);
    expect(layout.headerGap).toBeCloseTo(0);
    layout.gaps.forEach((gap) =>
      expect(gap).toBeCloseTo((layout.width * 20) / 790, 1),
    );
    await page.screenshot({ path: `.cache/shop-flush-${width}.png` });
  }
});

test("店铺装修直达路径、上传标题及对应图片热区清晰，主编辑操作合并一行", async ({
  page,
}) => {
  await page.goto("/admin?shop=Crocs-Kids_2026_10-09_10-14");
  const dialog = page.getByRole("dialog", { name: "抖音店铺首页装修" });
  const editor = dialog.frameLocator('iframe[title="店铺装修工作台"]');
  const canvas = editor.frameLocator("iframe#preview-frame");
  const shopTitle = await editor
    .getByRole("heading", { name: "抖音店铺-首页装修" })
    .boundingBox();
  const shopSave = await editor
    .getByRole("button", { name: "保存", exact: true })
    .boundingBox();
  expect(Math.abs(shopTitle!.y - shopSave!.y)).toBeLessThan(30);
  await expect(
    editor.getByRole("button", { name: "撤销", exact: true }),
  ).toBeVisible();
  await canvas
    .locator(".tab-carousel")
    .first()
    .click({ position: { x: 3, y: 3 } });
  await editor
    .getByText("分类 1", { exact: true })
    .filter({ visible: true })
    .click();
  for (const name of ["选中缩略图图片", "未选中缩略图图片", "轮播图片"]) {
    await expect(
      editor.getByText(name, { exact: true }).filter({ visible: true }),
    ).toBeVisible();
  }
  await expect(
    editor.getByText("选择用于定位的参考图（只辅助框选）"),
  ).toHaveCount(0);
  const preview = editor
    .getByAltText("框选热区参考图")
    .filter({ visible: true });
  await expect(preview).toHaveCount(2);
  const data = JSON.parse(await readFile(draft, "utf8"));
  const item = data.content.find((b: any) => b.type === "DouyinGallery").props
    .items[1];
  const component = item.page.components.find(
    (c: any) => c.type === "tabCarousel",
  );
  expect(
    await preview.evaluateAll((images) =>
      images.map((image) => image.getAttribute("src")),
    ),
  ).toEqual(
    expect.arrayContaining([component.tabs[0].image, component.background]),
  );
  await canvas.locator(".flip-grid").click({ position: { x: 3, y: 3 } });
  await expect(
    editor
      .getByText("换一换按钮图片（透明图）", { exact: true })
      .filter({ visible: true }),
  ).toBeVisible();
  await page.screenshot({ path: ".cache/shop-upload-labels.png" });
  page.on("dialog", (dialog) => dialog.accept());
  await editor.getByRole("button", { name: "← 返回上级", exact: true }).click();
  await expect(page).toHaveURL(/\/admin$/);
  const save = await page
    .getByRole("button", { name: "保存草稿", exact: true })
    .boundingBox();
  const title = await page
    .getByRole("heading", { name: "作品集装修 首页" })
    .boundingBox();
  expect(save).not.toBeNull();
  expect(title).not.toBeNull();
  expect(Math.abs(save!.y - title!.y)).toBeLessThan(35);
  await page.screenshot({ path: ".cache/editor-merged-toolbar.png" });
});
