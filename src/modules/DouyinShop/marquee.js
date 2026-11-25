// 从 DY-Page 图片跑马灯移植；不包含来源的素材 API、登录与持久化。
export const marqueeDefaults = () => ({
  background: "",
  backgroundColor: "",
  moduleHeight: 212,
  scrollBox: "0|0|718|542",
  imageGap: "20",
  items: [],
  gestures: true,
  pauseAfterGesture: false,
  pauseDuration: 1000,
  direction: "left",
  speed: 8,
  showIndicator: false,
  indicatorBox: "300|350|120|10",
  indicatorRadius: 50,
  indicatorColors: "#5D5D5D|#D5D5D5",
});
const parts = (value) => String(value).split("|").map(Number);
export function marqueeMarkup(c, { esc, img, admin, spots }) {
  const height = Number(c.moduleHeight) || 212,
    [x, y, w, h] = parts(c.scrollBox || "0|0|718|542"),
    [ix, iy, iw, ih] = parts(c.indicatorBox || "300|350|120|10"),
    colors = String(c.indicatorColors || "#5D5D5D|#D5D5D5").split("|"),
    items = c.items || [];
  const group = (clone) =>
    `<div class="marquee-group" ${clone ? 'aria-hidden="true"' : ""}>${items.map((item, i) => `<a data-marquee-item="${i}" ${!admin && item.link ? `href="${esc(item.link)}" target="_blank" rel="noopener noreferrer"` : ""} ${clone ? 'tabindex="-1"' : ""}><img src="${esc(img(item.images?.[0]?.src, admin))}" alt="图片 ${i + 1}" draggable="false"></a>`).join("")}</div>`;
  return `<div class="component image-marquee" style="aspect-ratio:718/${height};background-color:${esc(c.backgroundColor || "transparent")}">${c.background ? `<img class="marquee-background" src="${esc(img(c.background, admin))}" alt="">` : ""}<div class="marquee-window" style="left:${(x / 718) * 100}%;top:${(y / height) * 100}%;width:${(w / 718) * 100}%;height:${(Math.max(0, Math.min(h, height - y)) / height) * 100}%"><div class="marquee-track">${group(false)}${group(true)}</div></div>${c.showIndicator ? `<div class="marquee-indicator" style="left:${(ix / 718) * 100}%;top:${(iy / height) * 100}%;width:${(iw / 718) * 100}%;height:${(ih / height) * 100}%;border-radius:${Number(c.indicatorRadius) || 0}px;background:${esc(colors[0])}"><i style="background:${esc(colors[1])};width:${100 / Math.max(1, items.length)}%"></i></div>` : ""}${spots}</div>`;
}
export function activateMarquees(
  root,
  config,
  { requestAnimationFrame, ResizeObserver, interactive },
) {
  const controller = new AbortController();
  const on = (el, event, fn, capture = false) =>
    el.addEventListener(event, fn, { capture, signal: controller.signal });
  root.querySelectorAll(".image-marquee").forEach((el) => {
    const c =
        config.components[[...root.querySelectorAll(".component")].indexOf(el)],
      viewport = el.querySelector(".marquee-window"),
      track = el.querySelector(".marquee-track"),
      group = track.firstElementChild,
      indicator = el.querySelector(".marquee-indicator i");
    let offset = 0,
      last = 0,
      drag = null,
      pauseUntil = 0,
      moved = false;
    const scale = () =>
      el.clientWidth ? el.getBoundingClientRect().width / el.clientWidth : 1;
    // DOMRect 含 CSS zoom/transform；动画 translateX 与拖动必须回到同一布局坐标。
    const groupWidth = () => group.getBoundingClientRect().width / scale();
    const wrap = (n) => {
      const width = groupWidth();
      return width ? ((n % width) + width) % width : 0;
    };
    const paint = () => {
      offset = wrap(offset);
      track.style.transform = `translateX(${-offset}px)`;
      if (indicator)
        indicator.style.transform = `translateX(${(offset / Math.max(1, groupWidth())) * Math.max(0, (c.items.length - 1) * 100)}%)`;
    };
    const resize = new ResizeObserver(() => {
      const gap = (Math.max(0, Number(c.imageGap) || 0) * el.clientWidth) / 718;
      group.parentElement.querySelectorAll(".marquee-group").forEach((g) => {
        g.style.gap = `${gap}px`;
        g.style.paddingRight = `${gap}px`;
      });
      const width = groupWidth();
      if (width > 0) {
        const needed = Math.min(
          100,
          Math.max(2, Math.ceil(viewport.clientWidth / width) + 1),
        );
        while (track.children.length < needed) {
          const clone = group.cloneNode(true);
          clone.setAttribute("aria-hidden", "true");
          clone.querySelectorAll("a").forEach((a) => (a.tabIndex = -1));
          track.append(clone);
        }
        while (track.children.length > needed) track.lastElementChild.remove();
      }
      paint();
    });
    resize.observe(el);
    resize.observe(group);
    const tick = (time) => {
      if (!el.isConnected) {
        resize.disconnect();
        return;
      }
      const elapsed = last ? Math.min(64, time - last) : 0;
      last = time;
      if (
        !drag &&
        time >= pauseUntil &&
        !el.classList.contains("is-pending") &&
        !document.hidden
      ) {
        offset +=
          ((((c.direction === "right" ? -1 : 1) * elapsed) /
            Math.max(0.1, Number(c.speed) || 8)) *
            el.clientWidth) /
          718;
        paint();
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    on(viewport, "click", (e) => {
      const a = e.target.closest("[data-marquee-item]");
      if (!a) return;
      e.preventDefault();
      if (!interactive || moved) return;
      const link = c.items[Number(a.dataset.marqueeItem)]?.link;
      if (!link) return;
      e.stopPropagation();
      if (link.startsWith("/shop/")) location.href = link;
      else window.open(link, "_blank", "noopener,noreferrer");
    });
    if (c.gestures) {
      viewport.style.touchAction = "pan-y";
      on(viewport, "pointerdown", (e) => {
        if (e.button !== 0) return;
        drag = { id: e.pointerId, x: e.clientX, offset };
        moved = false;
      });
      on(viewport, "pointermove", (e) => {
        if (!drag || drag.id !== e.pointerId) return;
        const delta = (e.clientX - drag.x) / scale();
        if (Math.abs(delta) > 5) {
          moved = true;
          viewport.setPointerCapture(e.pointerId);
        }
        offset = drag.offset - delta;
        paint();
      });
      const end = (e) => {
        if (!drag) return;
        drag = null;
        if (c.pauseAfterGesture)
          pauseUntil =
            performance.now() + Math.max(0, Number(c.pauseDuration) || 0);
        if (viewport.hasPointerCapture(e.pointerId))
          viewport.releasePointerCapture(e.pointerId);
      };
      on(viewport, "pointerup", end);
      on(viewport, "pointercancel", end);
      on(viewport, "lostpointercapture", end);
      on(
        viewport,
        "click",
        (e) => {
          if (moved) {
            e.preventDefault();
            e.stopPropagation();
          }
        },
        true,
      );
    }
  });
  return () => controller.abort();
}
