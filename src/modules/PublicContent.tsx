import { useEffect, useState } from "react";
import { PublicPage } from "./PublicPage";
import { ShopPage } from "./DouyinShop/ShopPage";
import { assertPage } from "../content/validate";
export function PublicContent({ shop = false }: { shop?: boolean }) {
  const [data, setData] = useState<any>();
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    fetch("/api/published", { cache: "no-store" })
      .then(async (r) => {
        const result = await r.json();
        if (!r.ok) throw Error(result.error || "读取失败");
        assertPage(result.data);
        if (active) setData(result.data);
      })
      .catch((e) => {
        if (active) setError(String(e));
      });
    return () => {
      active = false;
    };
  }, []);
  if (error) return <p role="alert">{error}</p>;
  if (!data) return <p>正在读取内容…</p>;
  if (shop) {
    const slug = decodeURIComponent(location.pathname.split("/")[2] || "");
    const item = data.content
      .filter((c: any) => c.type === "DouyinGallery")
      .flatMap((c: any) => c.props.items)
      .find((i: any) => i.slug === slug);
    if (!item) return <p role="alert">店铺不存在</p>;
    return <ShopPage page={item.page} />;
  }
  return <PublicPage data={data} />;
}
