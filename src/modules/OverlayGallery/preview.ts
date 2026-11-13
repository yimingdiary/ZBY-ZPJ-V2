type Layer = {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
};
type Work = { layers: Layer[]; canvas?: { width: number; height: number } };
let catalog: Promise<Record<string, Work>> | undefined;
export function resetOverlayPreviewCatalog() {
  catalog = undefined;
}
/** V1 悬停预览生命周期：首次进入加载图层，全量就绪后显示，移出隐藏。 */
export function attachOverlayPreview(link: HTMLAnchorElement) {
  const doc = link.ownerDocument,
    view = doc.defaultView!;
  const preview = link.querySelector<HTMLElement>("[data-overlay-preview]")!;
  let disposed = false,
    active = false,
    loading: Promise<void> | undefined;
  const load = () => {
    if (!loading)
      loading = (async () => {
        catalog ??= fetch("/images/works/catalog.json").then((r) => {
          if (!r.ok) throw new Error("图层目录加载失败");
          return r.json();
        });
        const work = (await catalog)[link.dataset.overlayWork!];
        if (!work) throw new Error("作品不存在");
        const media = await Promise.all(
          work.layers.map(
            (layer) =>
              new Promise<HTMLImageElement | HTMLVideoElement>(
                (resolve, reject) => {
                  const video = /\.(mp4|webm|mov)$/i.test(layer.src);
                  const img = doc.createElement(video ? "video" : "img");
                  if (img instanceof view.HTMLVideoElement) {
                    img.loop = true;
                    img.muted = true;
                    img.playsInline = true;
                    img.preload = "auto";
                    img.addEventListener("loadeddata", () => resolve(img), {
                      once: true,
                    });
                  } else {
                    img.alt = "";
                    img.onload = () => resolve(img);
                  }
                  img.style.cssText = `position:absolute;left:${(100 * layer.x) / (work.canvas?.width || 1080)}%;top:${(100 * layer.y) / (work.canvas?.height || 1920)}%;width:${(100 * layer.width) / (work.canvas?.width || 1080)}%;height:${(100 * layer.height) / (work.canvas?.height || 1920)}%;z-index:${layer.z};aspect-ratio:auto;max-width:none`;
                  img.onerror = () => reject(new Error(layer.src));
                  img.src = layer.src;
                },
              ),
          ),
        );
        if (disposed) return;
        preview.replaceChildren(...media);
        link.dataset.previewReady = "true";
        if (active) {
          link.dataset.previewActive = "true";
          preview.querySelectorAll("video").forEach((video) => {
            video.currentTime = 0;
            void video.play().catch(() => {});
          });
        }
      })().catch(() => {
        if (!disposed) link.dataset.previewError = "true";
      });
    return loading;
  };
  const enter = () => {
    if (!view.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    active = true;
    void load().then(() => {
      if (active && !disposed && link.dataset.previewReady) {
        link.dataset.previewActive = "true";
        preview.querySelectorAll("video").forEach((video) => {
          if (video.paused) {
            video.currentTime = 0;
            void video.play().catch(() => {});
          }
        });
      }
    });
  };
  const leave = () => {
    active = false;
    delete link.dataset.previewActive;
    preview.querySelectorAll("video").forEach((video) => video.pause());
  };
  link.addEventListener("mouseenter", enter);
  link.addEventListener("mouseleave", leave);
  link.addEventListener("focus", enter);
  link.addEventListener("blur", leave);
  return () => {
    disposed = true;
    leave();
    link.removeEventListener("mouseenter", enter);
    link.removeEventListener("mouseleave", leave);
    link.removeEventListener("focus", enter);
    link.removeEventListener("blur", leave);
  };
}
