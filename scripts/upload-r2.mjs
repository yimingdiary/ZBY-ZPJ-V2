import { readdir, readFile, lstat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const root = fileURLToPath(new URL("../", import.meta.url));
const upload = process.argv.includes("--upload");
const includeContent = process.argv.includes("--initialize-content");
const files = [];
async function scan(folder, relative = "") {
  for (const name of await readdir(folder)) {
    if (name.startsWith(".")) continue;
    const file = path.join(folder, name),
      rel = path.posix.join(relative, name);
    const stat = await lstat(file);
    if (stat.isSymbolicLink()) throw Error(`拒绝符号链接: ${rel}`);
    if (stat.isDirectory()) await scan(file, rel);
    else if (!["_routes.json", "_headers", "_redirects"].includes(rel))
      files.push({ file, key: `v3/${rel}` });
  }
}
await scan(path.join(root, "public"));
if (includeContent)
  for (const kind of ["draft", "published"])
    files.push({
      file: path.join(root, `content/${kind}/home.json`),
      key: `v3/content/${kind}/home.json`,
    });
if (files.some((x) => !x.key.startsWith("v3/") || x.key.includes("/../")))
  throw Error("前缀校验失败");
console.log(
  `目标桶: portfolio；前缀: v3/；${files.length} 个文件；不删除远端对象。`,
);
if (!upload) {
  console.log(
    "当前仅生成计划。上传素材: npm run r2:upload；首次初始化内容另加 -- --initialize-content（已有内容时拒绝覆盖）。",
  );
  process.exit(0);
}
for (const key of ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY"])
  if (!process.env[key]) throw Error(`缺少环境变量 ${key}`);
const client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
const types = {
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};
for (const item of files) {
  await client.send(
    new PutObjectCommand({
      Bucket: "portfolio",
      Key: item.key,
      Body: await readFile(item.file),
      ContentType:
        types[path.extname(item.file).toLowerCase()] ||
        "application/octet-stream",
      ...(item.key.startsWith("v3/content/") ? { IfNoneMatch: "*" } : {}),
    }),
  );
}
console.log("上传完成，仅写入 portfolio/v3/。");
