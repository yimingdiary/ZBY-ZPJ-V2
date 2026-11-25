import { marqueeMarkup, activateMarquees } from "./marquee.js";
// 从 V1 DY-Page 提取的公开渲染引擎；不包含旧后台、鉴权或网络持久化。
export function shopMarkup(config) {
  return config.components.map((c) => componentMarkup(c)).join("");
}
const img = (url) => url || "";
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const hotspotMarkup = (spots) =>
  (spots || [])
    .map(
      (h, i) =>
        `<button class="hotspot" style="left:${h.x}%;top:${h.y}%;width:${h.width}%;height:${h.height}%" data-hotspot="${i}" aria-label="热区 ${i + 1}"></button>`,
    )
    .join("");
function componentMarkup(c, admin = false, preview = false) {
  const spots = admin && !preview ? "" : hotspotMarkup(c.hotspots);
  if (c.type === "marquee") return marqueeMarkup(c, { esc, img, admin, spots });
  if (c.type === "poster")
    return `<div class="component poster" ${c.posterAspect ? `style="aspect-ratio:${esc(c.posterAspect)}"` : ""}>${c.image ? `<img src="${esc(img(c.image, admin))}" alt="海报">` : '<div class="empty-image">选择海报图片</div>'}${spots}</div>`;
  if (c.type === "carousel")
    return `<div class="component carousel" data-delay="${Number(c.interval || 3000)}" data-aspect="${esc(c.carouselAspects?.[0] || "750|450")}"><div class="slides">${(c.images || []).map((u, i) => `<img class="${i ? "" : "active"}" src="${esc(img(u, admin))}" alt="轮播图 ${i + 1}">`).join("")}${(c.images || []).length > 1 ? `<img data-clone="first" src="${esc(img(c.images[0], admin))}" alt="" aria-hidden="true">` : ""}</div><div class="dots">${(c.images || []).map((_, i) => `<span class="${i ? "" : "active"}"></span>`).join("")}</div>${spots}</div>`;
  if (c.type === "tabCarousel") return tabCarouselMarkup(c, admin, spots);
  if (c.type === "flipGrid") return flipMarkup(c, admin, spots);
  return "";
}
const tabParts = (value, defaults) => {
  const a = String(value || defaults.join("|"))
    .split("|")
    .map(Number);
  return a.length === defaults.length &&
    a.every((n) => Number.isFinite(n) && n >= 0)
    ? a
    : defaults;
};
const tabSlide = (t) => t.image || t.images?.[0] || "";
function tabCarouselMarkup(c, admin, spots) {
  const configuredHeight = Number(c.moduleHeight),
    height = configuredHeight > 0 ? configuredHeight : 180,
    [boxW, boxH, boxTop, boxLeft] = tabParts(
      c.thumbnailBox,
      [718, 226, 113, 20],
    ),
    [thumbW, thumbH, gap] = tabParts(c.thumbnailSize, [226, 55, 0]),
    [contentW, contentH, contentTop, contentLeft] = tabParts(c.contentBox, [
      718,
      height,
      0,
      0,
    ]),
    pct = (v, base) => `${(v / base) * 100}%`,
    tabs = (c.tabs || [])
      .map((tab, index) => ({ ...tab, index }))
      .filter(
        (t) => t.title || t.selectedImage || t.unselectedImage || tabSlide(t),
      ),
    initial = Math.max(
      0,
      tabs.findIndex((t) => t.index === Number(c.initialIndex || 0)),
    ),
    color = c.backgroundColor
      ? `background-color:${esc(c.backgroundColor)};`
      : "";
  return `<div class="component tab-carousel" style="height:0;padding-bottom:${(height / 718) * 100}%;${color}" data-initial="${initial}" data-effect="${esc(c.transition || "horizontal")}" data-duration="${Math.max(0, Number(c.animationTime ?? 0.5))}" data-auto="${c.autoPlay === true}" data-interval="${Math.max(0.1, Number(c.autoInterval ?? 3))}">${c.background ? `<img class="tab-background" src="${esc(img(c.background, admin))}" alt="">` : ""}<div class="tab-content" style="width:${pct(contentW, 718)};height:${pct(contentH, height)};top:${pct(contentTop, height)};left:${pct(contentLeft, 718)}">${tabs.map((t, i) => `<div class="tab-slide ${i === initial ? "active" : ""}" data-slide="${t.index}" aria-hidden="${i !== initial}">${tabSlide(t) ? `<img src="${esc(img(tabSlide(t), admin))}" alt="${esc(t.title || `轮播 ${t.index + 1}`)}">` : ""}${admin ? "" : hotspotMarkup(t.hotspots)}</div>`).join("")}</div>${tabs.some((t) => t.selectedImage || t.unselectedImage) ? `<div class="tab-thumbnails ${c.thumbnailLayout === "vertical" ? "vertical" : "horizontal"}" style="width:${pct(boxW, 718)};height:${pct(boxH, height)};top:${pct(boxTop, height)};left:${pct(boxLeft, 718)};--thumb-width:${pct(thumbW, boxW)};--thumb-height:${pct(thumbH, boxH)};--thumb-gap:${pct(gap, boxW)}">${tabs.map((t, i) => (t.selectedImage || t.unselectedImage ? `<button type="button" class="tab-thumb ${i === initial ? "active" : ""}" data-tab="${i}" data-tab-index="${t.index}" aria-label="${esc(t.title || `轮播 ${t.index + 1}`)}" aria-pressed="${i === initial}"><img class="thumb-selected" src="${esc(img(t.selectedImage || t.unselectedImage, admin))}" alt=""><img class="thumb-unselected" src="${esc(img(t.unselectedImage || t.selectedImage, admin))}" alt=""></button>` : "")).join("")}</div>` : ""}${spots}</div>`;
}
const flipParts = (value, defaults) => {
  const parts = String(value || defaults.join("|"))
    .split("|")
    .map(Number);
  return parts.length === defaults.length &&
    parts.every((n) => Number.isFinite(n) && n >= 0)
    ? parts
    : defaults;
};
const flipItems = (c) =>
  c.items ||
  Array.from(
    { length: Math.max(9, ...(c.layers || []).map((x) => x.length)) },
    (_, i) => ({
      empty: false,
      images: (c.layers || [])
        .map((layer, l) => ({
          src: layer[i] || "",
          link: c.tileLinks?.[l]?.[i] || "",
        }))
        .filter((x) => x.src),
    }),
  );
