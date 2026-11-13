import { useEffect, useRef, type CSSProperties } from "react";
import { attachOverlayPreview } from "./preview";
import s from "./OverlayGallery.module.css";
import hotspots from "./hotspots.json";
import { workForImage } from "../../assets/works";
export type OverlayGalleryProps = {
  version: 1;
  title: string;
  subtitle: string;
  category: string;
  layout?: {
    safeWidth: number;
    imageWidth: number;
    imageHeight: number;
    gap: number;
  };
  items: { src: string; alt: string; workId?: string; dynamic?: boolean }[];
};
export function OverlayGallery(p: OverlayGalleryProps) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const cleanups = [
      ...(root.current?.querySelectorAll<HTMLAnchorElement>(
        "[data-overlay-work]",
      ) || []),
    ].map(attachOverlayPreview);
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [p.items]);
  return (
    <section
      ref={root}
      id="overlay"
      className={s.gallery}
      aria-label="贴片设计作品"
    >
      <header className={s.header}>
        <div>
          <h2>{p.title}</h2>
          <p className={s.subtitle}>{p.subtitle}</p>
        </div>
        <p className={s.category}>{p.category}</p>
      </header>
      <div
        className={`${s.grid} ${p.layout ? s.configured : p.items.length === hotspots.areas.length ? s.positioned : ""}`}
        style={
          p.layout
            ? ({
                "--safe-width": `${p.layout.safeWidth / 19.2}cqw`,
                "--image-width": `${p.layout.imageWidth / 19.2}cqw`,
                "--image-height": `${p.layout.imageHeight / 19.2}cqw`,
                "--image-gap": `${p.layout.gap / 19.2}cqw`,
                justifyContent: p.layout.gap === 0 ? "space-between" : "center",
              } as CSSProperties)
            : undefined
        }
      >
        {p.items.map((item, i) => {
          const work = workForImage(item.src);
          const dynamic = (item.dynamic ?? !!item.workId) && work?.canAnimate;
          const src = work?.cover || item.src;
          return (
            <figure
              key={i}
              style={
                !p.layout && p.items.length === hotspots.areas.length
                  ? ({
                      "--overlay-card-left": `${(hotspots.areas[i].x / hotspots.baseSize.width) * 100}%`,
                      "--overlay-card-top": `${(hotspots.areas[i].y / hotspots.baseSize.height) * 100}%`,
                      "--overlay-card-width": `${(hotspots.areas[i].width / hotspots.baseSize.width) * 100}%`,
                      "--overlay-card-height": `${(hotspots.areas[i].height / hotspots.baseSize.height) * 100}%`,
                    } as CSSProperties)
                  : undefined
              }
            >
              {dynamic && work ? (
                <a
                  className={`${s.work} ${work?.canvas.height === 2791 ? s.legacy : ""}`}
                  data-overlay-work={work.id}
                  href={`/overlay/${work.id}`}
                  target="_blank"
                  rel="noopener"
                  aria-label={`打开 ${item.alt}的分层展示`}
                >
                  <img
                    src={src}
                    alt={item.alt}
                    width={work?.canvas.height === 2791 ? 1290 : 1080}
                    height={work?.canvas.height === 2791 ? 2791 : 1920}
                    loading="lazy"
                    decoding="async"
                  />
                  <span
                    className={s.preview}
                    data-overlay-preview=""
                    aria-hidden="true"
                  />
                </a>
              ) : (
                <img
                  src={src}
                  alt={item.alt}
                  width={work?.canvas.height === 2791 ? 1290 : 1080}
                  height={work?.canvas.height === 2791 ? 2791 : 1920}
                  loading="lazy"
                  decoding="async"
                />
              )}
            </figure>
          );
        })}
      </div>
    </section>
  );
}
