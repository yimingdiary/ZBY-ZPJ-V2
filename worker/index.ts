import { assertPage } from "../src/content/validate";
interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  GITHUB_TOKEN: string;
  GITHUB_REPOSITORY: string;
  ADMIN_PASSWORD_HASH: string;
  SESSION_SECRET: string;
  ALLOWED_ORIGIN: string;
  DRAFT_BRANCH?: string;
  PUBLISH_BRANCH?: string;
}
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
    ?.match(/(?:^|;\s*)portfolio_session=([^;]+)/)?.[1];
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
async function github(env: Env, path: string, init: RequestInit = {}) {
  const response = await fetch(
    `https://api.github.com/repos/${env.GITHUB_REPOSITORY}/${path}`,
    {
      ...init,
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "ZBY-Portfolio-V2",
        ...init.headers,
      },
    },
  );
  if (!response.ok) throw new Error(`GitHub 操作失败 (${response.status})`);
  return response.json() as Promise<any>;
}
async function read(env: Env, branch: string, path: string) {
  return github(env, `contents/${path}?ref=${encodeURIComponent(branch)}`);
}
function decode(value: string) {
  return JSON.parse(
    new TextDecoder().decode(
      Uint8Array.from(atob(value.replace(/\n/g, "")), (x) => x.charCodeAt(0)),
    ),
  );
}
function encode(data: unknown) {
  let s = "";
  for (const byte of enc.encode(JSON.stringify(data, null, 2) + "\n"))
    s += String.fromCharCode(byte);
  return btoa(s);
}
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);
    if (
      !env.SESSION_SECRET ||
      !env.ADMIN_PASSWORD_HASH ||
      !env.GITHUB_TOKEN ||
      !env.GITHUB_REPOSITORY ||
      !env.ALLOWED_ORIGIN
    )
      return reply(503, { error: "尚未配置正式环境的鉴权与 GitHub 参数" });
    if (!["GET", "PUT", "POST"].includes(request.method))
      return reply(405, { error: "方法不支持" });
    if (
      request.method !== "GET" &&
      (request.headers.get("Origin") !== env.ALLOWED_ORIGIN ||
        !request.headers.get("Content-Type")?.startsWith("application/json"))
    )
      return reply(403, { error: "来源验证失败" });
    try {
      if (url.pathname === "/api/login" && request.method === "POST") {
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
          `portfolio_session=${expires}.${await signed(expires, env.SESSION_SECRET)}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=28800`,
        );
        return response;
      }
      if (!(await session(request, env)))
        return reply(401, { error: "请先登录" });
      if (url.pathname !== "/api/content")
        return reply(404, { error: "接口不存在" });
      const draft = env.DRAFT_BRANCH || "content-draft",
        published = env.PUBLISH_BRANCH || "main";
      if (draft === published)
        return reply(503, { error: "草稿分支与发布分支必须不同" });
      if (request.method === "GET") {
        // 首次使用时显式建立草稿分支，后续只读草稿分支。
        const refResponse = await fetch(
          `https://api.github.com/repos/${env.GITHUB_REPOSITORY}/git/ref/heads/${encodeURIComponent(draft)}`,
          {
            headers: {
              Authorization: `Bearer ${env.GITHUB_TOKEN}`,
              "User-Agent": "ZBY-Portfolio-V2",
            },
          },
        );
        if (refResponse.status === 404) {
          const main = await github(
            env,
            `git/ref/heads/${encodeURIComponent(published)}`,
          );
          await github(env, "git/refs", {
            method: "POST",
            body: JSON.stringify({
              ref: `refs/heads/${draft}`,
              sha: main.object.sha,
            }),
          });
        } else if (!refResponse.ok)
          throw Error(`草稿分支读取失败 (${refResponse.status})`);
        const file = await read(env, draft, "content/draft/home.json");
        const data = decode(file.content);
        assertPage(data);
        return reply(200, { data, mode: "github" });
      }
      const raw = await request.text();
      if (raw.length > 200000) return reply(413, { error: "配置过大" });
      let data;
      try {
        data = JSON.parse(raw);
        assertPage(data);
      } catch (e) {
        return reply(400, { error: String(e) });
      }
      const isDraft = request.method === "PUT",
        branch = isDraft ? draft : published,
        path = `content/${isDraft ? "draft" : "published"}/home.json`;
      const file = await read(env, branch, path);
      await github(env, `contents/${path}`, {
        method: "PUT",
        body: JSON.stringify({
          message: isDraft ? "保存首页草稿" : "发布首页配置",
          branch,
          sha: file.sha,
          content: encode(data),
        }),
      });
      return reply(200, {
        ok: true,
        mode: "github",
        message: isDraft
          ? "草稿已保存至独立分支"
          : "已提交发布配置，等待 Cloudflare Pages 构建；尚未确认上线",
      });
    } catch (error) {
      console.error(String(error));
      return reply(502, {
        error: "服务操作失败，请检查 GitHub 权限、分支状态及 Worker 日志",
      });
    }
  },
};
