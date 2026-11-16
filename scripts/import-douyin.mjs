// 只读公开 DY-Page API，将完整配置和原始图片落入 V2 独立命名空间。
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
const base = "https://dy-page-cms.pages.dev";
const request = async (path) => {
  const buffer = execFileSync(
    "curl",
    [
      "--max-time",
      "45",
      "--fail",
      "--silent",
      "--show-error",
      "--location",
      "--retry",
      "3",
      base + path,
    ],
    { maxBuffer: 30 * 1024 * 1024 },
  );
  const contentType = () => {
    if (buffer[0] === 255 && buffer[1] === 216) return "image/jpeg";
    if (
      buffer.subarray(0, 4).toString() === "RIFF" &&
      buffer.subarray(8, 12).toString() === "WEBP"
    )
      return "image/webp";
    if (
      buffer
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    )
      return "image/png";
    if (["GIF87a", "GIF89a"].includes(buffer.subarray(0, 6).toString()))
      return "image/gif";
    if (
      buffer.subarray(4, 8).toString() === "ftyp" &&
      ["avif", "avis"].includes(buffer.subarray(8, 12).toString())
    )
      return "image/avif";
    throw Error(`非图片素材 ${path}`);
  };
  return {
    json: async () => JSON.parse(buffer.toString()),
    arrayBuffer: async () => buffer,
    headers: { get: contentType },
  };
};
const projects = (await (await request("/api/project")).json()).projects;
const directory = new URL("../public/images/douyin-shop/", import.meta.url);
await mkdir(directory, { recursive: true });
await writeFile(
  new URL("店铺页头.webp", directory),
  await readFile(
    new URL("../../v1.0/DY-Page/public/shop-header.webp", import.meta.url),
  ),
);
const items = [];
const manifest = [];
for (const project of projects) {
  const match = /^crocs-(\d{1,2})-(\d{2})-(\d{2})-(\d{2})$/.exec(project.slug);
  const folder = match
    ? `Crocs-Kids_2026_${match[1].padStart(2, "0")}-${match[2]}_${match[3]}-${match[4]}`
    : project.slug;
  const projectDirectory = new URL(folder + "/", directory);
  await mkdir(projectDirectory, { recursive: true });
  const known = new Map();

  const { config } = await (
    await request(`/api/project/${project.slug}`)
  ).json();
  const urls = [
    ...new Set(JSON.stringify(config).match(/\/api\/asset\/\d+/g) || []),
  ];
  const paths = new Map();
  for (const url of urls) {
    if (!known.has(url)) {
      const r = await request(url),
        buffer = Buffer.from(await r.arrayBuffer());
      const extension = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/gif": "gif",
        "image/avif": "avif",
      }[r.headers.get("content-type")?.split(";")[0]];
      if (!extension) throw Error(`非图片素材 ${url}`);
      const filename = `素材-${url.split("/").at(-1)}.${extension}`;
      await writeFile(new URL(filename, projectDirectory), buffer);
      const src = "/images/douyin-shop/" + folder + "/" + filename;
      known.set(url, src);
      manifest.push({
        source: url,
        src,
        sha256: createHash("sha256").update(buffer).digest("hex"),
        bytes: buffer.length,
      });
    }
    paths.set(url, known.get(url));
  }
  const replace = (value) =>
    typeof value === "string"
      ? paths.get(value) || value
      : Array.isArray(value)
        ? value.map(replace)
        : value && typeof value === "object"
          ? Object.fromEntries(
              Object.entries(value).map(([k, v]) => [k, replace(v)]),
            )
          : value;
  const page = replace(config);
  page.componentRadius ??= 10;
  page.assetFolder = folder;
  page.header = "/images/douyin-shop/店铺页头.webp";
  for (const c of page.components)
    if (c.type === "tabCarousel") {
      const h = Number(c.moduleHeight) || 180;
      for (const [k, v] of Object.entries({
        thumbnailBox: "718|226|113|20",
        thumbnailSize: "226|55|0",
        contentBox: `718|${h}|0|0`,
        animationTime: 0,
        autoInterval: 0.1,
      }))
        if (c[k] === "" || c[k] === undefined) c[k] = v;
    }
  items.push({
    slug: project.slug,
    name: project.name,
    cover:
      page.components.find((c) => c.type === "poster" && c.image)?.image || "",
    page,
  });
}
const gallery = {
  version: 1,
  title: "Douyin Shop",
  subtitle: "店铺首页设计",
  category: "抖音店铺",
  items,
  layout: {
    safeWidth: 1920,
    imageWidth: 0,
    imageHeight: 724.9252,
    gap: 46,
  },
};
await writeFile(
  new URL("../src/modules/DouyinShop/defaults.json", import.meta.url),
  JSON.stringify(gallery, null, 2) + "\n",
);
await writeFile(
  new URL("import-manifest.json", directory),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(`导入 ${items.length} 件店铺作品，${manifest.length} 张真实素材`);
