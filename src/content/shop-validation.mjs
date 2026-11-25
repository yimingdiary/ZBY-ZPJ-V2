// 草稿、Worker 和本地接口共同验证跨组件约束；字段类型仍由 JSON Schema 负责。
export function assertShopPages(data) {
  const slugs = new Set();
  for (const module of data.content) {
    if (module.type !== "DouyinGallery") continue;
    for (const item of module.props.items) {
      if (slugs.has(item.slug)) throw Error("店铺作品标识不得重复");
      slugs.add(item.slug);
      const ids = new Set();
      for (const component of item.page.components) {
        if (ids.has(component.id)) throw Error("店铺内部组件 ID 不得重复");
        ids.add(component.id);
        for (const key of [
          "scrollBox",
          "indicatorBox",
          "thumbnailBox",
          "thumbnailSize",
          "contentBox",
          "listSettings",
          "imageSize",
        ]) {
          if (!component[key]) continue;
          const parts = component[key].split("|").map(Number);
          const dims = ["listSettings", "scrollBox", "indicatorBox"].includes(
            key,
          )
            ? parts.slice(2, 4)
            : parts.slice(0, 2);
          if (dims.some((n) => n <= 0))
            throw Error("店铺组件区域的宽度与高度必须大于 0");
        }
        const groups = [
          component.hotspots || [],
          ...(component.tabs || []).map((t) => t.hotspots || []),
        ];
        for (const spots of groups)
          for (const h of spots) {
            if (h.x + h.width > 100.001 || h.y + h.height > 100.001)
              throw Error("店铺热区不得超出图片边界");
            if (
              h.action === "project" &&
              !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(h.target)
            )
              throw Error("热区店铺目标必须填写作品标识");
            if (
              h.action === "url" &&
              h.target &&
              !/^https?:\/\//.test(h.target)
            )
              throw Error("热区网址必须为 HTTP 或 HTTPS");
          }
      }
    }
  }
}
