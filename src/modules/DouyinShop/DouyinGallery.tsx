import { useEffect, useRef } from "react";
import { attachGalleryRatios } from "../../design/gallery-image";
import type { CSSProperties } from "react";
import type { OverlayGalleryProps } from "../OverlayGallery/OverlayGallery";
import type { ShopDocument } from "./ShopPage";
import s from "./DouyinGallery.module.css";
export type DouyinGalleryProps = {
  version: 1;
  title: string;
  subtitle: string;
  category: string;
  layout?: OverlayGalleryProps["layout"];
  items: { slug: string; name: string; cover: string; page: ShopDocument }[];
};
export function DouyinGallery(p: DouyinGalleryProps) {
  const root = useRef<HTMLElement>(null);
  useEffect(
    () => (root.current ? attachGalleryRatios(root.current) : undefined),
    [p.items],
  );
  return (
    <section
      ref={root}
      id="douyin-shop"
      className={s.gallery}
      aria-label="抖音店铺首页作品"
    >
      <header className={s.header}>
        <div>
          <h2>{p.title}</h2>
          <p>{p.subtitle}</p>
        </div>
        <p>{p.category}</p>
      </header>
      <div
        data-auto-width={p.layout?.imageWidth === 0 ? "true" : undefined}
        className={s.grid}
        style={
          p.layout
            ? ({
                "--safe-width": `${p.layout.safeWidth / 19.2}cqw`,
                "--image-width":
                  p.layout.imageWidth === 0
                    ? "auto"
                    : `${p.layout.imageWidth / 19.2}cqw`,
                "--image-height": `${p.layout.imageHeight / 19.2}cqw`,
                "--image-gap": `${p.layout.gap / 19.2}cqw`,
                justifyContent: p.layout.gap === 0 ? "space-between" : "center",
              } as CSSProperties)
            : undefined
        }
      >
        {p.items.map((item, i) => (
          <figure
            key={i}
            data-gallery-figure=""
            style={{ "--image-aspect": 750 / 1000 } as CSSProperties}
          >
            <a
              href={`/shop/${item.slug}`}
              target="_blank"
              rel="noopener"
              aria-label={`打开 ${item.name}完整店铺首页`}
            >
              <img
                src={item.cover}
                alt={item.name}
                loading="lazy"
                decoding="async"
                width="750"
                height="1000"
              />
            </a>
          </figure>
        ))}
      </div>
    </section>
  );
}
