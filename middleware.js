const COOKIE_NAME = "zpj_access_key";
const DEFAULT_ACCESS_KEY = "1234";

function edgeEnv(context) {
  if (context?.env) return context.env;
  if (globalThis.env) return globalThis.env;
  if (typeof env !== "undefined") return env;
  return {};
}

function accessKeyEnabled(env) {
  return String(env.ACCESS_KEY_ENABLED || "false").toLowerCase() === "true";
}

function expectedAccessKey(env) {
  return String(env.ACCESS_KEY || DEFAULT_ACCESS_KEY);
}

function cookieValue(request, name) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

function authCookie(value) {
  return `${COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; Max-Age=2592000; HttpOnly; SameSite=Lax`;
}

function withoutCodeParam(url) {
  const next = new URL(url);
  next.searchParams.delete("code");
  return next;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function unlockResponse(request, key) {
  return new Response(null, {
    status: 303,
    headers: {
      Location: withoutCodeParam(request.url).toString(),
      "Set-Cookie": authCookie(key),
      "Cache-Control": "no-store",
    },
  });
}

function lockPage(request, error = "") {
  const url = new URL(request.url);
  const nextPath = escapeHtml(`${url.pathname}${url.search}`);
  const errorHtml = error ? `<p class="error">${error}</p>` : "";

  return new Response(
    `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>访问验证</title>
    <style>
      * { box-sizing: border-box; }
      html, body { width: 100%; min-height: 100%; margin: 0; background: #171717; color: #f4f4f4; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      body { display: grid; place-items: center; padding: 24px; }
      main { width: min(360px, 100%); }
      h1 { margin: 0 0 10px; font-size: 22px; font-weight: 650; letter-spacing: 0; }
      p { margin: 0 0 20px; color: rgba(255,255,255,.68); font-size: 14px; line-height: 1.6; }
      form { display: grid; gap: 12px; }
      input { width: 100%; height: 46px; border: 1px solid rgba(255,255,255,.18); border-radius: 6px; background: rgba(255,255,255,.08); color: #fff; padding: 0 14px; font-size: 18px; outline: none; }
      input:focus { border-color: rgba(255,255,255,.62); }
      button { height: 46px; border: 0; border-radius: 6px; background: #f4f4f4; color: #171717; font-size: 15px; font-weight: 650; cursor: pointer; }
      .error { color: #ffb4a8; }
    </style>
  </head>
  <body>
    <main>
      <h1>输入访问码</h1>
      <p>这个页面需要访问码才能查看。</p>
      ${errorHtml}
      <form method="post" action="${nextPath}">
        <input name="code" inputmode="numeric" autocomplete="one-time-code" placeholder="访问码" autofocus />
        <button type="submit">进入</button>
      </form>
    </main>
  </body>
</html>`,
    {
      status: 401,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    },
  );
}

async function codeFromPost(request) {
  const form = await request.formData();
  return String(form.get("code") || "");
}

export async function onRequest(context) {
  const { request, next } = context;
  const currentEnv = edgeEnv(context);
  if (!accessKeyEnabled(currentEnv)) return next();

  const expected = expectedAccessKey(currentEnv);
  if (cookieValue(request, COOKIE_NAME) === expected) return next();

  const url = new URL(request.url);
  const queryCode = url.searchParams.get("code");
  if (queryCode === expected) return unlockResponse(request, expected);

  if (request.method === "POST") {
    const postedCode = await codeFromPost(request);
    if (postedCode === expected) return unlockResponse(request, expected);
    return lockPage(request, "访问码不正确。");
  }

  return lockPage(request);
}
