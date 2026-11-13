import { useEffect, useRef, useState } from "react";
import { registerWork, workForImage } from "../assets/works";
import { resetOverlayPreviewCatalog } from "../modules/OverlayGallery/preview";
import s from "./ImagePicker.module.css";
export function WorkFolderPicker({
  value,
  onChange,
  readOnly = false,
}: {
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false),
    [canImport, setCanImport] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    void fetch("/image-library.json")
      .then((r) => r.json())
      .then((data) => setCanImport(data.canImport === true))
      .catch(() => setError("无法读取文件夹选择状态"));
  }, []);
  async function choose(list: FileList) {
    const files = [...list].filter(
      (file) =>
        (/\.(jpe?g|png|webp|gif|avif|mp4|mov|webm)$/i.test(file.name) ||
          file.name === "作品.json" ||
          /_layout\.json$/i.test(file.name)) &&
        !file.webkitRelativePath.split("/").some((p) => p.startsWith(".")),
    );
    if (!files.length || files.length > 500) {
      setError("请选择包含封面及素材的单件作品文件夹");
      return;
    }
    if (files.reduce((n, f) => n + f.size, 0) > 150 * 1024 * 1024) {
      setError("单件作品文件夹不能超过 150 MB");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const data = new FormData();
      const entries = files.map((file, i) => ({
        field: "file" + i,
        path: file.webkitRelativePath,
      }));
      data.set("entries", JSON.stringify(entries));
      files.forEach((file, i) => data.set("file" + i, file, file.name));
      const roots = files.filter(
        (f) =>
          f.webkitRelativePath.split("/").length === 2 &&
          /\.(jpe?g|png|webp|gif|avif)$/i.test(f.name),
      );
      const cover =
        roots.find((f) => /^(贴片预览|封面|cover|preview)\./i.test(f.name)) ||
        (roots.length === 1 ? roots[0] : undefined);
      if (cover) {
        const bitmap = await createImageBitmap(cover);
        data.set("coverWidth", String(bitmap.width));
        data.set("coverHeight", String(bitmap.height));
        bitmap.close();
      }
      const response = await fetch("/api/work-folders", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (!response.ok) throw Error(result.error);
      registerWork(result.work);
      resetOverlayPreviewCatalog();
      onChange(result.src);
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }
  const work = workForImage(value);
  const folder = work
    ? "/images/works/" + work.folderName
    : value
      ? value.slice(0, value.lastIndexOf("/"))
      : "";
  return (
    <div className={s.folderPicker}>
      <label className={s.label}>选择路径</label>
      <button
        type="button"
        className={s.folderButton}
        disabled={readOnly || busy || !canImport}
        onClick={() => ref.current?.click()}
      >
        {busy ? "正在识别文件夹…" : "选择文件夹"}
      </button>
      <input
        ref={ref}
        hidden
        type="file"
        multiple
        {...{ webkitdirectory: "" }}
        aria-label="选择作品文件夹"
        disabled={readOnly || busy || !canImport}
        onChange={(e) => {
          if (e.target.files?.length) void choose(e.target.files);
          e.target.value = "";
        }}
      />
      <label className={s.label}>
        实际路径
        <textarea
          aria-label="实际路径"
          className={s.actualPath}
          readOnly
          value={folder}
          placeholder="尚未选择作品文件夹"
          rows={3}
        />
      </label>
      {error && <small role="alert">{error}</small>}
    </div>
  );
}
