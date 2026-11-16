import { Miniflare, convertV4MiniflareOptions } from "miniflare";
import { readFile } from "node:fs/promises";
import { pbkdf2Sync } from "node:crypto";
import assert from "node:assert/strict";
const origin = "https://v3.example";
const mf = new Miniflare(
  convertV4MiniflareOptions({
    modules: true,
    scriptPath: "dist/_worker.js",
    compatibilityDate: "2026-11-16",
    r2Buckets: { PORTFOLIO: "portfolio" },
    bindings: {
      ADMIN_PASSWORD_HASH: `100000:local-salt:${pbkdf2Sync("local-runtime-test", "local-salt", 100000, 32, "sha256").toString("hex")}`,
      SESSION_SECRET: "local-runtime-session-secret-not-production",
      ALLOWED_ORIGIN: origin,
    },
    serviceBindings: {
      ASSETS: async (request) =>
        new Response("static:" + new URL(request.url).pathname),
    },
  }),
);
try {
  const bucket = await mf.getR2Bucket("PORTFOLIO");
  const data = JSON.parse(
    await readFile("content/published/home.json", "utf8"),
  );
  for (const kind of ["draft", "published"])
    await bucket.put(`v3/content/${kind}/home.json`, JSON.stringify(data));
  await bucket.put("v3/images/runtime.txt", "abcd", {
    httpMetadata: { contentType: "text/plain" },
  });
  const pub = await mf.dispatchFetch(origin + "/api/published");
  assert.equal(pub.status, 200);
  assert.deepEqual((await pub.json()).data, data);
  const login = await mf.dispatchFetch(origin + "/api/login", {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json" },
    body: JSON.stringify({ password: "local-runtime-test" }),
  });
  assert.equal(login.status, 200);
  const cookie = login.headers.get("Set-Cookie");
  assert.ok(cookie.includes("portfolio_v3_session"));
  const next = structuredClone(data);
  next.content.find((x) => x.type === "Navigation").props.brand =
    "workerd-runtime";
  const save = await mf.dispatchFetch(origin + "/api/content", {
    method: "PUT",
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify(next),
  });
  assert.equal(save.status, 200);
  assert.deepEqual(
    await (await bucket.get("v3/content/draft/home.json")).json(),
    next,
  );
  assert.deepEqual(
    await (await bucket.get("v3/content/published/home.json")).json(),
    data,
  );
  const asset = await mf.dispatchFetch(origin + "/images/runtime.txt", {
    headers: { Range: "bytes=1-2" },
  });
  assert.equal(asset.status, 206);
  assert.equal(await asset.text(), "bc");
  const shell = await mf.dispatchFetch(origin + "/shop/new-shop");
  assert.equal(await shell.text(), "static:/shop");
  console.log(
    "编译产物在真实 workerd + 本地 R2 中通过：公开读取、登录、草稿隔离、Range、动态店铺路由。",
  );
} finally {
  await mf.dispose();
}
