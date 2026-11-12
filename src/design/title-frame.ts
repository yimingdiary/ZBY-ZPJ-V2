/** 按已加载字体的实际字形边界适配原稿辅助框；发布页和编辑预览共用。 */
export function attachTitleFrame(svg: SVGSVGElement) {
  const doc = svg.ownerDocument;
  let active = true;
  const update = () => {
    if (!active) return;
    const text = svg.querySelector("text");
    const frame = svg.querySelector("image");
    if (!text) return;
    const canvas = doc.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;
    const style = doc.defaultView!.getComputedStyle(text);
    context.font = `100px ${style.fontFamily}`;
    const metrics = context.measureText(text.textContent || "");
    // SVG getBBox 包含字体单元格留白；Canvas actualBoundingBox 才是可见字形。
    const b = {
      x: -metrics.actualBoundingBoxLeft,
      y: -metrics.actualBoundingBoxAscent,
      width: metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight,
      height:
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
    };
    if (!b.width || !b.height) return;
    // 原稿框内边界：x=119.9..611.8，y=161.1..232.4。
    const sx = b.width / 491.9,
      sy = b.height / 71.3;
    const x = b.x - 16.9 * sx,
      y = b.y - 13.9 * sy;
    const w = 524 * sx,
      h = 101.8 * sy;
    svg.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
    svg.style.width = `${(1.43 * w) / h}em`;
    frame?.setAttribute("x", String(x));
    frame?.setAttribute("y", String(y));
    frame?.setAttribute("width", String(w));
    frame?.setAttribute("height", String(h));
    svg.dataset.titleFrameReady = "true";
  };
  update();
  void doc.fonts.ready.then(update);
  doc.fonts.addEventListener("loadingdone", update);
  return () => {
    active = false;
    doc.fonts.removeEventListener("loadingdone", update);
  };
}
