import { test, expect } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
const draft = new URL("../content/draft/home.json", import.meta.url);
const published = new URL("../content/published/home.json", import.meta.url);
test("目录和结束页真实文字、手机布局及装饰显隐", async ({ page, request }) => {
  const original = await readFile(published, "utf8");
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  try {
    for (const width of [1920, 390]) {
      await page.setViewportSize({
        width,
        height: width === 1920 ? 1080 : 844,
      });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      for (const id of ["contents", "closing"]) {
        const section = page.locator("#" + id);
        await section.scrollIntoViewIfNeeded();
        await expect(section).toBeVisible();
      }
      await expect(page.locator('#contents svg[role="img"]')).toHaveCount(5);
      await expect(page.locator('#contents a[href="#overlay"]')).toHaveCount(1);
      await expect(
        page.getByRole("heading", { name: "THANKYOU", exact: true }),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    }
    const data = JSON.parse(original);
    data.root.props.chrome = false;
    await writeFile(published, JSON.stringify(data));
    await page.reload();
    await expect(page.locator("#contents image")).toHaveCount(5);
    await expect(
      page.locator('#closing image[href$="closing-guides.svg"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('#closing image[href$="closing-flower.svg"]'),
    ).toHaveCount(1);
    const invalid = structuredClone(data);
    invalid.content.find(
      (m: { type: string }) => m.type === "Contents",
    ).props.items[0].href = "javascript:alert(1)";
    expect(
      (
        await request.put("/api/content", {
          headers: { Origin: "http://127.0.0.1:4321" },
          data: invalid,
        })
      ).status(),
    ).toBe(400);
  } finally {
    await writeFile(published, original);
  }
  expect(errors).toEqual([]);
});
test("目录与结束页后台编辑保存重载，草稿不改公开内容", async ({ page }) => {
  const original = await readFile(draft, "utf8");
  const publishedBefore = await readFile(published, "utf8");
  try {
    await page.goto("/admin");
    const frame = page.frameLocator("iframe");
    await frame.getByRole("heading", { name: "Contents", exact: true }).click();
    await page
      .getByRole("textbox", { name: "目录中文标题", exact: true })
      .fill("目录保存验证");
    await expect(
      frame.getByText("目录保存验证", { exact: true }),
    ).toBeVisible();
    await frame.getByRole("heading", { name: "THANKYOU", exact: true }).click();
    await page
      .getByRole("textbox", { name: "祝福语", exact: true })
      .fill("[结束页保存验证]");
    await page.getByRole("button", { name: "保存草稿", exact: true }).click();
    await expect(page.locator('span[role="status"]')).toContainText(
      "草稿已保存",
    );
    await page.reload();
    await expect(
      frame.getByText("目录保存验证", { exact: true }),
    ).toBeVisible();
    await expect(
      frame.getByText("[结束页保存验证]", { exact: true }),
    ).toBeVisible();
    expect(await readFile(published, "utf8")).toBe(publishedBefore);
  } finally {
    await writeFile(draft, original);
  }
});
