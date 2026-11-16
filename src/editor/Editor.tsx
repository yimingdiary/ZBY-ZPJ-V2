import { useEffect, useRef, useState } from "react";
import { Puck, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { config, type Modules } from "../modules/registry";
import { assertPage } from "../content/validate";
import dictionary from "./zh-CN.json";
import s from "./Editor.module.css";
import { ShopWorkspace } from "../modules/DouyinShop/ShopPageField";
import { folderForShop } from "../modules/DouyinShop/ShopAssets";
import type { ShopDocument } from "../modules/DouyinShop/ShopPage";
export default function Editor() {
  const [shop, setShop] = useState<string | null>(null);
  const [data, setData] = useState<Data<Modules>>();
  const current = useRef<Data<Modules> | undefined>(undefined);
  const initialized = useRef(false);
  const [message, setMessage] = useState("正在读取草稿…");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    setShop(new URLSearchParams(location.search).get("shop"));
    const open = (event: Event) => {
      const project = (event as CustomEvent<string>).detail;
      const url = new URL(location.href);
      url.searchParams.set("shop", project);
      history.pushState(null, "", url);
      setShop(project);
      if (current.current) setData(current.current);
    };
    const pop = () => setShop(new URLSearchParams(location.search).get("shop"));
    const saved = () => setDirty(false);
    window.addEventListener("shop:open", open);
    window.addEventListener("popstate", pop);
    window.addEventListener("shop:saved", saved);
    return () => {
      window.removeEventListener("shop:open", open);
      window.removeEventListener("popstate", pop);
      window.removeEventListener("shop:saved", saved);
    };
  }, []);
  const back = () => {
    const url = new URL(location.href);
    url.searchParams.delete("shop");
    history.pushState(null, "", url);
    setShop(null);
    if (current.current) setData(current.current);
  };
  async function saveShop(page: ShopDocument) {
    if (!current.current) throw Error("草稿未读取");
    const next = structuredClone(current.current);
    let found = false;
    for (const block of next.content) {
      if (block.type !== "DouyinGallery") continue;
      for (const item of (block.props as any).items) {
        if ((item.page?.assetFolder || folderForShop(item.slug)) === shop) {
          item.page = page;
          found = true;
        }
      }
    }
    if (!found) throw Error("未找到店铺");
    assertPage(next);
    const response = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const result = await response.json();
    if (!response.ok) throw Error(result.error || "保存失败");
    current.current = next;
    setData(next);
    setDirty(false);
  }
  async function load() {
    try {
      const r = await fetch("/api/content");
      if (r.status === 401) {
        setAuth(true);
        setMessage("请登录管理后台");
        return;
      }
      const body = await r.json();
      if (!r.ok) throw Error(body.error);
      assertPage(body.data);
      current.current = body.data;
      setData(body.data);
      setMessage(body.mode === "local" ? "本地草稿" : "云端草稿");
    } catch (e) {
      setMessage(String(e));
    }
  }
  useEffect(() => {
    // 素材目录导入触发 Fast Refresh 时保留正在编辑的数据，真实重新进入页面才读取草稿。
    if (initialized.current) return;
    initialized.current = true;
    void load();
  }, []);
  useEffect(() => {
    const fn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", fn);
    return () => window.removeEventListener("beforeunload", fn);
  }, [dirty]);
  async function save(publish = false) {
    if (!current.current || busy) return;
    if (
      publish &&
      !confirm(
        "确认发布当前页面？本地模式更新发布 JSON；线上模式直接更新 R2 中的公开内容。",
      )
    )
      return;
    setBusy(true);
    try {
      assertPage(current.current);
      if (publish) {
        const draft = await fetch("/api/content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(current.current),
        });
        if (!draft.ok) throw Error("发布前草稿保存失败");
      }
      const r = await fetch("/api/content", {
        method: publish ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current.current),
      });
      const body = await r.json();
      if (!r.ok) throw Error(body.error);
      setDirty(false);
      setMessage(body.message);
    } catch (e) {
      setMessage("保存失败：" + String(e));
    } finally {
      setBusy(false);
    }
  }
  if (auth)
    return (
      <main className={s.login}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const password = new FormData(e.currentTarget).get("password");
            try {
              const r = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
              });
              if (!r.ok) throw Error("登录失败");
              setAuth(false);
              load();
            } catch (e) {
              setMessage(String(e));
            }
          }}
        >
          <h1>作品集管理</h1>
          <label>
            管理员密码
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </label>
          <button>登录</button>
          <p role="status">{message}</p>
        </form>
      </main>
    );
  const item = data?.content
    .filter((b) => b.type === "DouyinGallery")
    .flatMap((b) => (b.props as any).items)
    .find((i) => (i.page?.assetFolder || folderForShop(i.slug)) === shop);
  if (shop && data) {
    if (!item)
      return (
        <main>
          <p>未找到该店铺</p>
          <button onClick={back}>返回上级</button>
        </main>
      );
    return (
      <ShopWorkspace
        key={shop}
        value={item.page}
        project={shop}
        onSave={saveShop}
        onBack={back}
      />
    );
  }
  const actions = (
    <div className={s.bar}>
      <a href="/" target="_blank" rel="noreferrer">
        查看发布页 ↗
      </a>
      <span role="status">
        {message}
        {dirty ? " · 有未保存修改" : ""}
      </span>
      <button disabled={busy || !data} onClick={() => save()}>
        保存草稿
      </button>
      <button disabled={busy || !data} onClick={() => save(true)}>
        发布页面
      </button>
    </div>
  );
  return (
    <>
      {data && (
        <Puck<typeof config>
          config={config}
          data={data}
          dictionary={dictionary}
          overrides={{ headerActions: () => actions }}
          headerTitle="作品集装修"
          headerPath="首页"
          onChange={(d) => {
            current.current = d;
            setDirty(true);
          }}
          onPublish={(d) => {
            current.current = d;
            save(true);
          }}
          viewports={[
            { width: 1920, height: "auto", label: "桌面" },
            { width: 390, height: "auto", label: "手机" },
          ]}
          height="100vh"
        />
      )}
    </>
  );
}
