/** V1 ps-yemian.svg 保留工具悬停/选中脚本；此处移植 index.html 的视口、滚轮和滚动条逻辑。 */
export function attachPhotoshopFrame(object: HTMLObjectElement) {
  const doc = object.ownerDocument,
    ownerView = doc.defaultView;
  if (!ownerView) return () => {};
  const view = ownerView;
  const disposers: (() => void)[] = [];
  const previous = doc.documentElement.getAttribute("data-ps-scrollbar");
  doc.documentElement.setAttribute("data-ps-scrollbar", "custom");
  const style = doc.createElement("style");
  style.dataset.psScrollbarStyle = "";
  style.textContent =
    'html[data-ps-scrollbar="custom"]{scrollbar-width:none}html[data-ps-scrollbar="custom"]::-webkit-scrollbar,html[data-ps-scrollbar="custom"] body::-webkit-scrollbar{display:none;width:0;height:0}';
  doc.head.append(style);
  let svg: SVGSVGElement | null = null,
    track: SVGRectElement | null = null,
    thumb: SVGRectElement | null = null,
    wrap: SVGGElement | null = null;
  let touchDragging = false;
  let dragging = false,
    dragStartY = 0,
    dragStartScroll = 0,
    touchActive = false,
    lastTouchY = 0,
    raf = 0,
    timer = 0;
  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));
  const maxScroll = () =>
    Math.max(0, doc.documentElement.scrollHeight - view.innerHeight);
  function listen(
    target: EventTarget,
    type: string,
    handler: (event: any) => void,
    options?: AddEventListenerOptions,
  ) {
    target.addEventListener(type, handler, options);
    disposers.push(() => target.removeEventListener(type, handler, options));
  }
  function metrics() {
    if (!svg || !track || !thumb) return null;
    const trackRect = track.getBoundingClientRect(),
      thumbRect = thumb.getBoundingClientRect();
    return {
      top: trackRect.top,
      height: thumbRect.height,
      travel: Math.max(0, trackRect.height - thumbRect.height),
      scale:
        svg.getBoundingClientRect().height / svg.viewBox.baseVal.height || 1,
    };
  }
  function updateThumb() {
    const m = metrics();
    if (!m || !wrap) return;
    const progress = maxScroll() ? view.scrollY / maxScroll() : 0;
    wrap.setAttribute(
      "transform",
      `translate(0 ${(clamp(progress, 0, 1) * m.travel) / m.scale})`,
    );
  }
  function adapt() {
    if (!svg) return;
    const { width, height } = object.getBoundingClientRect();
    if (!width || !height) return;
    const logicalHeight = (1920 * height) / width;
    svg.setAttribute("viewBox", `0 0 1920 ${logicalHeight}`);
    object.style.setProperty("--ps-frame-top", `${(45.7 * width) / 1920}px`);
    object.style.setProperty(
      "--ps-frame-bottom",
      `${(13.34 * width) / 1920}px`,
    );
    const setHeight = (selector: string, inset = 0) =>
      svg!
        .querySelectorAll(selector)
        .forEach((rect) =>
          rect.setAttribute(
            "height",
            String(
              Math.max(
                0,
                logicalHeight - Number(rect.getAttribute("y") || 0) - inset,
              ),
            ),
          ),
        );
    setHeight('[data-name="huamianbeij"]');
    setHeight('[data-name="waicengxiankuang"]', 0.6);
    setHeight('[data-name="zuocebeijse"] rect');
    setHeight('[data-name="youcebeijing"] > rect');
    svg
      .querySelector('[data-name="dibugongnenglan"]')
      ?.setAttribute("transform", `translate(0 ${logicalHeight - 1080})`);
    if (track && thumb) {
      const translate = track
        .getAttribute("transform")
        ?.match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/);
      const top = translate
        ? Number(track.getAttribute("x") || 0) + Number(translate[2])
        : track.getBBox().y;
      const length = Math.max(0, logicalHeight - top);
      track.setAttribute("width", String(length));
      thumb.setAttribute("y", String(top));
      thumb.setAttribute(
        "height",
        String(
          clamp(
            (height / Math.max(doc.documentElement.scrollHeight, height)) *
              length,
            Math.min(44, length),
            length,
          ),
        ),
      );
    }
    updateThumb();
  }
  function schedule() {
    view.clearTimeout(timer);
    if (touchActive) {
      timer = view.setTimeout(adapt, 140);
      return;
    }
    if (raf) return;
    raf = view.requestAnimationFrame(() => {
      raf = 0;
      adapt();
    });
  }
  function setup() {
    const next = object.contentDocument?.querySelector("svg");
    if (!next || next === svg) return;
    svg = next;
    for (const group of svg.querySelectorAll<SVGGElement>(
      '[data-name="youcegundong"]',
    )) {
      const rects = group.querySelectorAll<SVGRectElement>("rect");
      if (rects.length < 2) continue;
      const box = rects[1].getBBox();
      if (box.height <= box.width) continue;
      track = rects[0];
      thumb = rects[1];
      group.dataset.psScrollbarReady = "true";
      wrap = svg.ownerDocument.createElementNS(
        "http://www.w3.org/2000/svg",
        "g",
      );
      group.insertBefore(wrap, thumb);
      wrap.append(thumb);
      track.style.cursor = "pointer";
      track.style.touchAction = "none";
      thumb.style.cursor = "grab";
      thumb.style.touchAction = "none";
      listen(track, "pointerdown", (event: PointerEvent) => {
        const m = metrics();
        if (!m) return;
        event.preventDefault();
        view.scrollTo({
          top:
            clamp(
              m.travel ? (event.clientY - m.top - m.height / 2) / m.travel : 0,
              0,
              1,
            ) * maxScroll(),
          behavior: "instant",
        });
      });
      listen(thumb, "pointerdown", (event: PointerEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.pointerType === "touch") return;
        dragging = true;
        dragStartY = event.clientY;
        dragStartScroll = view.scrollY;
        thumb!.style.cursor = "grabbing";
        thumb!.setPointerCapture(event.pointerId);
      });
      listen(thumb, "pointermove", (event: PointerEvent) => {
        if (!dragging) return;
        const m = metrics();
        if (m)
          view.scrollTo({
            top:
              dragStartScroll +
              (m.travel ? (event.clientY - dragStartY) / m.travel : 0) *
                maxScroll(),
            behavior: "instant",
          });
      });
      const stop = (event: PointerEvent) => {
        if (!dragging) return;
        dragging = false;
        thumb!.style.cursor = "grab";
        if (thumb!.hasPointerCapture(event.pointerId))
          thumb!.releasePointerCapture(event.pointerId);
      };
      listen(thumb, "pointerup", stop);
      listen(thumb, "pointercancel", stop);
      listen(thumb, "lostpointercapture", () => {
        dragging = false;
      });
      break;
    }
    // 外壳仅在边框区域接收指针，中央画布直接交给真实 HTML 内容，保留链接及编辑操作。
    listen(
      svg,
      "wheel",
      (event: WheelEvent) => {
        event.preventDefault();
        view.scrollBy({
          top: event.deltaY,
          left: event.deltaX,
          behavior: "instant",
        });
      },
      { passive: false },
    );
    listen(
      svg,
      "touchstart",
      (event: TouchEvent) => {
        if (event.touches.length === 1) {
          touchActive = true;
          lastTouchY = event.touches[0].clientY;
          if (
            thumb &&
            (event.target === thumb || thumb.contains(event.target as Node))
          ) {
            event.preventDefault();
            touchDragging = true;
            dragStartY = lastTouchY;
            dragStartScroll = view.scrollY;
          }
        }
      },
      { passive: false },
    );
    listen(
      svg,
      "touchmove",
      (event: TouchEvent) => {
        if (event.touches.length !== 1 || dragging) return;
        if (touchDragging) {
          event.preventDefault();
          const m = metrics();
          if (m)
            view.scrollTo({
              top:
                dragStartScroll +
                (m.travel
                  ? (event.touches[0].clientY - dragStartY) / m.travel
                  : 0) *
                  maxScroll(),
              behavior: "instant",
            });
          return;
        }
        const y = event.touches[0].clientY,
          delta = lastTouchY - y;
        if (delta) {
          event.preventDefault();
          view.scrollBy({ top: delta, behavior: "instant" });
          lastTouchY = y;
        }
      },
      { passive: false },
    );
    const end = () => {
      touchActive = false;
      touchDragging = false;
      schedule();
    };
    listen(svg, "touchend", end, { passive: true });
    listen(svg, "touchcancel", end, { passive: true });
    adapt();
  }
  listen(object, "load", setup);
  listen(view, "scroll", updateThumb, { passive: true });
  listen(view, "resize", schedule);
  if (view.visualViewport) listen(view.visualViewport, "resize", schedule);
  const observer = new ResizeObserver(schedule);
  observer.observe(object);
  observer.observe(doc.body);
  setup();
  return () => {
    disposers.forEach((dispose) => dispose());
    observer.disconnect();
    view.cancelAnimationFrame(raf);
    view.clearTimeout(timer);
    style.remove();
    if (previous === null)
      doc.documentElement.removeAttribute("data-ps-scrollbar");
    else doc.documentElement.setAttribute("data-ps-scrollbar", previous);
  };
}
