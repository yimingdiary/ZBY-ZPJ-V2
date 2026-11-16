const waitForImage = (image) =>
  image.complete
    ? Promise.resolve()
    : new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });

function visibleImages(component) {
  return [...component.querySelectorAll("img")].filter((image) => {
    const slide = image.closest(".tab-slide");
    if (slide && !slide.classList.contains("active")) return false;
    if (image.closest(".flip-face.face-b")) return false;
    if (
      image.closest(".carousel .slides") &&
      !image.classList.contains("active")
    )
      return false;
    if (
      image.classList.contains("thumb-selected") &&
      !image.closest(".tab-thumb.active")
    )
      return false;
    if (
      image.classList.contains("thumb-unselected") &&
      image.closest(".tab-thumb.active")
    )
      return false;
    return true;
  });
}

function skeletonTargets(component) {
  if (component.classList.contains("flip-grid"))
    return [
      ...component.querySelectorAll(".flip-item:not(.is-empty),.flip-button"),
    ];
  if (component.classList.contains("tab-carousel"))
    return [...component.querySelectorAll(".tab-content,.tab-thumb")];
  return [];
}

function addSkeleton(component) {
  const overlay = document.createElement("div");
  overlay.className = "component-skeleton";
  overlay.setAttribute("aria-hidden", "true");
  const bounds = component.getBoundingClientRect();
  for (const target of skeletonTargets(component)) {
    const rect = target.getBoundingClientRect();
    if (!rect.width || !rect.height || !bounds.width || !bounds.height)
      continue;
    const shape = document.createElement("i");
    shape.className = "skeleton-shape";
    shape.style.left = `${((rect.left - bounds.left) / bounds.width) * 100}%`;
    shape.style.top = `${((rect.top - bounds.top) / bounds.height) * 100}%`;
    shape.style.width = `${(rect.width / bounds.width) * 100}%`;
    shape.style.height = `${(rect.height / bounds.height) * 100}%`;
    overlay.append(shape);
  }
  component.append(overlay);
}

export function preparePageLoading(page) {
  const banner = page.querySelector(":scope > .public-banner");
  const bannerImage = banner?.querySelector("img");
  const bannerPending = Boolean(bannerImage && !bannerImage.complete);
  const components = [...page.querySelectorAll(".component")];
  const images = components.map(visibleImages);
  const pending = images.map((group) => group.some((image) => !image.complete));
  if (!bannerPending && !pending.some(Boolean)) return;
  if (bannerPending) banner.classList.add("is-pending");
  components.forEach((component, index) => {
    if (!pending[index]) return;
    component.classList.add("is-pending");
    addSkeleton(component);
  });
  let previous = bannerPending
    ? waitForImage(bannerImage)
        .then(() => new Promise((resolve) => requestAnimationFrame(resolve)))
        .then(() => {
          if (!banner.isConnected) return;
          banner.classList.replace("is-pending", "is-revealing");
          setTimeout(() => banner.classList.remove("is-revealing"), 420);
        })
    : Promise.resolve();
  components.forEach((component, index) => {
    if (!pending[index]) return;
    const ready = Promise.all(images[index].map(waitForImage));
    previous = Promise.all([previous, ready])
      .then(() => new Promise((resolve) => setTimeout(resolve, index ? 10 : 0)))
      .then(() => {
        if (!component.isConnected) return;
        component.classList.replace("is-pending", "is-revealing");
        component.dispatchEvent(new Event("component-ready"));
        setTimeout(() => {
          component.querySelector(".component-skeleton")?.remove();
          component.classList.remove("is-revealing");
        }, 420);
      });
  });
}
