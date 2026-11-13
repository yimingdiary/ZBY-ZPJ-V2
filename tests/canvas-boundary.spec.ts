import { test, expect } from "@playwright/test";

test("发布页与装修预览内容右边界不侵入外壳滚动条", async ({ page }) => {
  for (const route of ["/", "/admin"]) {
    for (const width of [1920, 1280, 390]) {
      await page.setViewportSize({ width, height: 1080 });
      await page.goto(route);
      const surface = route === "/admin" ? page.frameLocator("iframe") : page;
      const object = surface.locator("object[data-photoshop-frame]");
      await expect
        .poll(() =>
          object.evaluate(
            (el: HTMLObjectElement) =>
              !!el.contentDocument?.querySelector("[data-ps-scrollbar-ready]"),
          ),
        )
        .toBeTruthy();
      const geometry = await object.evaluate((el: HTMLObjectElement) => {
        const track = el
          .contentDocument!.querySelector("[data-ps-scrollbar-ready] > rect")!
          .getBoundingClientRect();
        const content = el.ownerDocument
          .querySelector("#overlay")!
          .getBoundingClientRect();
        const frame = el.getBoundingClientRect();
        return {
          contentRight: content.right,
          trackLeft: frame.left + track.left,
          frameWidth: frame.width,
        };
      });
      expect(geometry.contentRight).toBeLessThanOrEqual(
        geometry.trackLeft + 0.5,
      );
      expect(Math.abs(geometry.contentRight - geometry.trackLeft)).toBeLessThan(
        1,
      );
    }
  }
});
