import { test, expect } from "@playwright/test";
import { pbkdf2Sync } from "node:crypto";
import { readFile } from "node:fs/promises";
import worker from "../worker/index";
const origin = "https://portfolio.example";
const data = JSON.parse(
  await readFile(
    new URL("../content/published/home.json", import.meta.url),
    "utf8",
  ),
);
const objects = new Map<
  string,
  { value: string | ArrayBuffer; mime: string }
>();
const touched: string[] = [];
const env = {
  ASSETS: {
    fetch: async (r: Request) =>
      new Response(`static:${new URL(r.url).pathname}`),
  },
  PORTFOLIO: {
    async get(key: string, options?: any) {
      touched.push(key);
      const obj = objects.get(key);
      if (!obj) return null;
      const bytes =
        typeof obj.value === "string"
          ? new TextEncoder().encode(obj.value)
          : new Uint8Array(obj.value);
      const range =
        options?.range?.get?.("Range") === "bytes=1-2"
          ? { offset: 1, length: 2 }
          : undefined;
      return {
        body: new Blob([range ? bytes.slice(1, 3) : bytes]).stream(),
        size: bytes.length,
        range,
        httpEtag: '"test"',
        writeHttpMetadata(h: Headers) {
          h.set("Content-Type", obj.mime);
        },
        async text() {
          return new TextDecoder().decode(bytes);
        },
      };
    },
    async put(key: string, value: string | ArrayBuffer, options?: any) {
      touched.push(key);
      objects.set(key, {
        value,
        mime: options?.httpMetadata?.contentType || "application/octet-stream",
      });
    },
    async list(options: { prefix: string }) {
      touched.push(options.prefix);
      return {
        objects: [...objects.keys()]
          .filter((key) => key.startsWith(options.prefix))
          .map((key) => ({ key })),
        truncated: false,
      };
    },
  },
  ADMIN_PASSWORD_HASH: `100000:test-salt:${pbkdf2Sync("test-password", "test-salt", 100000, 32, "sha256").toString("hex")}`,
  SESSION_SECRET: "test-session-secret-not-for-production",
  ALLOWED_ORIGIN: origin,
};
function request(
  path: string,
  method = "GET",
  body?: unknown,
  cookie?: string,
) {
  return new Request(origin + path, {
    method,
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
async function login() {
  const response = await worker.fetch(
    request("/api/login", "POST", { password: "test-password" }),
    env,
  );
  expect(response.status).toBe(200);
  return response.headers.get("Set-Cookie")!;
}
test.beforeEach(() => {
  objects.clear();
  touched.length = 0;
  for (const kind of ["draft", "published"])
    objects.set(`v3/content/${kind}/home.json`, {
      value: JSON.stringify(data),
      mime: "application/json",
    });
  objects.set("DY-Page/sentinel", { value: "unchanged", mime: "text/plain" });
});
test.afterEach(() => {
  expect(touched.every((key) => key.startsWith("v3/"))).toBe(true);
  expect(objects.get("DY-Page/sentinel")?.value).toBe("unchanged");
});
test("R2 未配置与登录来源校验、独立会话", async () => {
  expect(
    (
      await worker.fetch(request("/api/content"), {
        ...env,
        PORTFOLIO: undefined as any,
      })
    ).status,
  ).toBe(503);
  expect(await (await worker.fetch(request("/"), env)).text()).toBe("static:/");
  expect((await worker.fetch(request("/api/content"), env)).status).toBe(401);
  expect(
    (
      await worker.fetch(
        request("/api/login", "POST", { password: "wrong" }),
        env,
      )
    ).status,
  ).toBe(401);
  const cookie = await login();
  expect(cookie).toContain("portfolio_v3_session=");
  expect(cookie).toContain("HttpOnly");
  expect(cookie).toContain("Secure");
  expect(cookie).toContain("SameSite=Strict");
  const cross = new Request(origin + "/api/content", {
    method: "PUT",
    headers: {
      Origin: "https://other.example",
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify(data),
  });
  expect((await worker.fetch(cross, env)).status).toBe(403);
  expect(
    (
      await worker.fetch(
        request(
          "/api/content",
          "GET",
          undefined,
          cookie.replace("portfolio_v3_session", "portfolio_session"),
        ),
        env,
      )
    ).status,
  ).toBe(401);
});
test("草稿隔离、发布直接生效、非法内容不写入", async () => {
  const cookie = await login();
  const next = structuredClone(data);
  const nav = next.content.find((x: any) => x.type === "Navigation");
  nav.props.brand = "V3 新标题";
  expect(
    (await worker.fetch(request("/api/content", "PUT", next, cookie), env))
      .status,
  ).toBe(200);
  expect(
    (
      await (
        await worker.fetch(
          request("/api/content", "GET", undefined, cookie),
          env,
        )
      ).json()
    ).data,
  ).toEqual(next);
  expect(
    (await (await worker.fetch(request("/api/published"), env)).json()).data,
  ).toEqual(data);
  expect(
    (await worker.fetch(request("/api/content", "POST", next, cookie), env))
      .status,
  ).toBe(200);
  expect(
    (await (await worker.fetch(request("/api/published"), env)).json()).data,
  ).toEqual(next);
  const before = objects.get("v3/content/published/home.json")?.value;
  expect(
    (
      await worker.fetch(
        request("/api/content", "POST", { invalid: true }, cookie),
        env,
      )
    ).status,
  ).toBe(400);
  expect(objects.get("v3/content/published/home.json")?.value).toBe(before);
});
test("素材只从 v3 读取，支持中文、范围请求，缺失不回退", async () => {
  objects.set("v3/images/测试.webp", { value: "abcd", mime: "image/webp" });
  const r = await worker.fetch(
    request("/images/" + encodeURIComponent("测试.webp")),
    env,
  );
  expect(await r.text()).toBe("abcd");
  expect(r.headers.get("Content-Type")).toBe("image/webp");
  const range = await worker.fetch(
    new Request(origin + "/images/测试.webp", {
      headers: { Range: "bytes=1-2" },
    }),
    env,
  );
  expect(range.status).toBe(206);
  expect(range.headers.get("Content-Range")).toBe("bytes 1-2/4");
  expect(await range.text()).toBe("bc");
  expect((await worker.fetch(request("/images/missing.png"), env)).status).toBe(
    404,
  );
  expect(
    await (await worker.fetch(request("/overlay/alfie-buddy"), env)).text(),
  ).toBe("static:/overlay/alfie-buddy");
  expect(
    await (await worker.fetch(request("/shop/new-slug"), env)).text(),
  ).toBe("static:/shop");
  expect((await worker.fetch(request("/api/published"), env)).status).toBe(200);
});
test("上传归属与图片索引，拒绝路径穿越和未登录上传", async () => {
  for (const name of ["image-library.json", "shop-image-library.json"])
    objects.set("v3/" + name, {
      value: JSON.stringify({ images: [] }),
      mime: "application/json",
    });
  const cookie = await login();
  const bytes = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const upload = (name: string, cookieValue = cookie) =>
    new Request(origin + "/api/shop-assets", {
      method: "POST",
      headers: {
        Origin: origin,
        "Content-Type": "application/octet-stream",
        "X-File-Name": encodeURIComponent(name),
        "X-Shop-Project": "new-shop",
        Cookie: cookieValue,
      },
      body: bytes,
    });
  expect((await worker.fetch(upload("../bad.png"), env)).status).toBe(400);
  expect((await worker.fetch(upload("新图.png", ""), env)).status).toBe(401);
  const r = await worker.fetch(upload("新图.png"), env);
  expect(r.status).toBe(200);
  const { src } = await r.json();
  expect(src).toMatch(/^\/images\/douyin-shop\/new-shop\/uploads\//);
  expect((await worker.fetch(request(src), env)).status).toBe(200);
  const library = await (
    await worker.fetch(request("/shop-image-library.json"), env)
  ).json();
  expect(library.canImport).toBe(true);
  expect(library.images.some((x: any) => x.src === src)).toBe(true);
});
