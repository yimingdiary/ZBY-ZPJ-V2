// 发布页和 Puck 共用真实图片比例；加载完成后更新，不改变图片本身。
export function attachGalleryRatios(root: ParentNode) {
  const cleanups: (() => void)[] = [];
  root
    .querySelectorAll<HTMLElement>("[data-gallery-figure]")
    .forEach((figure) => {
      const img = figure.querySelector("img");
      if (!img) return;
      const sync = () => {
        if (img.naturalWidth && img.naturalHeight)
          figure.style.setProperty(
            "--image-aspect",
            String(img.naturalWidth / img.naturalHeight),
          );
      };
      img.addEventListener("load", sync);
      sync();
      cleanups.push(() => img.removeEventListener("load", sync));
    });
  return () => cleanups.forEach((fn) => fn());
}
