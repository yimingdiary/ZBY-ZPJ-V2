import { SHOP_HEADER } from "./shared";
import { useEffect, useRef, type CSSProperties } from "react";
import { shopMarkup, attachShop } from "./engine.js";
import { preparePageLoading } from "./loading.js";
import s from "./ShopPage.module.css";
export type Hotspot = {
  x: number;
  y: number;
  width: number;
  height: number;
  action: "url" | "project" | "switch";
  target: string;
};
export type ShopComponent = {
  id: string;
  type: "poster" | "carousel" | "tabCarousel" | "flipGrid";
  [key: string]: unknown;
};
export type ShopDocument = {
  assetFolder?: string;
  componentRadius: number;
  header?: string;
  components: ShopComponent[];
};
export function ShopPage({
  page,
  interactive = true,
}: {
  page: ShopDocument;
  interactive?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    preparePageLoading(ref.current);
    return attachShop(ref.current, page, interactive);
  }, [page, interactive]);
  return (
    <main
      ref={ref}
      className={s.page}
      data-shop-page=""
      style={
        { "--component-radius": `${page.componentRadius}px` } as CSSProperties
      }
    >
      {
        <div className={`${s.header} ${s.publicHeader} public-banner`}>
          <img src={SHOP_HEADER} alt="店铺页头" width="1206" height="305" />
        </div>
      }
      <div
        className={s.content}
        dangerouslySetInnerHTML={{ __html: shopMarkup(page) }}
      />
    </main>
  );
}
