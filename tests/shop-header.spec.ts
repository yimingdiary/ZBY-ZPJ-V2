import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
const reference =
  "/CROCS%E5%BA%97%E9%93%BAUI%E5%8E%9F%E5%9E%8B/dist/index.html";
const path = "/shop/crocs-9-28-10-07";
const shape = async (page: any) =>
  page.evaluate(() =>
    [
      ".toolbar",
      ".search",
      ".wordmark",
      ".name-row",
      ".reputation",
      ".benefit-cards",
      ".official-banner",
      ".tabs",
    ].map((selector) => {
      const el = document.querySelector(selector) as HTMLElement,
        r = el.getBoundingClientRect(),
        s = getComputedStyle(el);
      return {
        selector,
        x: r.x,
        y: r.y,
        width: r.width,
        height: r.height,
        font: s.fontSize,
        line: s.lineHeight,
        radius: s.borderRadius,
        background: s.backgroundImage.replace(/url\("[^"]*\//g, 'url("'),
        opacity: s.opacity,
      };
    }),
  );
test("直接沿用原型样式：手机与桌面展开、收起的尺寸和排版一致", async ({
  page,
}) => {
  for (const name of [
    "style.css",
    "header-motion.css",
    "source-style.css",
    "ios-refinement.css",
  ])
    expect(
      await readFile(
        new URL("../public/shop-ui/" + name, import.meta.url),
        "utf8",
      ),
    ).toBe(
      await readFile(
        new URL("../public/CROCS店铺UI原型/dist/" + name, import.meta.url),
        "utf8",
      ),
    );
  for (const width of [402, 390, 1440]) {
    await page.setViewportSize({ width, height: 874 });
    await page.goto(reference);
    await page.waitForFunction(() => !!(window as any).shopMotion);
    const expanded = await shape(page);
    await page.evaluate(() =>
      scrollTo(0, (window as any).shopMotion.foldRange()),
    );
    await expect
      .poll(() =>
        page
          .locator(".mini-brand")
          .evaluate((el) => getComputedStyle(el).opacity),
      )
      .toBe("1");
    const folded = await shape(page);
    await page.goto(path);
    await page.waitForFunction(() => !!(window as any).shopMotion);
    expect(await shape(page)).toEqual(expanded);
    await page.evaluate(() =>
      scrollTo(0, (window as any).shopMotion.foldRange()),
    );
    await expect
      .poll(() =>
        page
          .locator(".mini-brand")
          .evaluate((el) => getComputedStyle(el).opacity),
      )
      .toBe("1");
    expect(await shape(page)).toEqual(folded);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
test("原版商品排序分类和关注保持可用，品牌组件保留，没有弹窗与悬浮直播", async ({
  page,
}) => {
  const errors: string[] = [],
    failed: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push(r.url());
  });
  await page.setViewportSize({ width: 402, height: 874 });
  await page.goto(path);
  const brand = page.locator("#panel-brand");
  await expect(brand.locator(".component")).toHaveCount(9);
  const images = await brand
    .locator(".component img")
    .evaluateAll((els) => els.map((el) => el.getAttribute("src")));
  const follow = page.locator("#follow");
  await follow.click();
  await expect(follow).toHaveAttribute("aria-pressed", "true");
  await follow.click();
  await expect(follow).toHaveAttribute("aria-pressed", "false");
  for (const action of [
    "store-info",
    "search",
    "share",
    "reputation",
    "live",
    "member",
    "certification",
  ])
    await page.locator(`[data-action="${action}"]`).last().click();
  await expect(
    page.locator("[role=dialog],.overlay,.floating-live"),
  ).toHaveCount(0);
  await page.getByRole("tab", { name: "商品", exact: true }).click();
  await expect(page.locator("#products .product-card")).toHaveCount(10);
  await page.locator("[data-sort=price]").click();
  await expect(page.locator("#products .product-card").first()).toHaveAttribute(
    "data-product",
    "4",
  );
  await expect
    .poll(() =>
      page
        .locator("#products img")
        .evaluateAll((els: HTMLImageElement[]) =>
          els.slice(0, 4).every((el) => el.complete && el.naturalWidth > 0),
        ),
    )
    .toBe(true);
  await page.getByRole("tab", { name: "分类", exact: true }).click();
  await page.locator("[data-category=warm]").click();
  await expect(page.locator("#categories .product-card")).toHaveCount(4);
  await page.getByRole("tab", { name: "新品", exact: true }).click();
  await expect(page.locator("#newProducts .product-card")).toHaveCount(4);
  await page.locator("#newProducts .product-card").first().click();
  await expect(
    page.locator("[role=dialog],.overlay,.floating-live"),
  ).toHaveCount(0);
  await page.getByRole("tab", { name: "品牌", exact: true }).click();
  expect(
    await brand
      .locator(".component img")
      .evaluateAll((els) => els.map((el) => el.getAttribute("src"))),
  ).toEqual(images);
  await brand.locator(".tab-thumb").nth(1).click();
  await expect(
    brand.locator(".tab-carousel").first().locator(".tab-slide").nth(1),
  ).toHaveClass(/active/);
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
});
test("原版触摸口碑横滑、栏目横滑和自动收起仍可用", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 402, height: 874 },
    isMobile: true,
    hasTouch: true,
  });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4321" + path);
    await page.waitForFunction(() => !!(window as any).shopMotion);
    const cdp = await context.newCDPSession(page);
    const swipe = async (x1: number, y: number, x2: number) => {
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x: x1, y }],
      });
      for (let i = 1; i <= 8; i++)
        await cdp.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [{ x: x1 + ((x2 - x1) * i) / 8, y }],
        });
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
    };
    const tags = page.locator(".tag-scroll"),
      box = (await tags.boundingBox())!;
    await swipe(box.x + box.width - 10, box.y + box.height / 2, box.x + 10);
    await expect
      .poll(() => tags.evaluate((el) => el.scrollLeft))
      .toBeGreaterThan(20);
    expect(await page.evaluate(() => scrollY)).toBe(0);
    await page.evaluate(() => scrollTo(0, 110));
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(214);
    await page.getByRole("tab", { name: "商品", exact: true }).click();
    await swipe(350, 200, 80);
    await expect(
      page.getByRole("tab", { name: "分类", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
  } finally {
    await context.close();
  }
});
