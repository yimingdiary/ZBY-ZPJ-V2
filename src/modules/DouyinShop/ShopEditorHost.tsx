import { useEffect, useRef, useState } from "react";
import { Puck, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { shopConfig, toShopData, fromShopData } from "./shop-config";
import { ShopAssetContext } from "./ShopAssets";
import s from "./ShopEditor.module.css";
import type { ShopDocument } from "./ShopPage";
export default function ShopEditorHost() {
  const [initial, setInitial] = useState<{
    page: ShopDocument;
    project: string;
    session: string;
  }>();
  const current = useRef<
    | Data<
        any,
        { componentRadius: number; header?: string; assetFolder?: string }
      >
    | undefined
  >(undefined);
  const session = useRef("");
  const [status, setStatus] = useState({ message: "", busy: false });
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (
        event.origin !== location.origin ||
        event.source !== parent ||
        parent === window
      )
        return;
      if (event.data?.type === "shop-editor:init" && !session.current) {
        session.current = event.data.session;
        const page = event.data.page as ShopDocument;
        current.current = toShopData(page);
        setInitial({
          page,
          project: event.data.project,
          session: event.data.session,
        });
      }
      if (
        event.data?.type === "shop-editor:status" &&
        event.data.session === session.current
      ) {
        setStatus({
          message: String(event.data.message || ""),
          busy: !!event.data.busy,
        });
      }
      if (
        event.data?.type === "shop-editor:apply-request" &&
        event.data.session === session.current &&
        current.current
      )
        parent.postMessage(
          {
            type: "shop-editor:apply",
            session: session.current,
            page: fromShopData(current.current),
          },
          location.origin,
        );
    };
    window.addEventListener("message", listener);
    parent.postMessage({ type: "shop-editor:ready" }, location.origin);
    return () => window.removeEventListener("message", listener);
  }, []);
  if (!initial) return <p>正在打开店铺装修…</p>;
  return (
    <ShopAssetContext.Provider value={initial.project}>
      <Puck
        headerTitle="抖音店铺-首页装修"
        overrides={{
          headerActions: () => (
            <div className={s.headerActions}>
              <button
                type="button"
                disabled={status.busy}
                onClick={() =>
                  parent.postMessage(
                    { type: "shop-editor:back", session: session.current },
                    location.origin,
                  )
                }
              >
                ← 返回上级
              </button>
              <span role="status">{status.message}</span>
              <button
                type="button"
                disabled={status.busy}
                onClick={() => {
                  if (!current.current || status.busy) return;
                  setStatus({ message: "正在保存…", busy: true });
                  parent.postMessage(
                    {
                      type: "shop-editor:apply",
                      session: session.current,
                      page: fromShopData(current.current),
                    },
                    location.origin,
                  );
                }}
              >
                {status.busy ? "保存中…" : "保存"}
              </button>
            </div>
          ),
        }}
        config={shopConfig}
        data={toShopData(initial.page)}
        dictionary={dictionary}
        onChange={(data) => {
          const changed =
            JSON.stringify(current.current) !== JSON.stringify(data);
          current.current = data;
          if (changed)
            parent.postMessage(
              { type: "shop-editor:changed", session: session.current },
              location.origin,
            );
        }}
        iframe={{ enabled: true }}
        ui={{
          viewports: {
            current: { width: 390, height: "auto" },
            controlsVisible: true,
            options: [
              { width: 390, height: "auto", label: "手机" },
              { width: 677, height: "auto", label: "桌面" },
            ],
          },
        }}
        viewports={[
          { width: 390, height: "auto", label: "手机" },
          { width: 677, height: "auto", label: "桌面" },
        ]}
        height="100vh"
      />
    </ShopAssetContext.Provider>
  );
}
import dictionary from "../../editor/zh-CN.json";
