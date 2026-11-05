import { test, expect } from "@playwright/test";
import { pbkdf2Sync } from "node:crypto";
import { readFile } from "node:fs/promises";
import worker from "../worker/index";
const origin = "https://portfolio.example";
const env = {
  ASSETS: { fetch: async () => new Response("static") },
  GITHUB_TOKEN: "test-only",
  GITHUB_REPOSITORY: "test/portfolio",
  ADMIN_PASSWORD_HASH: `100000:test-salt:${pbkdf2Sync("test-password", "test-salt", 100000, 32, "sha256").toString("hex")}`,
  SESSION_SECRET: "test-session-secret-not-for-production",
  ALLOWED_ORIGIN: origin,
};
const request = (
  path: string,
  method = "GET",
  body?: unknown,
  cookie?: string,
) =>
  new Request(origin + path, {
    method,
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
test("Worker 未配置时拒绝操作，静态页仍可访问", async () => {
  expect(
    (await worker.fetch(request("/api/content"), { ...env, GITHUB_TOKEN: "" }))
      .status,
  ).toBe(503);
  expect(await (await worker.fetch(request("/"), env)).text()).toBe("static");
  expect((await worker.fetch(request("/api/content"), env)).status).toBe(401);
});
test("Worker 密码验证、签名会话与来源限制", async () => {
  expect(
    (
      await worker.fetch(
        request("/api/login", "POST", { password: "wrong" }),
        env,
      )
    ).status,
  ).toBe(401);
  const login = await worker.fetch(
    request("/api/login", "POST", { password: "test-password" }),
    env,
  );
  expect(login.status).toBe(200);
  const cookie = login.headers.get("Set-Cookie")!;
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
    body: "{}",
  });
  expect((await worker.fetch(cross, env)).status).toBe(403);
  expect(
    (
      await worker.fetch(
        request(
          "/api/content",
          "GET",
          undefined,
          "portfolio_session=9999999999999.invalid",
        ),
        env,
      )
    ).status,
  ).toBe(401);
});
test("Worker 真实调用参数区分草稿分支与发布分支", async () => {
  const login = await worker.fetch(
    request("/api/login", "POST", { password: "test-password" }),
    env,
  );
  const cookie = login.headers.get("Set-Cookie")!;
  const data = JSON.parse(
    await readFile(
      new URL("../content/published/home.json", import.meta.url),
      "utf8",
    ),
  );
  const originalFetch = globalThis.fetch;
  const writes: { url: string; body: any }[] = [];
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    if (init?.method === "PUT") {
      writes.push({ url, body: JSON.parse(String(init.body)) });
      return Response.json({ commit: { sha: "test" } });
    }
    return Response.json({ sha: "existing-sha" });
  };
  try {
    expect(
      (await worker.fetch(request("/api/content", "PUT", data, cookie), env))
        .status,
    ).toBe(200);
    expect(
      (await worker.fetch(request("/api/content", "POST", data, cookie), env))
        .status,
    ).toBe(200);
    expect(writes[0].body.branch).toBe("content-draft");
    expect(writes[0].url).toContain("content/draft/home.json");
    expect(writes[1].body.branch).toBe("main");
    expect(writes[1].url).toContain("content/published/home.json");
    expect(writes.every((x) => x.body.sha === "existing-sha")).toBeTruthy();
  } finally {
    globalThis.fetch = originalFetch;
  }
});
