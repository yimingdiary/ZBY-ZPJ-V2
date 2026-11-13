import { useEffect, useRef, useState } from "react";
import { siteImagePath } from "../assets/works";
import s from "./ImagePicker.module.css";
export function ImagePicker({
  value,
  onChange,
  readOnly = false,
}: {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}) {
  const [path, setPath] = useState(value),
    [canImport, setCanImport] = useState(false),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null),
    images = useRef<{ src: string }[]>([]);
  useEffect(() => setPath(value), [value]);
  useEffect(() => {
    void fetch("/image-library.json")
      .then(async (r) => {
        if (!r.ok) throw Error("图片信息读取失败");
        const data = await r.json();
        images.current = data.images;
        setCanImport(data.canImport);
      })
      .catch((e) => setMessage(String(e)));
  }, []);
  const commit = () => {
    if (path === value) return;
    try {
      const src = siteImagePath(path);
      if (!images.current.some((i) => i.src === src))
        throw Error("项目中没有该图片，请选择文件导入");
      onChange(src);
      setPath(src);
      setMessage("");
    } catch (e) {
      setMessage(String(e));
    }
  };
  async function choose(file: File) {
    setBusy(true);
    setMessage("");
    try {
      const r = await fetch("/api/assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          "X-File-Name": encodeURIComponent(file.name),
        },
        body: file,
      });
      const data = await r.json();
      if (!r.ok) throw Error(data.error);
      images.current.push({ src: data.src });
      onChange(data.src);
      setPath(data.src);
    } catch (e) {
      setMessage(String(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={s.picker}>
      <div className={s.row}>
        <input
          aria-label="图片路径"
          value={path}
          readOnly={readOnly}
          placeholder="选择文件，或粘贴项目图片路径"
          onChange={(e) => setPath(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
          }}
        />
        <button
          type="button"
          disabled={readOnly || busy || !canImport}
          onClick={() => input.current?.click()}
        >
          {busy ? "识别中…" : "选择文件"}
        </button>
      </div>
      <input
        ref={input}
        hidden
        type="file"
        aria-label="选择图片文件"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        disabled={readOnly || busy || !canImport}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void choose(file);
          e.target.value = "";
        }}
      />
      {message && <small role="alert">{message}</small>}
    </div>
  );
}
