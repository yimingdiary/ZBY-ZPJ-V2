import { test, expect } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
const draft = new URL("../content/draft/home.json", import.meta.url);
const published = new URL("../content/published/home.json", import.meta.url);
const headers = { Origin: "http://127.0.0.1:4321" };
test("真实保存与重载、发布隔离及新增模块兼容", async ({ request, page }) => {
  const originalDraft = await readFile(draft, "utf8"),
    originalPublished = await readFile(published, "utf8");
  try {
    const data = JSON.parse(originalDraft);
    data.content[1].props.subtitle = "[测试修改]";
    data.content.push({
      type: "Footer",
      props: {
        id: "independent-test-module",
        version: 1,
        years: "2099",
        category: "独立模块",
      },
    });
    const saved = await request.put("/api/content", { headers, data });
    expect(saved.ok()).toBeTruthy();
    expect(JSON.parse(await readFile(draft, "utf8"))).toEqual(data);
    expect((await (await request.get("/api/content")).json()).data).toEqual(
      data,
    );
    expect(await readFile(published, "utf8")).toBe(originalPublished);
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "[設計作品集]", exact: true }),
    ).toBeVisible();
    const result = await request.post("/api/content", { headers, data });
    expect(result.ok()).toBeTruthy();
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "[测试修改]", exact: true }),
    ).toBeVisible();
    await expect(page.locator("footer")).toHaveCount(3);
    await expect(
      page.getByRole("heading", { name: "PORTFOLIO", exact: true }),
    ).toBeVisible();
  } finally {
    await writeFile(draft, originalDraft);
    await writeFile(published, originalPublished);
  }
});
test("拒绝非法属性、重复 ID 和跨源写入", async ({ request }) => {
  const data = JSON.parse(await readFile(draft, "utf8"));
  const snapshot = await readFile(draft, "utf8");
  const invalid = structuredClone(data);
  invalid.content[1].props.ink = "red; display:none";
  expect(
    (await request.put("/api/content", { headers, data: invalid })).status(),
  ).toBe(400);
  const duplicate = structuredClone(data);
  duplicate.content[1].props.id = duplicate.content[0].props.id;
  expect(
    (await request.put("/api/content", { headers, data: duplicate })).status(),
  ).toBe(400);
  expect(
    (
      await request.put("/api/content", {
        headers: { Origin: "https://untrusted.example" },
        data,
      })
    ).status(),
  ).toBe(403);
  expect(await readFile(draft, "utf8")).toBe(snapshot);
});
test("桌面和手机字体、真实文字、无溢出及无前端异常", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const viewport of [
    { width: 1920, height: 1080 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(
      page.getByRole("heading", { name: "PORTFOLIO", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    expect(
      await page.evaluate(() => document.fonts.check("24px Gerbil")),
    ).toBeTruthy();
    await page.screenshot({
      path: `.cache/home-${viewport.width}.png`,
      fullPage: true,
    });
  }
  expect(errors).toEqual([]);
});
test("中文编辑器可加载及修改后实际保存", async ({ page }) => {
  const original = await readFile(draft, "utf8");
  try {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width: 1600, height: 1000 });
    await page.goto("/admin");
    await expect(
      page.getByText("本地开发模式 · 内容保存为 JSON", { exact: true }),
    ).toBeVisible();
    const frame = page.frameLocator("iframe");
    await expect(
      frame.getByRole("heading", { name: "PORTFOLIO", exact: true }),
    ).toBeVisible();
    await expect(
      frame.locator('image[href="/decorations/portfolio-guides.svg"]'),
    ).toHaveCount(1);
    await page.getByText("隐藏", { exact: true }).last().click();
    await expect(
      frame.locator('image[href="/decorations/portfolio-guides.svg"]'),
    ).toHaveCount(1);
    await expect(frame.locator('[class*="_workspace_"]')).toHaveCount(0);
    expect(
      await frame
        .locator('[class*="_bare_"]')
        .evaluate((el) => getComputedStyle(el).padding),
    ).toBe("0px");
    await page.getByText("显示", { exact: true }).last().click();
    await expect(
      frame.locator('image[href="/decorations/portfolio-guides.svg"]'),
    ).toHaveCount(1);
    await frame
      .getByRole("heading", { name: "PORTFOLIO", exact: true })
      .click();
    await expect(
      page.getByRole("textbox", { name: "中文副标题" }),
    ).toBeVisible();
    await page.getByRole("textbox", { name: "中文副标题" }).fill("[后台实测]");
    await expect(
      frame.getByRole("heading", { name: "[后台实测]", exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "保存草稿", exact: true }).click();
    await expect(page.locator('span[role="status"]')).toContainText(
      "草稿已保存",
    );
    expect(
      JSON.parse(await readFile(draft, "utf8")).content[1].props.subtitle,
    ).toBe("[后台实测]");
    await page.reload();
    await expect(
      frame.getByRole("heading", { name: "[后台实测]", exact: true }),
    ).toBeVisible();
    await page.screenshot({
      path: ".cache/admin-verified.png",
      fullPage: true,
    });
    expect(errors).toEqual([]);
  } finally {
    await writeFile(draft, original);
  }
});
