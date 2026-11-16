import { assertPage } from "../src/content/validate";
interface R2Object {
  body: ReadableStream;
  httpEtag: string;
  size: number;
  range?: { offset: number; length: number };
  writeHttpMetadata(headers: Headers): void;
  text(): Promise<string>;
}
interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  PORTFOLIO: {
    list(options: {
      prefix: string;
      cursor?: string;
    }): Promise<{
      objects: { key: string }[];
      truncated: boolean;
      cursor?: string;
    }>;
    get(key: string, options?: object): Promise<R2Object | null>;
    put(
      key: string,
      value: string | ArrayBuffer,
      options?: object,
    ): Promise<unknown>;
  };
  ADMIN_PASSWORD_HASH: string;
  SESSION_SECRET: string;
  ALLOWED_ORIGIN: string;
}
const PREFIX = "v3/";
const publicAsset = (path: string) =>
  /^\/(images|fonts|decorations)\//.test(path) ||
  /^\/overlay\/.+\.[A-Za-z0-9]+$/.test(path) ||
  ["/image-library.json", "/shop-image-library.json"].includes(path);
const enc = new TextEncoder();
function reply(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
const hex = (b: ArrayBuffer) =>
  Array.from(new Uint8Array(b), (x) => x.toString(16).padStart(2, "0")).join(
    "",
  );
async function key(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}
async function signed(value: string, secret: string) {
  return hex(
    await crypto.subtle.sign("HMAC", await key(secret), enc.encode(value)),
  );
}
async function session(request: Request, env: Env) {
  const token = request.headers
    .get("Cookie")
    ?.match(/(?:^|;\s*)portfolio_v3_session=([^;]+)/)?.[1];
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (
    !signature ||
    !/^\d+$/.test(expires) ||
    Number(expires) < Date.now() ||
    !/^[a-f0-9]{64}$/.test(signature)
  )
    return false;
  return crypto.subtle.verify(
    "HMAC",
    await key(env.SESSION_SECRET),
    Uint8Array.from(signature.match(/../g)!, (x) => parseInt(x, 16)),
    enc.encode(expires),
  );
}
async function verifyPassword(password: string, stored: string) {
  const [iterations, salt, expected] = stored.split(":");
  if (!iterations || !salt || !expected) return false;
  const k = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const actual = hex(
    await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        hash: "SHA-256",
        salt: enc.encode(salt),
        iterations: Number(iterations),
      },
      k,
      256,
    ),
  );
  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < actual.length; i++)
    diff |= actual.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

