import {
  readdir,
  readFile,
  mkdir,
  writeFile,
  realpath,
} from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createHash } from "node:crypto";
const root = fileURLToPath(new URL("../public/", import.meta.url));
const extensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
export async function imageLibrary(canImport = false) {
  const catalog = JSON.parse(
    await readFile(
      new URL("../public/images/works/catalog.json", import.meta.url),
      "utf8",
    ),
  );
  const images = [];
  async function scan(folder) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) continue;
      const file = path.join(folder, entry.name);
      if (entry.isDirectory()) {
        if (
          ![
            "layers",
            "preview",
            "shared",
            "分层素材",
            "动态预览",
            "共用素材",
          ].includes(entry.name)
        )
          await scan(file);
      } else if (extensions.has(path.extname(entry.name).toLowerCase())) {
        const src = "/" + path.relative(root, file).split(path.sep).join("/");
        const work = Object.entries(catalog).find(([, w]) => w.cover === src);
        images.push({
          src,
          label: work ? work[1].name : entry.name,
          canAnimate: work?.[1].canAnimate || false,
        });
      }
    }
  }
  await scan(path.join(root, "images"));
  return { canImport, images };
}
function imageExtension(buffer) {
  if (
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    return ".png";
  if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255)
    return ".jpg";
  if (["GIF87a", "GIF89a"].includes(buffer.subarray(0, 6).toString()))
    return ".gif";
  if (
    buffer.subarray(0, 4).toString() === "RIFF" &&
    buffer.subarray(8, 12).toString() === "WEBP"
  )
    return ".webp";
  if (
    buffer.subarray(4, 8).toString() === "ftyp" &&
    ["avif", "avis"].includes(buffer.subarray(8, 12).toString())
  )
    return ".avif";
  throw new Error("支持 JPG、PNG、WebP、GIF、AVIF 图片");
}
export async function importImage(buffer, originalName) {
  const ext = imageExtension(buffer);
  const hash = createHash("sha256").update(buffer).digest("hex");
  for (const image of (await imageLibrary(true)).images) {
    const file = path.join(root, image.src.slice(1));
    if (
      createHash("sha256")
        .update(await readFile(file))
        .digest("hex") === hash
    )
      return { ...image, imported: false };
  }
  const filename = originalName || `图片${ext}`;
  if (
    filename !== path.basename(filename) ||
    /[\\\/\x00-\x1f?#%]/.test(filename) ||
    filename === "." ||
    filename === ".."
  )
    throw new Error("文件名包含不支持的字符");
  const declared = path.extname(filename).toLowerCase();
  if (!(declared === ext || (ext === ".jpg" && declared === ".jpeg")))
    throw new Error("图片扩展名与实际格式不一致");
  // 内容决定独立目录，原始文件名保留；同名不同内容不会覆盖。
  const directory = path.join(root, "images/uploads", hash);
  await mkdir(directory, { recursive: true });
  const actual = await realpath(directory);
  if (!actual.startsWith((await realpath(root)) + path.sep))
    throw new Error("图片目录无效");
  const target = path.join(directory, filename);
  try {
    await writeFile(target, buffer, { flag: "wx" });
  } catch (error) {
    if (error.code !== "EEXIST" || !(await readFile(target)).equals(buffer))
      throw error;
  }
  const src = "/images/uploads/" + hash + "/" + filename;
  return { src, label: filename, canAnimate: false, imported: true };
}
export async function writeImageLibrary() {
  await writeFile(
    path.join(root, "image-library.json"),
    JSON.stringify(await imageLibrary(false), null, 2) + "\n",
  );
}