function flipMarkup(c, admin, spots) {
  const [left, top, width, height] = flipParts(
      c.listSettings,
      [0, 250, 718, 1200],
    ),
    [imageWidth, imageHeight] = flipParts(c.imageSize, [239, 392]),
    [rows, cols] = flipParts(c.gridSize, [3, 3]),
    [buttonLeft, buttonTop] = flipParts(c.buttonPosition, [309, 764]),
    items = flipItems(c),
    count = Math.min(100, Math.max(1, rows * cols)),
    base = 718;
  return `<div class="component flip-grid" style="height:0;padding-bottom:${((Number(c.moduleHeight) || 917) / base) * 100}%;background:${esc(c.backgroundColor || "#fff")}" data-flip-direction="${esc(c.flipDirection || "horizontal")}">${c.background ? `<img class="grid-background" src="${esc(img(c.background, admin))}" alt="">` : ""}<div class="flip-list" style="left:${(left / base) * 100}%;top:${(top / (Number(c.moduleHeight) || 917)) * 100}%;width:${(width / base) * 100}%;height:${(height / (Number(c.moduleHeight) || 917)) * 100}%;grid-template-columns:repeat(${Math.max(1, cols)},${(imageWidth / width) * 100}%);grid-template-rows:repeat(${Math.max(1, rows)},${(imageHeight / height) * 100}%)">${Array.from(
    { length: count },
    (_, i) => {
      const item = items[i] || {},
        first = item.images?.[0];
      return `<div class="flip-item ${item.empty ? "is-empty" : ""}" data-flip-item="${i}">${first?.src ? `<div class="flip-face face-a"><img src="${esc(img(first.src, admin))}" alt="产品 ${i + 1}"></div><div class="flip-face face-b"><img src="${esc(img(first.src, admin))}" alt=""></div>` : ""}</div>`;
    },
  ).join(
    "",
  )}</div>${c.buttonImage || c.centerImage ? `<button class="flip-button ${c.buttonAnimation === "scale" ? "scale" : ""}" style="left:${(buttonLeft / base) * 100}%;top:${(buttonTop / (Number(c.moduleHeight) || 917)) * 100}%" aria-label="换一换"><img src="${esc(img(c.buttonImage || c.centerImage, admin))}" alt=""></button>` : `<button class="flip-button ${c.buttonAnimation === "scale" ? "scale" : ""}" style="left:${(buttonLeft / base) * 100}%;top:${(buttonTop / (Number(c.moduleHeight) || 917)) * 100}%">换一换</button>`}${spots}</div>`;
}

