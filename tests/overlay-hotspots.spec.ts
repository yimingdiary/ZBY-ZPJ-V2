import { test, expect } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
const published = new URL("../content/published/home.json", import.meta.url);
const reference = JSON.parse(
  readFileSync(
    new URL("../src/modules/OverlayGallery/hotspots.json", import.meta.url),
    "utf8",
  ),
);
test("桌面作品图与链接逐项对齐 V1 原热区，缩放后坐标一致", async ({ page }) => {
  const original = readFileSync(published, "utf8");
  const data = JSON.parse(original);
  delete data.content.find((m: any) => m.type === "OverlayGallery").props
    .layout;
  writeFileSync(published, JSON.stringify(data));
  try {
    for (const width of [1920, 1280]) {
      await page.setViewportSize({ width, height: 1080 });
      await page.goto(`/?layout-check=${Date.now()}#overlay`);
      const actual = await page.locator("#overlay").evaluate((section) => {
        const r = section.getBoundingClientRect();
        return [
          ...section.querySelectorAll<HTMLAnchorElement>("[data-overlay-work]"),
        ].map((link) => {
          const b = link.getBoundingClientRect();
          const img = link.querySelector("img")!.getBoundingClientRect();
          return {
            x: ((b.x - r.x) / r.width) * 1920,
            y: ((b.y - r.y) / r.width) * 1920,
            width: (b.width / r.width) * 1920,
            height: (b.height / r.width) * 1920,
            imageDifference: Math.max(
              Math.abs(img.x - b.x),
              Math.abs(img.y - b.y),
              Math.abs(img.width - b.width),
              Math.abs(img.height - b.height),
            ),
          };
        });
      });
      for (let i = 0; i < reference.areas.length; i++) {
        for (const key of ["x", "y", "width", "height"] as const)
          expect(
            Math.abs(actual[i][key] - reference.areas[i][key]),
          ).toBeLessThan(0.05);
        expect(actual[i].imageDifference).toBeLessThan(0.05);
      }
    }
  } finally {
    writeFileSync(published, original);
  }
});

test("安全区域自动间距与显式小数间距等效，数量变化及单张正常", async ({
  page,
}) => {
  const original = readFileSync(published, "utf8");
  try {
    for (const count of [4, 3, 1]) {
      const results: number[][] = [];
      for (const gap of [
        0,
        count > 1 ? (1000 - count * 200) / (count - 1) : 0,
      ]) {
        const data = JSON.parse(original);
        const props = data.content.find(
          (m: any) => m.type === "OverlayGallery",
        ).props;
        props.layout = {
          safeWidth: 1000,
          imageWidth: 200,
          imageHeight: 500,
          gap,
        };
        props.items = props.items.slice(0, count);
        writeFileSync(published, JSON.stringify(data));
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto(`/?layout-check=${Date.now()}#overlay`);
        const geometry = await page.locator("#overlay").evaluate((section) => {
          const scale = 1920 / section.getBoundingClientRect().width;
          const figures = [...section.querySelectorAll("figure")];
          const grid = figures[0].parentElement!.getBoundingClientRect();
          return {
            grid: grid.width * scale,
            cards: figures.map((el) => {
              const r = el.getBoundingClientRect();
              return {
                x: (r.x - grid.x) * scale,
                width: r.width * scale,
                height: r.height * scale,
              };
            }),
          };
        });
        expect(geometry.grid).toBeCloseTo(1000, 0);
        for (const card of geometry.cards) {
          expect(card.width).toBeCloseTo(200, 0);
          expect(card.height).toBeCloseTo(500, 0);
        }
        if (count > 1)
          expect(geometry.cards[1].x - 200).toBeCloseTo(
            (1000 - count * 200) / (count - 1),
            0,
          );
        else expect(geometry.cards[0].x).toBeCloseTo(400, 0);
        results.push(geometry.cards.map((c) => c.x));
      }
      results[0].forEach((x, i) =>
        expect(Math.abs(x - results[1][i])).toBeLessThan(0.1),
      );
    }
  } finally {
    writeFileSync(published, original);
  }
});
