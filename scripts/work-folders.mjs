import {
  readFile,
  writeFile,
  mkdir,
  rename,
  rm,
  readdir,
} from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const exec = promisify(execFile),
  root = fileURLToPath(new URL("../", import.meta.url)),
  publicRoot = path.join(root, "public"),
  worksRoot = path.join(publicRoot, "images/works"),
  catalogPath = path.join(worksRoot, "catalog.json");
const image = /\.(jpe?g|png|webp|gif|avif)$/i,
  video = /\.(mp4|webm|mov)$/i;
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
function relative(input) {
  if (
    typeof input !== "string" ||
    !input ||
    input.startsWith("/") ||
    /[\\\x00-\x1f%?#]/.test(input) ||
    input.split("/").some((p) => !p || p === "." || p === "..")
  )
    throw Error("文件夹内路径无效");
  return input;
}
function number(value, positive = false) {
  if (
    !Number.isFinite(value) ||
    Math.abs(value) > 100000 ||
    (positive && value <= 0)
  )
    throw Error("素材坐标无效");
  return value;
}
function motion(file) {
  const b = file.bytes;
  if (video.test(file.path)) return true;
  if (
    b.subarray(0, 4).toString() === "RIFF" &&
    b.subarray(8, 12).toString() === "WEBP"
  ) {
    for (let i = 12; i + 8 <= b.length;) {
      const size = b.readUInt32LE(i + 4);
      if (b.subarray(i, i + 4).toString() === "ANMF") return true;
      i += 8 + size + (size % 2);
    }
  }
  if (b.subarray(1, 4).toString() === "PNG") {
    for (let i = 8; i + 12 <= b.length;) {
      const size = b.readUInt32BE(i);
      if (b.subarray(i + 4, i + 8).toString() === "acTL" && size >= 8)
        return b.readUInt32BE(i + 8) > 1;
      i += size + 12;
    }
  }
  if (b.subarray(0, 3).toString() === "GIF") {
    let i = 13,
      frames = 0;
    if (b[10] & 128) i += 3 * 2 ** ((b[10] & 7) + 1);
    const blocks = () => {
      while (i < b.length) {
        const size = b[i++];
        if (!size) break;
        i += size;
      }
    };
    while (i < b.length) {
      const tag = b[i];
      if (tag === 0x2c) {
        if (++frames > 1) return true;
        const packed = b[i + 9];
        i += 10;
        if (packed & 128) i += 3 * 2 ** ((packed & 7) + 1);
        i++;
        blocks();
      } else if (tag === 0x21) {
        i += 2;
        blocks();
      } else break;
    }
  }
  return false;
}
function descriptor(work) {
  const base = "/images/works/" + work.folderName + "/";
  const rel = (src) => {
    if (!src.startsWith(base)) throw Error("作品资源不属于当前目录");
    return src.slice(base.length);
  };
  return {
    version: 1,
    sourceName: work.sourceName,
    name: work.name,
    canvas: work.canvas,
    cover: rel(work.cover),
    directory: rel(work.directory + "/").replace(/\/$/, ""),
    files: work.files,
    assets: Object.fromEntries(
      Object.entries(work.assets).map(([k, v]) => [
        k,
        { ...v, optimized: rel(v.optimized) },
      ]),
    ),
    layers: work.layers.map((l) => ({ ...l, src: rel(l.src) })),
    showHost: !!work.showHost,
    showUi: !!work.showUi,
  };
}
export async function writeWorkDescriptors() {
  const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
  for (const w of Object.values(catalog))
    await writeFile(
      path.join(worksRoot, w.folderName, "作品.json"),
      JSON.stringify(descriptor(w), null, 2) + "\n",
    );
}
function brief(id, w) {
  return {
    id,
    cover: w.cover,
    aliases: w.aliases,
    name: w.name,
    folderName: w.folderName,
    canvas: w.canvas,
    canAnimate: w.canAnimate,
  };
}
async function registered(files, catalog) {
  const descriptorFile = files.find((f) => f.path === "作品.json");
  const coverFiles = files.filter(
    (f) => image.test(f.path) && !f.path.includes("/"),
  );
  for (const [id, w] of Object.entries(catalog)) {
    const cover = coverFiles.find((f) => f.path === path.basename(w.cover));
    if (
      !cover ||
      hash(cover.bytes) !==
        hash(await readFile(path.join(publicRoot, w.cover.slice(1))))
    )
      continue;
    const base = "/images/works/" + w.folderName + "/";
    const resources = [
      ...new Set([
        ...w.layers.map((l) => l.src),
        ...Object.values(w.assets).map((a) => a.optimized),
      ]),
    ];
    let same = true;
    for (const src of resources) {
      const file = files.find((f) => f.path === src.slice(base.length));
      if (
        !file ||
        hash(file.bytes) !==
          hash(await readFile(path.join(publicRoot, src.slice(1))))
      ) {
        same = false;
        break;
      }
    }
    if (same && descriptorFile) {
      try {
        same =
          hash(descriptorFile.bytes) ===
          hash(await readFile(path.join(worksRoot, w.folderName, "作品.json")));
      } catch {
        same = false;
      }
    }
    if (same)
      return {
        src: w.cover,
        folder: base.slice(0, -1),
        work: brief(id, w),
        reused: true,
      };
  }
}
let queue = Promise.resolve();
export function importWorkFolder(form) {
  const operation = queue.then(() => importFolder(form));
  queue = operation.catch(() => {});
  return operation;
}
async function importFolder(form) {
  const entries = JSON.parse(String(form.get("entries") || "[]"));
  if (!Array.isArray(entries) || !entries.length || entries.length > 500)
    throw Error("请选择单个作品文件夹");
  let sourceName;
  const files = [];
  const seen = new Set();
  for (const entry of entries) {
    const full = relative(entry.path),
      parts = full.split("/");
    if (parts.length < 2) throw Error("请选择文件夹而非单个文件");
    sourceName ??= parts[0];
    if (parts[0] !== sourceName) throw Error("请选择单个作品文件夹");
    const rel = parts.slice(1).join("/");
    if (rel.split("/").some((p) => p.startsWith("."))) continue;
    if (
      !image.test(rel) &&
      !video.test(rel) &&
      path.basename(rel) !== "作品.json" &&
      !/_layout\.json$/i.test(rel)
    )
      continue;
    if (seen.has(rel.toLowerCase()))
      throw Error("文件夹含重复文件名，请检查大小写");
    seen.add(rel.toLowerCase());
    const file = form.get(entry.field);
    if (!file || typeof file.arrayBuffer !== "function")
      throw Error("文件读取失败");
    files.push({ path: rel, bytes: Buffer.from(await file.arrayBuffer()) });
  }
  const previous = await readFile(catalogPath, "utf8"),
    catalog = JSON.parse(previous);
  const known = await registered(files, catalog);
  if (known) return known;
  const find = (src, allowBase = false) => {
    relative(src);
    const exact = files.find((f) => f.path === src);
    if (exact) return exact;
    if (!allowBase) throw Error("缺少素材：" + src);
    const same = files.filter(
      (f) => path.basename(f.path) === path.basename(src),
    );
    if (same.length !== 1) throw Error("无法唯一识别素材：" + src);
    return same[0];
  };
  const metadata = files.find((f) => f.path === "作品.json");
  let specification;
  if (metadata) {
    const m = JSON.parse(metadata.bytes.toString());
    if (m.version !== 1) throw Error("作品.json 版本不支持");
    specification = m;
  }
  const layoutFile = files.filter(
    (f) => !f.path.includes("/") && /_layout\.json$/i.test(f.path),
  );
  if (layoutFile.length > 1)
    throw Error("包含多个导出坐标文件，请选择单件作品文件夹");
  const roots = files.filter(
    (f) => !f.path.includes("/") && image.test(f.path),
  );
  const named = roots.filter((f) =>
    /^(贴片预览|封面|cover|preview)\./i.test(f.path),
  );
  let cover = specification
    ? find(specification.cover)
    : named.length === 1
      ? named[0]
      : roots.length === 1
        ? roots[0]
        : null;
  if (!cover)
    throw Error("未能唯一识别封面，请在作品目录中放置“贴片预览.jpg／png”");
  let work;
  if (specification) {
    const m = specification;
    const canvas = {
      width: number(m.canvas?.width, true),
      height: number(m.canvas?.height, true),
    };
    const directory = m.directory ? relative(m.directory) : "";
    if (!Array.isArray(m.layers) || !m.layers.length || m.layers.length > 200)
      throw Error("作品.json 缺少有效图层");
    const layers = m.layers.map((l) => ({
      file: path.basename(find(l.src).path),
      src: find(l.src).path,
      x: number(l.x),
      y: number(l.y),
      width: number(l.width, true),
      height: number(l.height, true),
      z: number(l.z),
    }));
    const assets = Object.fromEntries(
      Object.entries(m.assets || {}).map(([key, a]) => {
        if (path.basename(key) !== key) throw Error("图层文件名无效");
        return [
          key,
          {
            kind: "positioned",
            left: number(a.left),
            top: number(a.top),
            width: number(a.width, true),
            height: number(a.height, true),
            sourceWidth: number(a.sourceWidth, true),
            sourceHeight: number(a.sourceHeight, true),
            optimized: find(a.optimized).path,
          },
        ];
      }),
    );
    const list = (m.files || []).map((f) => {
      if (path.basename(f) !== f) throw Error("图层文件名无效");
      find(directory ? directory + "/" + f : f);
      return f;
    });
    if (!list.length) throw Error("作品.json 缺少素材列表");
    work = {
      name: typeof m.name === "string" ? m.name : sourceName,
      sourceName,
      canvas,
      directory,
      files: list,
      assets,
      layers,
      showHost: m.showHost === true,
      showUi: m.showUi === true,
    };
  } else if (layoutFile.length) {
    const m = JSON.parse(layoutFile[0].bytes.toString()),
      canvas = {
        width: number(m.canvas?.width, true),
        height: number(m.canvas?.height, true),
      };
    const layers = Object.values(m.items || {})
      .reverse()
      .filter((i) => i.name !== "贴片预览")
      .map((i, z) => {
        const file = find(i.image, true);
        if (!image.test(file.path) && !video.test(file.path))
          throw Error("导出素材格式无效");
        return {
          file: path.basename(file.path),
          src: file.path,
          x: number(i.x),
          y: number(i.y),
          width: number(i.width, true),
          height: number(i.height, true),
          z,
        };
      });
    if (!layers.length || layers.length > 200)
      throw Error("导出坐标文件中没有有效图层");
    if (layers.some((l) => l.src.includes("/")))
      throw Error("原始导出素材请与导出坐标 JSON 放在同一作品目录");
    work = {
      name: sourceName,
      sourceName,
      canvas,
      directory: "",
      files: layers.map((l) => l.file),
      assets: Object.fromEntries(
        layers.map((l) => [
          l.file,
          {
            kind: "positioned",
            left: l.x,
            top: l.y,
            width: l.width,
            height: l.height,
            sourceWidth: canvas.width,
            sourceHeight: canvas.height,
            optimized: l.src,
          },
        ]),
      ),
      layers,
    };
  } else {
    if (
      files.some(
        (f) => (image.test(f.path) || video.test(f.path)) && f !== cover,
      )
    )
      throw Error(
        "多图层作品需要“作品.json”或“_layout.json”，以准确识别图层位置",
      );
    const canvas = {
      width: number(Number(form.get("coverWidth")), true),
      height: number(Number(form.get("coverHeight")), true),
    };
    work = {
      name: sourceName,
      sourceName,
      canvas,
      directory: "",
      files: [cover.path],
      assets: {},
      layers: [
        {
          file: cover.path,
          src: cover.path,
          x: 0,
          y: 0,
          width: canvas.width,
          height: canvas.height,
          z: 0,
        },
      ],
    };
  }
  const contentHash = hash(
    Buffer.from(
      JSON.stringify(
        files
          .map((f) => [f.path, hash(f.bytes)])
          .sort((a, b) => a[0].localeCompare(b[0])),
      ),
    ),
  );
  const id = "work-" + contentHash.slice(0, 16);
  if (catalog[id])
    return {
      src: catalog[id].cover,
      folder: "/images/works/" + catalog[id].folderName,
      work: brief(id, catalog[id]),
      reused: true,
    };
  let folderName = sourceName;
  const fold = (s) => s.normalize("NFC").toLowerCase();
  const owners = new Set(Object.values(catalog).map((w) => fold(w.folderName)));
  const existing = new Set((await readdir(worksRoot)).map(fold));
  if (owners.has(fold(folderName)) || existing.has(fold(folderName)))
    folderName = sourceName + "__" + contentHash.slice(0, 8);
  if (existing.has(fold(folderName)))
    throw Error("同名作品目录冲突，未覆盖原素材");
  const base = "/images/works/" + folderName;
  work = {
    ...work,
    folderName,
    aliases: [],
    cover: base + "/" + cover.path,
    canAnimate: files.some(
      (f) => work.layers.some((layer) => layer.src === f.path) && motion(f),
    ),
    directory: base + (work.directory ? "/" + work.directory : ""),
    layers: work.layers.map((l) => ({ ...l, src: base + "/" + l.src })),
    assets: Object.fromEntries(
      Object.entries(work.assets).map(([k, a]) => [
        k,
        { ...a, optimized: base + "/" + a.optimized },
      ]),
    ),
  };
  const staging = path.join(root, ".cache", "work-folder-" + randomUUID()),
    target = path.join(worksRoot, folderName);
  const schemaPath = path.join(root, "src/content/page.schema.json");
  const oldSchema = await readFile(schemaPath, "utf8");
  const generatedPaths = [
    path.join(root, "src/content/compiled-validation.mjs"),
    path.join(publicRoot, "image-library.json"),
  ];
  const generatedBefore = await Promise.all(
    generatedPaths.map((p) => readFile(p)),
  );
  let committed = false;
  try {
    await mkdir(staging, { recursive: true });
    for (const file of files) {
      const dest = path.join(staging, file.path);
      await mkdir(path.dirname(dest), { recursive: true });
      await writeFile(dest, file.bytes, { flag: "wx" });
    }
    await rename(staging, target);
    committed = true;
    catalog[id] = work;
    await writeFile(catalogPath, JSON.stringify(catalog, null, 2) + "\n");
    const schema = JSON.parse(oldSchema);
    const items = schema.properties.content.items.oneOf.find(
      (b) => b.properties.type.const === "OverlayGallery",
    ).properties.props.properties.items.items;
    items.allOf[0].then.properties.src.enum = [
      ...new Set(
        Object.values(catalog)
          .filter((w) => w.canAnimate)
          .flatMap((w) => [w.cover, ...w.aliases]),
      ),
    ];
    await writeFile(schemaPath, JSON.stringify(schema, null, 2) + "\n");
    await writeWorkDescriptors();
    await exec(process.execPath, ["scripts/compile-schema.mjs"], { cwd: root });
    return {
      src: work.cover,
      folder: base,
      work: brief(id, work),
      reused: false,
    };
  } catch (error) {
    await writeFile(catalogPath, previous);
    await writeFile(schemaPath, oldSchema);
    await Promise.all(
      generatedPaths.map((p, i) => writeFile(p, generatedBefore[i])),
    );
    if (committed) await rm(target, { recursive: true, force: true });
    throw error;
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}