export function attachShop(root, config, interactive = true) {
  const timers = new Set(),
    intervals = new Set(),
    frames = new Set(),
    observers = [];
  let disposed = false;
  let cleanupMarquees;
  const setTimeout = (fn, ms) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      if (!disposed) fn();
    }, ms);
    timers.add(id);
    return id;
  };
  const clearTimeout = (id) => {
    window.clearTimeout(id);
    timers.delete(id);
  };
  const setInterval = (fn, ms) => {
    const id = window.setInterval(() => {
      if (!disposed) fn();
    }, ms);
    intervals.add(id);
    return id;
  };
  const clearInterval = (id) => {
    window.clearInterval(id);
    intervals.delete(id);
  };
  const requestAnimationFrame = (fn) => {
    const id = window.requestAnimationFrame((t) => {
      frames.delete(id);
      if (!disposed) fn(t);
    });
    frames.add(id);
    return id;
  };
  const ResizeObserver = class extends window.ResizeObserver {
    constructor(fn) {
      super(fn);
      observers.push(this);
    }
  };
  function activateCarousels(root) {
    root.querySelectorAll(".carousel").forEach((el) => {
      const slides = el.querySelector(".slides"),
        images = [...slides.querySelectorAll("img:not([data-clone])")],
        dots = [...el.querySelectorAll(".dots span")],
        count = images.length;
      if (!count) return;
      let current = 0;
      const sync = () => {
        const image = images[0],
          parts = String(el.dataset.aspect || "750|450")
            .split("|")
            .map(Number),
          ratio = image.naturalWidth
            ? image.naturalHeight / image.naturalWidth
            : parts[1] / parts[0];
        slides.style.height = `${slides.clientWidth * ratio}px`;
        dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
      };
      const reset = () => {
        if (count < 2 || slides.scrollLeft < count * slides.clientWidth - 2)
          return;
        slides.scrollLeft = 0;
        current = 0;
        sync();
      };
      images.forEach((image) => image.addEventListener("load", sync));
      new ResizeObserver(() => {
        if (el.isConnected) sync();
      }).observe(el);
      slides.addEventListener("scroll", () => {
        const index = Math.max(
          0,
          Math.min(count, Math.round(slides.scrollLeft / slides.clientWidth)),
        );
        const next = index === count ? 0 : index;
        if (next !== current) {
          current = next;
          sync();
        }
      });
      slides.addEventListener("scrollend", reset);
      sync();
      if (count > 1) {
        const start = () => {
          const timer = setInterval(
            () => {
              if (!el.isConnected) {
                clearInterval(timer);
                return;
              }
              reset();
              const index = Math.max(
                0,
                Math.min(
                  count - 1,
                  Math.round(slides.scrollLeft / slides.clientWidth),
                ),
              );
              slides.scrollTo({
                left: (index + 1) * slides.clientWidth,
                behavior: "smooth",
              });
              setTimeout(reset, 750);
            },
            Math.max(800, Number(el.dataset.delay) || 3000),
          );
        };
        if (el.classList.contains("is-pending"))
          el.addEventListener("component-ready", start, { once: true });
        else start();
      }
    });
  }
  function activate(root, config, admin = false, interactive = true) {
    activateCarousels(root);
    cleanupMarquees = activateMarquees(root, config, {
      requestAnimationFrame,
      ResizeObserver,
      interactive,
    });
    root.querySelectorAll(".tab-carousel").forEach((el) => {
      const slides = [...el.querySelectorAll(".tab-slide")],
        buttons = [...el.querySelectorAll(".tab-thumb")];
      if (!slides.length) return;
      let current = Number(el.dataset.initial) || 0,
        timer;
      const effect = el.dataset.effect,
        duration = Math.max(0, Number(el.dataset.duration)) * 1000;
      el.style.setProperty("--tab-duration", `${duration}ms`);
      const show = (next) => {
        next = (next + slides.length) % slides.length;
        if (next === current) return;
        const previous = current;
        current = next;
        slides.forEach((slide, i) => {
          slide.classList.toggle("active", i === current);
          slide.classList.toggle("leaving", i === previous);
          slide.setAttribute("aria-hidden", String(i !== current));
        });
        buttons.forEach((button) => {
          const active = Number(button.dataset.tab) === current;
          button.classList.toggle("active", active);
          button.setAttribute("aria-pressed", String(active));
        });
        setTimeout(
          () => slides[previous]?.classList.remove("leaving"),
          duration,
        );
      };
      el.showTab = show;
      buttons.forEach((button) =>
        button.addEventListener("click", (e) => {
          e.stopPropagation();
          show(Number(button.dataset.tab));
          restart();
        }),
      );
      const restart = () => {
        clearInterval(timer);
        if (el.classList.contains("is-pending")) return;
        if (el.dataset.auto === "true" && slides.length > 1)
          timer = setInterval(
            () => {
              if (!el.isConnected) {
                clearInterval(timer);
                return;
              }
              show(current + 1);
            },
            Math.max(100, Number(el.dataset.interval) * 1000 || 3000),
          );
      };
      el.addEventListener("component-ready", restart, { once: true });
      let start = null;
      el.querySelector(".tab-content")?.addEventListener("pointerdown", (e) => {
        start = { x: e.clientX, y: e.clientY };
      });
      el.querySelector(".tab-content")?.addEventListener("pointerup", (e) => {
        if (!start) return;
        const d =
          effect === "vertical" ? e.clientY - start.y : e.clientX - start.x;
        if (Math.abs(d) > 35) {
          show(current + (d < 0 ? 1 : -1));
          restart();
        }
        start = null;
      });
      restart();
    });
    root.querySelectorAll(".flip-grid").forEach((el) => {
      const c =
          config.components[
            [...root.querySelectorAll(".component")].indexOf(el)
          ],
        items = flipItems(c),
        [stay, duration, stagger] = flipParts(
          c.carouselSettings,
          [2000, 500, 50],
        ),
        tiles = [...el.querySelectorAll("[data-flip-item]")];
      const buttonImage = el.querySelector(".flip-button img");
      if (buttonImage) {
        const size = () => {
          if (buttonImage.naturalWidth)
            buttonImage.parentElement.style.width = `${(buttonImage.naturalWidth / 718) * 100}%`;
        };
        buttonImage.addEventListener("load", size);
        size();
      }
      for (const item of items)
        for (const entry of item.images || []) {
          if (entry.src) {
            const preload = new Image();
            preload.src = img(entry.src, admin);
          }
        }
      let busy = false,
        timer;
      const schedule = () => {
        if (el.classList.contains("is-pending")) return;
        if (c.autoSwitch && el.isConnected)
          timer = setTimeout(flip, Math.max(200, stay));
      };
      const flip = () => {
        clearTimeout(timer);
        if (busy) return;
        busy = true;
        let last = 0;
        tiles.forEach((tile, i) => {
          const item = items[i],
            images = item?.images || [];
          if (item?.empty || !images.length) return;
          const delay = i * stagger,
            ms = Math.max(80, duration);
          last = Math.max(last, delay + ms);
          tile.style.setProperty("--flip-duration", `${ms}ms`);
          setTimeout(() => {
            if (!el.isConnected) return;
            const next =
                (Number(tile.dataset.imageIndex || 0) + 1) % images.length,
              showB = !tile.classList.contains("show-b"),
              hidden = tile.querySelector(
                showB ? ".face-b img" : ".face-a img",
              );
            hidden.src = img(images[next].src, admin);
            requestAnimationFrame(() => tile.classList.toggle("show-b", showB));
            setTimeout(() => {
              tile.dataset.imageIndex = String(next);
            }, ms);
          }, delay);
        });
        setTimeout(() => {
          busy = false;
          schedule();
        }, last + 20);
      };
      el.querySelector(".flip-button")?.addEventListener("click", (e) => {
        e.stopPropagation();
        flip();
      });
      if (interactive)
        tiles.forEach((tile, i) =>
          tile.addEventListener("click", (e) => {
            const item = items[i],
              images = item?.images || [],
              link = images[Number(tile.dataset.imageIndex || 0)]?.link;
            if (!link || item?.empty) return;
            e.stopPropagation();
            if (link.startsWith("/shop/")) location.href = link;
            else window.open(link, "_blank", "noopener,noreferrer");
          }),
        );
      el.addEventListener("component-ready", schedule, { once: true });
      schedule();
    });
    root.querySelectorAll(".tab-carousel .tab-slide [data-hotspot]").forEach(
      (button) =>
        (button.onclick = (event) => {
          const el = button.closest(".tab-carousel"),
            componentIndex = [...root.querySelectorAll(".component")].indexOf(
              el,
            ),
            slide = button.closest(".tab-slide"),
            h =
              config.components[componentIndex]?.tabs?.[
                Number(slide.dataset.slide)
              ]?.hotspots?.[Number(button.dataset.hotspot)];
          if (!h || !interactive) return;
          event.stopPropagation();
          if (h.action === "project" && /^[a-z0-9-]+$/.test(h.target || ""))
            location.href = `/shop/${h.target}`;
          else if (h.target)
            window.open(h.target, "_blank", "noopener,noreferrer");
        }),
    );
    root.querySelectorAll(".component").forEach((el, i) =>
      el.querySelectorAll(":scope > [data-hotspot]").forEach(
        (button) =>
          (button.onclick = (event) => {
            const h =
              config.components[i]?.hotspots?.[Number(button.dataset.hotspot)];
            if (!h || !interactive) return;
            event.stopPropagation();
            if (h.action === "url")
              window.open(h.target, "_blank", "noopener,noreferrer");
            if (h.action === "project" && /^[a-z0-9-]+$/.test(h.target || ""))
              location.href = `/shop/${h.target}`;
            if (h.action === "switch")
              el.querySelector(".flip-button")?.click();
          }),
      ),
    );
    root.querySelectorAll(".component").forEach((el, i) => {
      const link = config.components[i]?.link;
      if (!interactive || !link || config.components[i]?.type === "flipGrid")
        return;
      el.classList.add("clickable-component");
      el.addEventListener("click", (event) => {
        if (
          event.target.closest(
            "[data-hotspot],.tab-thumb,.tabs button,.flip-button,.flip-trigger",
          )
        )
          return;
        if (link.startsWith("/shop/")) location.href = link;
        else window.open(link, "_blank", "noopener,noreferrer");
      });
    });
  }
  activate(root, config, false, interactive);
  return () => {
    disposed = true;
    cleanupMarquees?.();
    timers.forEach(window.clearTimeout);
    intervals.forEach(window.clearInterval);
    frames.forEach(window.cancelAnimationFrame);
    observers.forEach((o) => o.disconnect());
  };
}
