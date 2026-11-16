import { test, expect } from "@playwright/test";
import http from "node:http";
import { readFile, writeFile } from "node:fs/promises";
const draft = new URL("../content/draft/home.json", import.meta.url);
test("保存请求分片截断中文图片名称时，UTF8仍完整保存", async () => {
  const original = await readFile(draft, "utf8");
  try {
    const data = JSON.parse(original);
    const buffer = Buffer.from(JSON.stringify(data));
    const chinese = buffer.indexOf(Buffer.from("素材-81"));
    expect(chinese).toBeGreaterThan(0);
    const split = chinese + 1;
    const status = await new Promise<number | undefined>((resolve, reject) => {
      const req = http.request(
        "http://127.0.0.1:4323/api/content",
        {
          method: "PUT",
          headers: {
            Origin: "http://127.0.0.1:4323",
            "Content-Type": "application/json",
          },
        },
        (res) => {
          res.resume();
          res.on("end", () => resolve(res.statusCode));
        },
      );
      req.on("error", reject);
      req.write(buffer.subarray(0, split));
      setTimeout(() => req.end(buffer.subarray(split)), 30);
    });
    expect(status).toBe(200);
    const saved = await readFile(draft, "utf8");
    expect(saved).not.toContain("\ufffd");
    expect(JSON.parse(saved)).toEqual(data);
  } finally {
    await writeFile(draft, original);
  }
});