async function document(env: Env, kind: "draft" | "published") {
  const object = await env.PORTFOLIO.get(`${PREFIX}content/${kind}/home.json`);
  if (!object) throw Error(`R2 缺少 ${kind} 内容，请先初始化 v3 数据`);
  const data = JSON.parse(await object.text());
  assertPage(data);
  return data;
}
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    try {
      if (
        ["/image-library.json", "/shop-image-library.json"].includes(
          url.pathname,
        ) &&
        request.method === "GET"
      ) {
        if (!env.PORTFOLIO)
          return reply(503, { error: "未绑定 portfolio R2 桶" });
        const object = await env.PORTFOLIO.get(PREFIX + url.pathname.slice(1));
        if (!object) return reply(404, { error: "尚未初始化图片索引" });
        const library = JSON.parse(await object.text());
        const shop = url.pathname.startsWith("/shop-");
        const prefix =
          PREFIX + (shop ? "images/douyin-shop/" : "images/uploads/");
        let cursor: string | undefined;
        do {
          const page = await env.PORTFOLIO.list({ prefix, cursor });
          for (const item of page.objects) {
            const src = "/" + item.key.slice(PREFIX.length);
            if (
              src.includes("/uploads/") &&
              !library.images.some((x: { src: string }) => x.src === src)
            )
              library.images.push({
                src,
                label: src.split("/").pop(),
                canAnimate: false,
              });
          }
          cursor = page.truncated ? page.cursor : undefined;
        } while (cursor);
        return reply(200, { ...library, canImport: true });
      }
      if (publicAsset(url.pathname)) {
        if (!["GET", "HEAD"].includes(request.method))
          return reply(405, { error: "方法不支持" });
        if (!env.PORTFOLIO)
          return reply(503, { error: "未绑定 portfolio R2 桶" });
        const path = decodeURIComponent(url.pathname).slice(1);
        if (
          path.split("/").some((x) => x === "." || x === "..") ||
          /[\\\x00-\x1f%]/.test(path)
        )
          return reply(400, { error: "非法素材路径" });
        const object = await env.PORTFOLIO.get(PREFIX + path, {
          range: request.headers,
        });
        if (!object) return new Response("素材不存在", { status: 404 });
        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("ETag", object.httpEtag);
        headers.set("Cache-Control", "public, max-age=0, must-revalidate");
        headers.set("Accept-Ranges", "bytes");
        if (request.headers.get("If-None-Match") === object.httpEtag)
          return new Response(null, { status: 304, headers });
        if (object.range)
          headers.set(
            "Content-Range",
            `bytes ${object.range.offset}-${object.range.offset + object.range.length - 1}/${object.size}`,
          );
        return new Response(request.method === "HEAD" ? null : object.body, {
          status: object.range ? 206 : 200,
          headers,
        });
      }
      if (!url.pathname.startsWith("/api/")) {
        if (/^\/shop\/[^/]+\/?$/.test(url.pathname)) {
          const shell = new URL("/shop", url);
          return env.ASSETS.fetch(new Request(shell, request));
        }
        return env.ASSETS.fetch(request);
      }
      if (!env.PORTFOLIO)
        return reply(503, { error: "未绑定 portfolio R2 桶" });
      if (url.pathname === "/api/published" && request.method === "GET")
        return reply(200, {
          data: await document(env, "published"),
          mode: "r2",
        });
      if (
        !env.SESSION_SECRET ||
        !env.ADMIN_PASSWORD_HASH ||
        !env.ALLOWED_ORIGIN
      )
        return reply(503, { error: "尚未配置正式环境鉴权参数" });
      if (!["GET", "PUT", "POST"].includes(request.method))
        return reply(405, { error: "方法不支持" });
      if (
        request.method !== "GET" &&
        request.headers.get("Origin") !== env.ALLOWED_ORIGIN
      )
        return reply(403, { error: "来源验证失败" });
      if (url.pathname === "/api/login" && request.method === "POST") {
        if (
          !request.headers.get("Content-Type")?.startsWith("application/json")
        )
          return reply(415, { error: "需要 JSON" });
        const body = (await request.json()) as { password: string };
        if (
          typeof body.password !== "string" ||
          body.password.length > 256 ||
          !(await verifyPassword(body.password, env.ADMIN_PASSWORD_HASH))
        )
          return reply(401, { error: "密码错误" });
        const expires = String(Date.now() + 8 * 3600000);
        const response = reply(200, { ok: true });
        response.headers.set(
          "Set-Cookie",
          `portfolio_v3_session=${expires}.${await signed(expires, env.SESSION_SECRET)}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=28800`,
        );
        return response;
      }
      if (!(await session(request, env)))
        return reply(401, { error: "请先登录" });
      if (
        ["/api/assets", "/api/shop-assets"].includes(url.pathname) &&
        request.method === "POST"
      ) {
        if (request.headers.get("Content-Type") !== "application/octet-stream")
          return reply(415, { error: "需要图片文件" });
        if (Number(request.headers.get("Content-Length")) > 20 * 1024 * 1024)
          return reply(413, { error: "图片超过 20MB" });
        const bytes = await request.arrayBuffer();
        if (bytes.byteLength > 20 * 1024 * 1024)
          return reply(413, { error: "图片超过 20MB" });
        const b = new Uint8Array(bytes);
        const ascii = (start: number, end: number) =>
          new TextDecoder().decode(b.slice(start, end));
        let mime = "";
        if (
          b[0] === 137 &&
          ascii(1, 4) === "PNG" &&
          b[4] === 13 &&
          b[5] === 10 &&
          b[6] === 26 &&
          b[7] === 10
        )
          mime = "image/png";
        else if (b[0] === 255 && b[1] === 216 && b[2] === 255)
          mime = "image/jpeg";
        else if (["GIF87a", "GIF89a"].includes(ascii(0, 6))) mime = "image/gif";
        else if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP")
          mime = "image/webp";
        else if (
          ascii(4, 8) === "ftyp" &&
          ["avif", "avis"].includes(ascii(8, 12))
        )
          mime = "image/avif";
        if (!mime)
          return reply(400, { error: "支持 JPG、PNG、WebP、GIF、AVIF 图片" });
        const filename = decodeURIComponent(
          request.headers.get("X-File-Name") || "",
        );
        if (
          !filename ||
          filename.length > 180 ||
          /[\\/\x00-\x1f%]/.test(filename) ||
          filename.startsWith(".")
        )
          return reply(400, { error: "文件名无效" });
        const project = request.headers.get("X-Shop-Project") || "";
        const shop = url.pathname === "/api/shop-assets";
        if (shop && !/^[A-Za-z0-9_-]{1,120}$/.test(project))
          return reply(400, { error: "请选择有效店铺项目" });
        const digest = hex(await crypto.subtle.digest("SHA-256", bytes));
        const src = shop
          ? `/images/douyin-shop/${project}/uploads/${digest}/${filename}`
          : `/images/uploads/${digest}/${filename}`;
        await env.PORTFOLIO.put(PREFIX + src.slice(1), bytes, {
          httpMetadata: { contentType: mime },
        });
        return reply(200, { src });
      }
      if (url.pathname !== "/api/content")
        return reply(404, { error: "接口不存在" });
      if (request.method === "GET")
        return reply(200, { data: await document(env, "draft"), mode: "r2" });
      if (!request.headers.get("Content-Type")?.startsWith("application/json"))
        return reply(415, { error: "需要 JSON" });
      const raw = await request.text();
      if (enc.encode(raw).length > 200000)
        return reply(413, { error: "配置过大" });
      let data;
      try {
        data = JSON.parse(raw);
        assertPage(data);
      } catch (e) {
        return reply(400, { error: String(e) });
      }
      const kind = request.method === "PUT" ? "draft" : "published";
      await env.PORTFOLIO.put(
        `${PREFIX}content/${kind}/home.json`,
        JSON.stringify(data),
        { httpMetadata: { contentType: "application/json; charset=utf-8" } },
      );
      return reply(200, {
        ok: true,
        mode: "r2",
        message:
          kind === "draft"
            ? "草稿已保存至 R2"
            : "已发布至 R2，刷新公开页面即可查看",
      });
    } catch (error) {
      console.error(String(error));
      return reply(502, {
        error: "R2 操作失败，请检查 v3 数据初始化、绑定与 Worker 日志",
      });
    }
  },
};
