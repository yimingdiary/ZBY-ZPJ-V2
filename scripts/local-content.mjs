import { readFile, writeFile, rename } from "node:fs/promises";
import Ajv from "ajv";
import { configureLocalAssets } from "./local-assets.mjs";
const root = new URL("../", import.meta.url);

export function localContent() {
  return {
    name: "portfolio-local-content",
    apply: "serve",
    configureServer(server) {
      configureLocalAssets(server);
      server.middlewares.use("/api/content", async (req, res) => {
        const send = (status, data) => {
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify(data));
        };
        try {
          const host = req.headers.host;
          if (
            !host ||
            !["127.0.0.1", "localhost", "[::1]"].some(
              (h) => host === h || host.startsWith(h + ":"),
            )
          )
            return send(403, { error: "仅允许本机访问" });
          if (req.method === "GET")
            return send(200, {
              data: JSON.parse(
                await readFile(
                  new URL("content/draft/home.json", root),
                  "utf8",
                ),
              ),
              mode: "local",
            });
          if (req.method !== "PUT" && req.method !== "POST")
            return send(405, { error: "方法不支持" });
          if (
            req.headers.origin !== `http://${host}` ||
            !req.headers["content-type"]?.startsWith("application/json")
          )
            return send(403, { error: "来源验证失败" });
          let body = "";
          for await (const chunk of req) {
            body += chunk;
            if (body.length > 200000) return send(413, { error: "配置过大" });
          }
          let data;
          try {
            data = JSON.parse(body);
          } catch {
            return send(400, { error: "JSON 格式无效" });
          }
          const validate = new Ajv().compile(
            JSON.parse(
              await readFile(
                new URL("src/content/page.schema.json", root),
                "utf8",
              ),
            ),
          );
          if (!validate(data))
            return send(400, { error: new Ajv().errorsText(validate.errors) });
          const ids = data.content.map((x) => x.props.id);
          if (new Set(ids).size !== ids.length)
            return send(400, { error: "模块 ID 重复" });
          const folder = req.method === "PUT" ? "draft" : "published";
          const path = new URL(`content/${folder}/home.json`, root);
          await writeFile(
            new URL(path.href + ".tmp"),
            JSON.stringify(data, null, 2) + "\n",
          );
          await rename(new URL(path.href + ".tmp"), path);
          send(200, {
            ok: true,
            mode: "local",
            message:
              folder === "draft"
                ? "草稿已保存到本地 JSON"
                : "已更新本地发布 JSON；正式站点尚未部署",
          });
        } catch (error) {
          send(500, { error: error.message });
        }
      });
    },
  };
}
