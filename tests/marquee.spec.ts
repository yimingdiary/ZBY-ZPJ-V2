import { test, expect } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import { marqueeFixture } from "./fixtures/marquee";
const draft = "content/draft/home.json";
test("左右连续多圈在zoom和transform下接缝一致，图片比例与手势暂停链接", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.goto("/local-test/marquee");
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".marquee-group img")].every(
      (i: any) => i.complete && i.naturalWidth,
    ),
  );
  for (const [width, zoom, transform] of [
    [718, 1, 1],
    [375, 1, 1],
    [718, 0.4746835443, 1],
    [718, 1, 0.61],
  ]) {
    await page.locator("#canvas").evaluate(
      (e: any, v) => {
        e.style.width = v[0] + "px";
        e.style.zoom = v[1];
        e.style.transform = `scale(${v[2]})`;
      },
      [width, zoom, transform],
    );
    for (const index of [0, 1]) {
      const stats = await page
        .locator(".image-marquee")
        .nth(index)
        .evaluate(async (el: any) => {
          const group = el.querySelector(".marquee-group"),
            track = el.querySelector(".marquee-track"),
            image = group.querySelector("img");
          const scale = el.getBoundingClientRect().width / el.clientWidth;
          const ratio =
            image.getBoundingClientRect().width /
            image.getBoundingClientRect().height;
          let previous: any = null,
            wraps = 0,
            maxError = 0,
            coverage = true;
          await new Promise<void>((resolve) => {
            const until = performance.now() + 3500;
            function frame(t: number) {
              const offset = -new DOMMatrixReadOnly(
                getComputedStyle(track).transform,
              ).m41;
              const period = group.getBoundingClientRect().width / scale;
              if (previous) {
                const delta = offset - previous.offset;
                const dir =
                  el === el.parentElement.querySelector(".image-marquee")
                    ? 1
                    : -1;
                if (delta * dir < 0) {
                  wraps++;
                  const expected =
                    (((dir * Math.min(64, t - previous.t)) / 0.2) *
                      el.clientWidth) /
                    718;
                  maxError = Math.max(
                    maxError,
                    Math.abs(delta + dir * period - expected) * scale,
                  );
                }
              }
              const rect = el
                .querySelector(".marquee-window")
                .getBoundingClientRect();
              const last = track.lastElementChild.getBoundingClientRect();
              coverage &&= last.right >= rect.right - 1;
              previous = { offset, t };
              if (t < until) requestAnimationFrame(frame);
              else resolve();
            }
            requestAnimationFrame(frame);
          });
          return {
            ratio,
            height: image.getBoundingClientRect().height,
            moduleHeight: el.getBoundingClientRect().height,
            wraps,
            maxError,
            coverage,
          };
        });
      expect(stats.ratio).toBeCloseTo(180 / 212, 2);
      expect(stats.height).toBeCloseTo(stats.moduleHeight, 1);
      expect(stats.wraps).toBeGreaterThanOrEqual(7);
      expect(stats.maxError).toBeLessThan(1);
      expect(stats.coverage).toBeTruthy();
    }
  }
  await page.locator("#canvas").evaluate((e: any) => {
    e.style.width = "718px";
    e.style.zoom = 1;
    e.style.transform = "none";
  });
  const viewport = page.locator(".marquee-window").first(),
    track = page.locator(".marquee-track").first();
  const box = (await viewport.boundingBox())!;
  await page.mouse.move(box.x + 200, box.y + 80);
  await page.mouse.down();
  await page.mouse.move(box.x + 270, box.y + 80, { steps: 6 });
  await page.mouse.up();
  const paused = await track.getAttribute("style");
  await page.waitForTimeout(300);
  expect(await track.getAttribute("style")).toBe(paused);
  await page.waitForTimeout(650);
  expect(await track.getAttribute("style")).not.toBe(paused);
  // A clone added for short groups must also use the same navigation behavior.
  await page.evaluate(() => {
    (window as any).opened = [];
    window.open = ((url: any) => {
      (window as any).opened.push(url);
      return null;
    }) as any;
  });
  await viewport.dispatchEvent("pointerdown", {
    button: 0,
    pointerId: 11,
    clientX: 100,
  });
  await viewport.dispatchEvent("pointerup", { pointerId: 11 });
  await page
    .locator(".marquee-group")
    .first()
    .locator("a")
    .first()
    .dispatchEvent("click");
  await page.locator(".hotspot").first().dispatchEvent("click");
  expect(await page.evaluate(() => (window as any).opened)).toEqual([
    "https://example.com/marquee-1",
    "https://example.com/hotspot",
  ]);
  await page.screenshot({ path: ".cache/marquee-demo.png" });
});
test("现有保存接口校验、编辑器真实缩放和刷新恢复，发布内容不变", async ({
  page,
  request,
}) => {
  const original = await readFile(draft, "utf8"),
    published = await readFile("content/published/home.json", "utf8");
  try {
    const data = JSON.parse(original),
      item = data.content.find((c: any) => c.type === "DouyinGallery").props
        .items[0];
    item.page.assetFolder = "marquee-test";
    item.page.components.unshift(marqueeFixture());
    const headers = { Origin: "http://127.0.0.1:4321" };
    expect(
      (await request.put("/api/content", { headers, data })).ok(),
    ).toBeTruthy();
    for (const change of [
      (c: any) => (c.items = Array(31).fill(c.items[0])),
      (c: any) => (c.items[0].link = "javascript:alert(1)"),
      (c: any) => (c.scrollBox = "0|0|0|542"),
      (c: any) => (c.items[0].images[0].src = "/api/asset/7"),
    ]) {
      const bad = structuredClone(data);
      change(
        bad.content.find((c: any) => c.type === "DouyinGallery").props.items[0]
          .page.components[0],
      );
      expect(
        (await request.put("/api/content", { headers, data: bad })).status(),
      ).toBe(400);
    }
    await page.goto("/admin?shop=" + item.page.assetFolder);
    const editor = page.frameLocator('iframe[title="店铺装修工作台"]'),
      canvas = editor.frameLocator("iframe#preview-frame");
    const component = canvas.locator(".image-marquee");
    await expect(component).toBeVisible();
    await component.click({ position: { x: 2, y: 2 } });
    await expect(
      editor.getByRole("spinbutton", {
        name: "组件高度（718 基准）",
        exact: true,
      }),
    ).toHaveValue("212");
    await editor.getByRole("button", { name: "缩小画布", exact: true }).click();
    await editor.getByRole("button", { name: "缩小画布", exact: true }).click();
    const circles = await component.evaluate(async (e: any) => {
      const track = e.querySelector(".marquee-track");
      let prev = 0,
        wraps = 0;
      await new Promise<void>((resolve) => {
        const until = performance.now() + 1800;
        function tick(t: number) {
          const n = -new DOMMatrixReadOnly(getComputedStyle(track).transform)
            .m41;
          if (n < prev) wraps++;
          prev = n;
          if (t < until) requestAnimationFrame(tick);
          else resolve();
        }
        requestAnimationFrame(tick);
      });
      return wraps;
    });
    expect(circles).toBeGreaterThan(7);

    await editor
      .getByRole("textbox", {
        name: "滚动区域（左距/上距/宽度/高度）",
        exact: true,
      })
      .fill("0/0/718/542");
    const dimensions = await component.evaluate((e: any) => {
      const img = e.querySelector(".marquee-group img");
      return {
        w: e.getBoundingClientRect().width,
        h: img.getBoundingClientRect().height,
        ratio:
          img.getBoundingClientRect().width /
          img.getBoundingClientRect().height,
      };
    });
    expect(dimensions.h).toBeCloseTo((dimensions.w * 212) / 718, 1);
    expect(dimensions.ratio).toBeCloseTo(180 / 212, 2);
    await editor
      .getByText("第 1 张", { exact: true })
      .filter({ visible: true })
      .click();
    const firstRow = editor
      .getByText("第 1 张", { exact: true })
      .filter({ visible: true })
      .locator("..");
    const uploadResponse = page.waitForResponse(
      (r) =>
        r.url().endsWith("/api/shop-assets") && r.request().method() === "POST",
    );
    await firstRow
      .locator("input[type=file]")
      .setInputFiles("public/images/douyin-shop/marquee-test/card-3.png");
    expect((await uploadResponse).ok()).toBeTruthy();
    await expect(
      firstRow.getByRole("textbox", { name: "图片路径", exact: true }),
    ).toHaveValue("/images/douyin-shop/marquee-test/card-3.png");
    await firstRow
      .getByRole("textbox", {
        name: "此图跳转（网址或 /shop/作品标识）",
        exact: true,
      })
      .fill("https://example.com/edited");
    const summary = editor
      .getByText("第 1 张", { exact: true })
      .filter({ visible: true });
    await summary.click();
    await summary.evaluate((e) => e.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(100);
    const from = (await summary.locator('[class*="DragIcon"]').boundingBox())!,
      to = (await editor
        .getByText("第 2 张", { exact: true })
        .filter({ visible: true })
        .boundingBox())!;
    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(300);
    await page.mouse.move(
      from.x + from.width / 2,
      from.y + from.height / 2 + 10,
      { steps: 3 },
    );
    await page.waitForTimeout(150);
    await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2 + 10, {
      steps: 10,
    });
    await page.waitForTimeout(500);
    await page.mouse.up();
    await page.waitForTimeout(600);

    await editor
      .getByText("第 3 张", { exact: true })
      .filter({ visible: true })
      .locator("..")
      .getByRole("button", { name: "删除", exact: true })
      .click();
    await editor
      .getByRole("spinbutton", { name: "暂停时长（毫秒）", exact: true })
      .fill("1234");
    await editor.getByRole("button", { name: "保存", exact: true }).click();
    await expect(editor.locator('span[role="status"]')).toContainText("已保存");
    await page.reload();
    await expect(component).toBeVisible();
    await component.click({ position: { x: 2, y: 2 } });
    await expect(
      editor.getByRole("spinbutton", { name: "暂停时长（毫秒）", exact: true }),
    ).toHaveValue("1234");
    expect(
      JSON.parse(await readFile(draft, "utf8")).content.find(
        (c: any) => c.type === "DouyinGallery",
      ).props.items[0].page.components[0].items,
    ).toEqual([
      marqueeFixture().items[1],
      {
        images: [{ src: "/images/douyin-shop/marquee-test/card-3.png" }],
        link: "https://example.com/edited",
      },
    ]);
    expect(await readFile("content/published/home.json", "utf8")).toBe(
      published,
    );
    await page.screenshot({ path: ".cache/marquee-editor.png" });
  } finally {
    await writeFile(draft, original);
  }
});
test("短图片组补齐副本、克隆链接和手机真实触摸拖动", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4321/local-test/marquee");
    await page.locator("#canvas").evaluate(async (root: any) => {
      const config = JSON.parse(
        document.querySelector("#test-data")!.textContent!,
      );
      config.components = [config.components[0]];
      config.components[0].items = config.components[0].items.slice(0, 1);
      const engineUrl = "/src/modules/DouyinShop/engine.js";
      const engine = await import(/* @vite-ignore */ engineUrl);
      root.innerHTML = engine.shopMarkup(config);
      engine.attachShop(root, config, true);
      root.style.width = "350px";
      root.style.margin = "0";
      (window as any).opened = [];
      window.open = ((url: any) => {
        (window as any).opened.push(url);
        return null;
      }) as any;
    });
    await expect
      .poll(() => page.locator(".marquee-group").count())
      .toBeGreaterThan(2);
    await page
      .locator(".marquee-group")
      .last()
      .locator("a")
      .dispatchEvent("click");
    expect(await page.evaluate(() => (window as any).opened)).toEqual([
      "https://example.com/marquee-1",
    ]);
    const box = (await page.locator(".marquee-window").boundingBox())!,
      cdp = await context.newCDPSession(page);
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: box.x + 80, y: box.y + 50 }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: box.x + 140, y: box.y + 50 }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    const track = page.locator(".marquee-track"),
      paused = await track.getAttribute("style");
    await page.waitForTimeout(250);
    expect(await track.getAttribute("style")).toBe(paused);
    await page.waitForTimeout(700);
    expect(await track.getAttribute("style")).not.toBe(paused);
  } finally {
    await context.close();
  }
});

