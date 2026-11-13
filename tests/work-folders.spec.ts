import { test, expect } from "@playwright/test";
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
const root = new URL("../", import.meta.url);
const backupPaths = [
  "public/images/works/catalog.json",
  "src/content/page.schema.json",
  "src/content/compiled-validation.mjs",
  "public/image-library.json",
  "content/draft/home.json",
];
test("新作品文件夹识别封面和导出坐标，保留未保存名称并可重载", async ({
  page,
}) => {
  const backups = await Promise.all(
    backupPaths.map((p) => readFile(new URL(p, root), "utf8")),
  );
  const directory = await mkdtemp(
    decodeURIComponent(new URL(".cache/作品文件夹测试_", root).pathname),
  );
  const folder = directory.split("/").pop()!;
  const png = await readFile(
    new URL(
      "public/images/works/250806_贴片_宠物生活_抢跑亚宠展/贴片预览.jpg",
      root,
    ),
  );
  let imported: string | undefined;
  try {
    await writeFile(directory + "/贴片预览.jpg", png);
    await writeFile(directory + "/背景.jpg", png);
    await writeFile(
      directory + "/" + folder + "_layout.json",
      JSON.stringify({
        canvas: { width: 1080, height: 1920 },
        items: {
          background: {
            name: "背景",
            image: "背景.jpg",
            x: 0,
            y: 0,
            width: 1,
            height: 1,
          },
        },
      }),
    );
    await writeFile(
      directory + "/无关配置.json",
      JSON.stringify({ note: "不应作为作品素材发布" }),
    );
    await page.goto("/admin");
    const frame = page.frameLocator("iframe");
    await frame.getByRole("heading", { name: "Overlay", exact: true }).click();
    const summary = page
      .locator('[aria-roledescription="draggable"]')
      .filter({ hasText: "动态贴片-毛孩子" })
      .filter({ visible: true })
      .first();
    await summary.click();
    const item = summary.locator("..");
    await item
      .getByRole("textbox", { name: "作品名称", exact: true })
      .fill("未保存的作品名称");
    // A folder import changes the catalog; editor input must survive that update.
    const responsePromise = page.waitForResponse(
      (r) =>
        r.url().endsWith("/api/work-folders") &&
        r.request().method() === "POST",
    );
    await page
      .locator('[aria-roledescription="draggable"]')
      .filter({ hasText: "未保存的作品名称" })
      .filter({ visible: true })
      .first()
      .locator("..")
      .getByLabel("选择作品文件夹", { exact: true })
      .setInputFiles(directory);
    const response = await responsePromise;
    const data = await response.json();
    expect(response.ok(), JSON.stringify(data)).toBeTruthy();
    imported = data.folder;
    await expect(
      page.getByRole("textbox", { name: "作品名称", exact: true }),
    ).toHaveValue("未保存的作品名称");
    await expect(
      page.getByRole("textbox", { name: "实际路径", exact: true }),
    ).toHaveValue(data.folder);
    await page
      .getByText("否", { exact: true })
      .filter({ visible: true })
      .click();
    const savedResponse = page.waitForResponse(
      (r) => r.url().endsWith("/api/content") && r.request().method() === "PUT",
    );
    await page.getByRole("button", { name: "保存草稿", exact: true }).click();
    const saved = await savedResponse;
    expect(saved.ok(), await saved.text()).toBe(true);
    expect(
      saved
        .request()
        .postDataJSON()
        .content.find((m: { type: string }) => m.type === "OverlayGallery")
        .props.items[0],
    ).toMatchObject({ src: data.src, alt: "未保存的作品名称", dynamic: false });
    await expect(page.locator('span[role="status"]').first()).toContainText(
      "草稿已保存",
    );
    const content = JSON.parse(
      await readFile(new URL("content/draft/home.json", root), "utf8"),
    );
    expect(
      content.content.find((m: { type: string }) => m.type === "OverlayGallery")
        .props.items[0],
    ).toMatchObject({ src: data.src, alt: "未保存的作品名称", dynamic: false });
    await expect(
      readFile(new URL("public" + data.folder + "/无关配置.json", root)),
    ).rejects.toThrow();
    await page.reload();
    await frame.getByRole("heading", { name: "Overlay", exact: true }).click();
    await page
      .locator('[aria-roledescription="draggable"]')
      .filter({ hasText: "未保存的作品名称" })
      .filter({ visible: true })
      .first()
      .click();
    await expect(
      page.getByRole("textbox", { name: "实际路径", exact: true }),
    ).toHaveValue(data.folder);
    expect(
      (
        await readFile(
          new URL("public" + data.folder + "/作品.json", root),
          "utf8",
        )
      ).length,
    ).toBeGreaterThan(0);
  } finally {
    await page.close();
    for (let i = 0; i < backupPaths.length; i++)
      await writeFile(new URL(backupPaths[i], root), backups[i]);
    if (imported && imported.startsWith("/images/works/" + folder))
      await rm(new URL("public" + imported, root), {
        recursive: true,
        force: true,
      });
    await rm(directory, { recursive: true, force: true });
  }
});
test("文件夹缺少规范封面或坐标时明确拒绝，目录穿越及跨源请求不能写入", async ({
  request,
}) => {
  const entries = JSON.stringify([
    { field: "file0", path: "作品/../越界.jpg" },
  ]);
  const r = await request.post("/api/work-folders", {
    headers: { Origin: "http://127.0.0.1:4321" },
    multipart: {
      entries,
      file0: {
        name: "越界.jpg",
        mimeType: "image/jpeg",
        buffer: Buffer.from("invalid"),
      },
    },
  });
  expect(r.status()).toBe(400);
  const cross = await request.post("/api/work-folders", {
    headers: { Origin: "https://outside.example" },
    multipart: { entries },
  });
  expect(cross.status()).toBe(403);
});
