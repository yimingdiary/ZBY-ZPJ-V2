import { useState, useRef, useEffect } from "react";

import type { ShopDocument } from "./ShopPage";
import s from "./ShopEditor.module.css";
export function ShopPageField({
  value,
  readOnly,
  project,
}: {
  value: ShopDocument;
  onChange: (page: ShopDocument) => void;
  readOnly?: boolean;
  project: string;
}) {
  return (
    <div className={s.field}>
      <p>{value?.components?.length || 0} 个店铺组件</p>
      <button
        type="button"
        disabled={readOnly}
        onClick={() =>
          window.dispatchEvent(
            new CustomEvent("shop:open", { detail: project }),
          )
        }
      >
        装修完整店铺首页
      </button>
      <small>进入店铺装修后可直接保存，返回上级继续编辑作品集。</small>
    </div>
  );
}

export function ShopWorkspace({
  value,
  project,
  onSave,
  onBack,
}: {
  value: ShopDocument;
  project: string;
  onSave: (page: ShopDocument) => Promise<void>;
  onBack: () => void;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const session = useRef(crypto.randomUUID());
  const initial = useRef(value);
  const save = useRef(onSave);
  save.current = onSave;
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [dirty, setDirty] = useState(false);
  const navigation = useRef({ dirty, busy, onBack });
  navigation.current = { dirty, busy, onBack };
  useEffect(() => {
    const listener = async (event: MessageEvent) => {
      if (
        event.origin !== location.origin ||
        event.source !== frame.current?.contentWindow
      )
        return;
      if (event.data?.type === "shop-editor:ready") {
        setReady(true);
        frame.current?.contentWindow?.postMessage(
          {
            type: "shop-editor:init",
            session: session.current,
            page: initial.current,
            project,
          },
          location.origin,
        );
      }
      if (
        event.data?.type === "shop-editor:back" &&
        event.data.session === session.current
      ) {
        const state = navigation.current;
        if (
          !state.busy &&
          (!state.dirty || confirm("有未保存的店铺修改，确定返回上级？"))
        )
          state.onBack();
      }
      if (
        event.data?.type === "shop-editor:apply" &&
        event.data.session === session.current
      ) {
        setBusy(true);
        setMessage("正在保存…");
        try {
          await save.current(event.data.page);
          setMessage("已保存");
          setDirty(false);
          window.dispatchEvent(new CustomEvent("shop:saved"));
        } catch (error) {
          setMessage("保存失败：" + String(error));
        } finally {
          setBusy(false);
        }
      }
      if (
        event.data?.type === "shop-editor:changed" &&
        event.data.session === session.current
      ) {
        setMessage("有未保存修改");
        setDirty(true);
      }
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [project]);
  useEffect(() => {
    const unload = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", unload);
    return () => window.removeEventListener("beforeunload", unload);
  }, [dirty]);
  useEffect(() => {
    if (ready)
      frame.current?.contentWindow?.postMessage(
        { type: "shop-editor:status", session: session.current, message, busy },
        location.origin,
      );
  }, [ready, message, busy]);
  return (
    <div
      className={s.modal}
      role="dialog"
      aria-modal="true"
      aria-label="抖音店铺首页装修"
    >
      <div className={s.puck}>
        <iframe
          ref={frame}
          src="/shop-editor"
          title="店铺装修工作台"
          className={s.editorFrame}
        />
      </div>
    </div>
  );
}