test("公开店铺连续触摸始终跟手，图片捕获转交不会提前结束拖动", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  try {
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    for (const mode of ["normal", "zoom", "transform"]) {
      await page.goto("http://127.0.0.1:4321/shop/crocs-10-09-10-14");
      const component = page.locator(".image-marquee");
      await expect(component).not.toHaveClass(/is-pending|is-revealing/);
      await component.evaluate((el: HTMLElement, mode) => {
        if (mode === "zoom") el.style.zoom = "0.75";
        if (mode === "transform") {
          el.style.transform = "scale(0.75)";
          el.style.transformOrigin = "top left";
        }
      }, mode);
      const viewport = component.locator(".marquee-window");
      await viewport.evaluate((el) =>
        el.scrollIntoView({ block: "center", behavior: "instant" }),
      );
      const rect = (await viewport.boundingBox())!;
      const position = () =>
        component.evaluate((el) => {
          const group = el.querySelector(".marquee-group")!,
            track = el.querySelector(".marquee-track")!;
          const scale =
            el.getBoundingClientRect().width / (el as HTMLElement).clientWidth;
          return {
            x:
              new DOMMatrixReadOnly(getComputedStyle(track).transform).m41 *
              scale,
            period: group.getBoundingClientRect().width,
          };
        });
      const x = rect.x + 30,
        y = rect.y + rect.height / 2;
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x, y }],
      });
      let previous = await position(),
        last = 0;
      for (const delta of [15, 35, 60, 90, 120]) {
        await cdp.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [{ x: x + delta, y }],
        });
        await page.waitForTimeout(60);
        const next = await position();
        const distance =
          (((next.x - previous.x) % next.period) + next.period) % next.period;
        expect(distance, `${mode}: finger ${last}→${delta}`).toBeCloseTo(
          delta - last,
          0,
        );
        previous = next;
        last = delta;
      }
      await page.waitForTimeout(180);
      expect((await position()).x, `${mode}: hold`).toBeCloseTo(previous.x, 2);
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
      await page.waitForTimeout(1200);
      expect(
        Math.abs((await position()).x - previous.x),
        `${mode}: resume after release`,
      ).toBeGreaterThan(1);
    }
  } finally {
    await context.close();
  }
});
