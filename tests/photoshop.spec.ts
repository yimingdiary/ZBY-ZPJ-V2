import { test, expect } from "@playwright/test";
test("PS 工具交互、滚轮、轨道和滑块与页面同步，正文仍可操作", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForFunction(() =>
    document
      .querySelector<HTMLObjectElement>("object[data-photoshop-frame]")
      ?.contentDocument?.querySelector("[data-ps-scrollbar-ready]"),
  );
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollbarWidth,
    ),
  ).toBe("none");
  await page.locator("header").evaluate((header) => {
    const section = document.createElement("section");
    section.innerHTML = '<button id="ps-test-action">正文按钮</button>';
    section.style.cssText = "height:3000px;padding:30px";
    section.querySelector("button")!.addEventListener("click", () => {
      section.dataset.clicked = "true";
    });
    header.after(section);
  });
  await page.locator("#ps-test-action").click();
  await expect(page.locator('section[data-clicked="true"]')).toHaveCount(1);
  const svg = page
    .frames()
    .find((f) => f.url().endsWith("/decorations/ps-yemian.svg"))!;
  await expect(svg.locator("[data-ps-tool]")).toHaveCount(28);
  // 原 SVG 的图标脚本设置两侧工具的悬停与选中样式。
  const tools = svg.locator("[data-ps-tool]");
  const before = await svg
    .locator(".ps-tool-selection-style")
    .first()
    .getAttribute("transform");
  await tools.nth(2).hover();
  await expect(svg.locator(".ps-tool-hover-style.is-visible")).toHaveCount(1);
  await tools.nth(2).click();
  expect(
    await svg
      .locator(".ps-tool-selection-style")
      .first()
      .getAttribute("transform"),
  ).not.toBe(before);
  await page.mouse.move(20, 500);
  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(300);
  const thumb = svg.locator("[data-ps-scrollbar-ready] > g > rect");
  const wrapper = svg.locator("[data-ps-scrollbar-ready] > g");
  await expect
    .poll(() => wrapper.getAttribute("transform"))
    .not.toBe("translate(0 0)");
  await page.evaluate(() => scrollTo(0, 0));
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await expect(wrapper).toHaveAttribute("transform", "translate(0 0)");
  const box = (await thumb.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 180, {
    steps: 8,
  });
  await page.mouse.up();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(500);
  await page.evaluate(() => scrollTo(0, 0));
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  const track = svg.locator("[data-ps-scrollbar-ready] > rect"),
    rect = (await track.boundingBox())!;
  await page.mouse.click(rect.x + rect.width / 2, rect.y + rect.height - 35);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(1500);
});
test("关闭 PS 外壳恢复原生滚动条，重新显示后只保留一套交互", async ({
  page,
}) => {
  await page.goto("/admin");
  const frame = page.frameLocator("iframe");
  await expect(frame.locator("object[data-photoshop-frame]")).toHaveCount(1);
  await expect
    .poll(() => frame.locator("html").getAttribute("data-ps-scrollbar"))
    .toBe("custom");
  await page.getByText("隐藏", { exact: true }).last().click();
  await expect(frame.locator("object")).toHaveCount(0);
  await expect
    .poll(() => frame.locator("html").getAttribute("data-ps-scrollbar"))
    .toBeNull();
  expect(
    await frame
      .locator("html")
      .evaluate((e) => getComputedStyle(e).scrollbarWidth),
  ).toBe("auto");
  await page.getByText("显示", { exact: true }).last().click();
  await expect
    .poll(() => frame.locator("html").getAttribute("data-ps-scrollbar"))
    .toBe("custom");
  await expect(frame.locator("style[data-ps-scrollbar-style]")).toHaveCount(1);
});
test("手机触摸外壳可滚动，拖动滑块不会被原生手势取消", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4321/");
    await page.waitForFunction(() =>
      document
        .querySelector<HTMLObjectElement>("object")
        ?.contentDocument?.querySelector("[data-ps-scrollbar-ready]"),
    );
    await page.locator("header").evaluate((e) => {
      const block = document.createElement("div");
      block.style.height = "3000px";
      e.parentElement!.append(block);
    });
    const svg = page
      .frames()
      .find((f) => f.url().endsWith("/decorations/ps-yemian.svg"))!;
    const thumb = svg.locator("[data-ps-scrollbar-ready] > g > rect");
    await expect
      .poll(() => thumb.evaluate((e) => e.getBoundingClientRect().height))
      .toBeLessThan(500);
    const box = (await thumb.boundingBox())!,
      x = box.x + box.width / 2,
      y = box.y + box.height / 2;
    const cdp = await context.newCDPSession(page);
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y, radiusX: 0.1, radiusY: 0.1 }],
    });
    for (let i = 1; i <= 6; i++)
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x, y: y + 30 * i, radiusX: 0.1, radiusY: 0.1 }],
      });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(400);
  } finally {
    await context.close();
  }
});
