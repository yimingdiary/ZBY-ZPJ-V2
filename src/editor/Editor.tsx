import { useEffect, useRef, useState } from "react";
import { Puck, type Data } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { config, type Modules } from "../modules/registry";
import { assertPage } from "../content/validate";
import dictionary from "./zh-CN.json";
import s from "./Editor.module.css";
export default function Editor() {
  const [data, setData] = useState<Data<Modules>>();
  const current = useRef<Data<Modules> | undefined>(undefined);
  const [message, setMessage] = useState("正在读取草稿…");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [auth, setAuth] = useState(false);
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
      setMessage(
        body.mode === "local"
          ? "本地开发模式 · 内容保存为 JSON"
          : "GitHub 内容模式",
      );
    } catch (e) {
      setMessage(String(e));
    }
  }
  useEffect(() => {
    load();
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
        "确认发布当前页面？本地模式更新发布 JSON；线上模式会提交正式分支并触发构建。",
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
  return (
    <>
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
      {data && (
        <Puck<typeof config>
          config={config}
          data={data}
          dictionary={dictionary}
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
          height="calc(100vh - 48px)"
        />
      )}
    </>
  );
}
