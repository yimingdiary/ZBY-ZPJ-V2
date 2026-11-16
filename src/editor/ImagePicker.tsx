import { useEffect, useRef, useState } from "react";
import { siteImagePath } from "../assets/works";
import s from "./ImagePicker.module.css";
export function ImagePicker({
  value,
  onChange,
  readOnly = false,
  namespace = "portfolio",
  project = "",
}: {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  namespace?: "portfolio" | "shop";
  project?: string;
}) {
  const [path, setPath] = useState(value),
    [canImport, setCanImport] = useState(false),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null),
    images = useRef<{ src: string }[]>([]);
  useEffect(() => setPath(value), [value]);
  useEffect(() => {
    void fetch(
      namespace === "shop" ? "/shop-image-library.json" : "/image-library.json",
    )
      .then(async (r) => {
        if (!r.ok) throw Error("图片信息读取失败");
        const data = await r.json();
        images.current = data.images.filter(
          (image: { src: string }) =>
            namespace !== "shop" ||
            !project ||
            image.src.startsWith(`/images/douyin-shop/${project}/`),
        );
        setCanImport(data.canImport);
      })
      .catch((e) => setMessage(String(e)));
  }, [namespace, project]);
  const readable = (src: string) =>
    new Promise<void>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve();
      image.onerror = () =>
        reject(Error("图片无法读取，请检查路径或重新选择文件"));
      image.src = src;
    });
  const commit = async () => {
    if (path === value) return;
    try {
      const src = siteImagePath(path);
      const response = await fetch(
        namespace === "shop"
          ? "/shop-image-library.json"
          : "/image-library.json",
        { cache: "no-store" },
      );
      if (!response.ok) throw Error("图片信息读取失败");
      const library = await response.json();
      images.current = library.images.filter(
        (image: { src: string }) =>
          namespace !== "shop" ||
          !project ||
          image.src.startsWith(`/images/douyin-shop/${project}/`),
      );
      if (!images.current.some((i) => i.src === src))
        throw Error("项目中没有该图片，请选择文件导入");
      await readable(src);
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
      const r = await fetch(
        namespace === "shop" ? "/api/shop-assets" : "/api/assets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
            "X-File-Name": encodeURIComponent(file.name),
            ...(namespace === "shop" ? { "X-Shop-Project": project } : {}),
          },
          body: file,
        },
      );
      const data = await r.json();
      if (!r.ok) throw Error(data.error);
      await readable(data.src);
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
      {namespace === "shop" && value && (
        <img className={s.thumbnail} src={value} alt="已选择的店铺图片" />
      )}
      <div className={s.row}>
        <input
          aria-label="图片路径"
          value={path}
          readOnly={readOnly}
          placeholder="选择文件，或粘贴项目图片路径"
          onChange={(e) => setPath(e.target.value)}
          onBlur={() => void commit()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
          }}
        />
        <button
          type="button"
          disabled={
            readOnly || busy || !canImport || (namespace === "shop" && !project)
          }
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
        disabled={
          readOnly || busy || !canImport || (namespace === "shop" && !project)
        }
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
