import { importWorkFolder } from "./work-folders.mjs";
import { imageLibrary, importImage } from "./image-library.mjs";
export function configureLocalAssets(server) {
  const send = (res, status, data) => {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.end(JSON.stringify(data));
  };
  server.middlewares.use("/image-library.json", async (req, res) => {
    if (req.method !== "GET") return send(res, 405, { error: "方法不支持" });
    try {
      send(res, 200, await imageLibrary(true));
    } catch {
      send(res, 500, { error: "图片列表读取失败" });
    }
  });
  server.middlewares.use("/api/work-folders", async (req, res) => {
    const host = req.headers.host;
    if (
      !host ||
      !["127.0.0.1", "localhost", "[::1]"].some(
        (h) => host === h || host.startsWith(h + ":"),
      ) ||
      req.headers.origin !== `http://${host}`
    )
      return send(res, 403, { error: "仅允许本机同源选择作品文件夹" });
    if (req.method !== "POST") return send(res, 405, { error: "方法不支持" });
    if (!req.headers["content-type"]?.startsWith("multipart/form-data;"))
      return send(res, 400, { error: "文件夹数据格式无效" });
    try {
      let size = 0;
      const chunks = [];
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 150 * 1024 * 1024)
          return send(res, 413, { error: "单个作品文件夹不能超过 150 MB" });
        chunks.push(chunk);
      }
      const form = await new Request(`http://${host}/api/work-folders`, {
        method: "POST",
        headers: { "Content-Type": req.headers["content-type"] },
        body: Buffer.concat(chunks),
      }).formData();
      send(res, 200, await importWorkFolder(form));
    } catch (error) {
      send(res, 400, { error: error.message });
    }
  });
  server.middlewares.use("/api/assets", async (req, res) => {
    const host = req.headers.host;
    if (
      !host ||
      !["127.0.0.1", "localhost", "[::1]"].some(
        (h) => host === h || host.startsWith(h + ":"),
      ) ||
      req.headers.origin !== `http://${host}`
    )
      return send(res, 403, { error: "仅允许本机同源导入" });
    if (req.method !== "POST") return send(res, 405, { error: "方法不支持" });
    if (req.headers["content-type"] !== "application/octet-stream")
      return send(res, 400, { error: "图片格式无效" });
    try {
      const chunks = [];
      let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 20 * 1024 * 1024)
          return send(res, 413, { error: "图片不能超过 20 MB" });
        chunks.push(chunk);
      }
      send(
        res,
        200,
        await importImage(
          Buffer.concat(chunks),
          req.headers["x-file-name"]
            ? decodeURIComponent(req.headers["x-file-name"])
            : undefined,
        ),
      );
    } catch (error) {
      send(res, 400, { error: error.message });
    }
  });
}
