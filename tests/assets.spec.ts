import { test, expect } from "@playwright/test";
import { readFile, writeFile, unlink, rmdir } from "node:fs/promises";
const root = new URL("../", import.meta.url);
const draft = new URL("content/draft/home.json", root);
const headers = {
  Origin: "http://127.0.0.1:4321",
  "Content-Type": "application/octet-stream",
};
test("本地选图识别已有文件，未知图片真实导入；拒绝跨源和非图片", async ({
  request,
}) => {
  const cover = await readFile(
    new URL(
      "dist/images/works/250806_贴片_宠物生活_抢跑亚宠展/贴片预览.jpg",
      root,
    ),
  );
  const known = await request.post("/api/assets", { headers, data: cover });
  expect(known.ok()).toBeTruthy();
  expect(await known.json()).toMatchObject({
    src: "/images/works/250806_贴片_宠物生活_抢跑亚宠展/贴片预览.jpg",
    imported: false,
  });
  expect(
    (
      await request.post("/api/assets", {
        headers: { ...headers, Origin: "https://other.example" },
        data: cover,
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/assets", {
        headers,
        data: Buffer.from("<script>test</script>"),
      })
    ).status(),
  ).toBe(400);
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j7p8AAAAASUVORK5CYII=",
    "base64",
  );
  const uploaded = await request.post("/api/assets", {
    headers: { ...headers, "X-File-Name": encodeURIComponent("同名作品.png") },
    data: png,
  });
  expect(uploaded.ok()).toBeTruthy();
  const data = await uploaded.json();
  expect(data.src).toMatch(/^\/images\/uploads\/[a-f0-9]{64}\/同名作品\.png$/);
  try {
    expect(await readFile(new URL("public" + data.src, root))).toEqual(png);
    expect(
      (await (await request.get("/image-library.json")).json()).images.some(
        (i: { src: string }) => i.src === data.src,
      ),
    ).toBe(true);
  } finally {
    if (data.imported) {
      await unlink(new URL("public" + data.src, root));
      await rmdir(new URL(".", new URL("public" + data.src, root)));
    }
  }
});
test("原生作品列表按文件夹选素材、路径只读且无溢出，保存重载一致", async ({
  page,
}) => {
  const original = await readFile(draft, "utf8");
  const expo = "/images/works/250806_贴片_宠物生活_抢跑亚宠展/贴片预览.jpg";
  try {
    await page.goto("/admin");
    const frame = page.frameLocator("iframe");
    await frame.getByRole("heading", { name: "Overlay", exact: true }).click();
    await expect(
      page.getByRole("textbox", { name: "图片路径", exact: true }),
    ).toHaveCount(0);
    await expect(page.getByLabel("选择项目图片", { exact: true })).toHaveCount(
      0,
    );
    await expect(
      page.getByRole("button", { name: "上移", exact: true }),
    ).toHaveCount(0);
    const summary = page
      .locator('[aria-roledescription="draggable"]')
      .filter({ hasText: "动态贴片-毛孩子" })
      .filter({ visible: true })
      .first();
    await summary.click();
    const item = summary.locator("..");
    await expect(
      item.getByRole("radio", { name: "是", exact: true }),
    ).toBeChecked();
    await item
      .getByLabel("选择作品文件夹", { exact: true })
      .setInputFiles(
        decodeURIComponent(
          new URL("dist/images/works/250806_贴片_宠物生活_抢跑亚宠展/", root)
            .pathname,
        ),
      );
    const actual = item.getByRole("textbox", { name: "实际路径", exact: true });
    await expect(actual).toHaveValue(
      "/images/works/250806_贴片_宠物生活_抢跑亚宠展",
    );
    await expect(actual).toHaveJSProperty("readOnly", true);
    const boxes = await item.evaluate((e) => {
      const parent = e.getBoundingClientRect();
      return [...e.querySelectorAll("button,textarea,input:not([hidden])")].map(
        (child) => {
          const b = child.getBoundingClientRect();
          return { left: b.left - parent.left, right: b.right - parent.right };
        },
      );
    });
    for (const box of boxes) {
      expect(box.left).toBeGreaterThanOrEqual(-0.5);
      expect(box.right).toBeLessThanOrEqual(0.5);
    }
    await item.getByText("否", { exact: true }).click();
    await expect(
      frame.locator("#overlay figure").first().locator("a"),
    ).toHaveCount(0);
    await page.getByRole("button", { name: "保存草稿", exact: true }).click();
    await expect(page.locator('span[role="status"]').first()).toContainText(
      "草稿已保存",
    );
    await page.reload();
    await frame.getByRole("heading", { name: "Overlay", exact: true }).click();
    await expect(
      page.getByRole("textbox", { name: "图片路径", exact: true }),
    ).toHaveCount(0);
    const saved = JSON.parse(await readFile(draft, "utf8")).content.find(
      (m: { type: string }) => m.type === "OverlayGallery",
    ).props.items[0];
    expect(saved).toMatchObject({ src: expo, dynamic: false });
    expect(saved.workId).toBeUndefined();
    await page.screenshot({ path: ".cache/native-works-list-verified.png" });
  } finally {
    await writeFile(draft, original);
  }
});

test("作品列表沿用原生拖动排序和删除，保存后数据顺序一致", async ({ page }) => {
  const original = await readFile(draft, "utf8");
  try {
    await page.setViewportSize({ width: 1600, height: 1000 });
    await page.goto("/admin");
    await page
      .frameLocator("iframe")
      .getByRole("heading", { name: "Overlay", exact: true })
      .click();
    const summary = page
      .locator('[aria-roledescription="draggable"]')
      .filter({ hasText: "动态贴片-毛孩子" })
      .filter({ visible: true })
      .first();
    const grip = summary.locator('svg[viewBox="0 0 20 20"]');
    await grip.hover();
    const box = (await grip.boundingBox())!;
    await page.mouse.down();
    await page.mouse.move(box.x + 6, box.y + 75, { steps: 15 });
    await page.mouse.up();
    const status = page.locator('span[role="status"]').first();
    await expect(status).toContainText("有未保存修改");
    await page.getByRole("button", { name: "保存草稿", exact: true }).click();
    await expect(status).not.toContainText("有未保存修改");
    const current = JSON.parse(await readFile(draft, "utf8")).content.find(
      (m: { type: string }) => m.type === "OverlayGallery",
    ).props.items;
    expect(
      current.slice(0, 2).map((item: { alt: string }) => item.alt),
    ).toEqual(["动态贴片-猫王猫砂", "动态贴片-毛孩子"]);
    await summary.hover();
    await summary.getByRole("button", { name: "删除", exact: true }).click();
    await expect(status).toContainText("有未保存修改");
    await page.getByRole("button", { name: "保存草稿", exact: true }).click();
    await expect(status).not.toContainText("有未保存修改");
    expect(
      JSON.parse(await readFile(draft, "utf8"))
        .content.find((m: { type: string }) => m.type === "OverlayGallery")
        .props.items.map((item: { alt: string }) => item.alt),
    ).toEqual(["动态贴片-猫王猫砂", "动态贴片-亚宠展", "动态贴片-阿飞和巴弟"]);
  } finally {
    await writeFile(draft, original);
  }
});
