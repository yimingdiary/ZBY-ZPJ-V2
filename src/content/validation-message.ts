import schema from "./page.schema.json" with { type: "json" };
type Issue = {
  instancePath: string;
  schemaPath: string;
  keyword: string;
  params: Record<string, any>;
  message?: string;
};
const fields: Record<string, string> = {
  thumbnailBox: "缩略图区域（宽/高/上/左）",
  thumbnailSize: "缩略图尺寸（宽/高/间）",
  contentBox: "内容区域（宽/高/上/左）",
  listSettings: "列表区域（左/上/宽/高）",
  imageSize: "产品图片尺寸（宽/高）",
  gridSize: "网格行列（行/列）",
  carouselSettings: "翻转时间（停留/动画/间隔）",
  buttonPosition: "按钮位置（左/上）",
  moduleHeight: "组件高度",
  backgroundColor: "背景颜色",
  animationTime: "切换时长",
  autoInterval: "停留时长",
  initialIndex: "初始标签",
  interval: "轮播间隔",
};
const geometry = new Set([
  "thumbnailBox",
  "thumbnailSize",
  "contentBox",
  "listSettings",
  "imageSize",
  "gridSize",
  "carouselSettings",
  "buttonPosition",
]);
const types: Record<string, string> = {
  poster: "静态海报",
  carousel: "轮播图",
  tabCarousel: "Tab轮播",
  flipGrid: "换一换",
};
export function validationMessage(data: any, errors: Issue[]) {
  const branches = schema.properties.content.items.oneOf;
  const relevant = errors.filter((issue) => {
    const branch = issue.schemaPath.match(
      /^#\/properties\/content\/items\/oneOf\/(\d+)\//,
    );
    const index = issue.instancePath.match(/^\/content\/(\d+)/);
    if (!branch || !index) return issue.keyword !== "oneOf";
    return (
      branches[Number(branch[1])]?.properties.type.const ===
      data?.content?.[Number(index[1])]?.type
    );
  });
  return (relevant.length ? relevant : errors)
    .slice(0, 3)
    .map((issue) => {
      const path = issue.instancePath.split("/").slice(1);
      const block =
        path[0] === "content" ? data?.content?.[Number(path[1])] : null;
      const itemIndex = path.indexOf("items");
      const item =
        itemIndex >= 0
          ? block?.props?.items?.[Number(path[itemIndex + 1])]
          : null;
      const componentIndex = path.indexOf("components");
      const component =
        componentIndex >= 0
          ? item?.page?.components?.[Number(path[componentIndex + 1])]
          : null;
      const field =
        issue.params.missingProperty ||
        issue.params.additionalProperty ||
        path.at(-1) ||
        "页面";
      let reason = issue.message || "配置无效";
      if (issue.keyword === "pattern" && geometry.has(field))
        reason = "请按标题顺序填写完整数字，用 / 分隔，不要留空";
      else if (issue.keyword === "required") reason = "缺少必填项";
      else if (issue.keyword === "minimum")
        reason = `不能小于 ${issue.params.limit}`;
      else if (issue.keyword === "maximum")
        reason = `不能大于 ${issue.params.limit}`;
      else if (issue.keyword === "type")
        reason = `需要${issue.params.type === "number" ? "数字" : "正确类型的值"}`;
      else if (issue.keyword === "additionalProperties")
        reason = "存在不支持的字段";
      const where = [
        item?.name || item?.slug || block?.type,
        component &&
          `第 ${Number(path[componentIndex + 1]) + 1} 个组件·${types[component.type] || component.type}`,
        fields[field] || field,
      ]
        .filter(Boolean)
        .join(" → ");
      return `${where}：${reason}（位置 ${issue.instancePath}）`;
    })
    .join("；");
}
