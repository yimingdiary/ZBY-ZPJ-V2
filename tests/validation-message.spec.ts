import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { assertPage } from "../src/content/validate";
test("店铺保存校验报告实际组件字段，不堆叠其他模块分支错误", async () => {
  const data = JSON.parse(
    await readFile(
      new URL("../content/draft/home.json", import.meta.url),
      "utf8",
    ),
  );
  const gallery = data.content.find((c: any) => c.type === "DouyinGallery");
  const item = gallery.props.items[0];
  const component = item.page.components.find(
    (c: any) => c.type === "tabCarousel",
  );
  component.thumbnailBox = "718|226||20";
  expect(() => assertPage(data)).toThrow(/Tab轮播.*缩略图区域.*完整数字/);
  expect(() => assertPage(data)).not.toThrow(/Navigation|brand|motto/);
});
