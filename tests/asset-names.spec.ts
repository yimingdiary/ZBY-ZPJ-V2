import { test, expect } from "@playwright/test";
import { deflateSync } from "node:zlib";
import { readFile, mkdtemp, rm, unlink, rmdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
const root = new URL("../", import.meta.url);
function png(red: number) {
  const crc = (b: Buffer) => {
    let c = 0xffffffff;
    for (const n of b) {
      c ^= n;
      for (let i = 0; i < 8; i++) c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
    }
    return (c ^ 0xffffffff) >>> 0;
  };
  const chunk = (name: string, data: Buffer) => {
    const type = Buffer.from(name);
    const n = Buffer.alloc(4),
      sum = Buffer.alloc(4);
    n.writeUInt32BE(data.length);
    sum.writeUInt32BE(crc(Buffer.concat([type, data])));
    return Buffer.concat([n, type, data, sum]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(1, 0);
  ihdr.writeUInt32BE(1, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(Buffer.from([0, red, 0, 0, 255]))),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
test("同名不同图片保留原文件名且分别存储，不覆盖；重复导入复用原文件", async ({
  request,
}) => {
  const name = "260605_贴片_主号_哈根达斯&梦龙.png";
  const imports: { src: string; imported: boolean }[] = [];
  const headers = {
    Origin: "http://127.0.0.1:4321",
    "Content-Type": "application/octet-stream",
    "X-File-Name": encodeURIComponent(name),
  };
  try {
    for (const red of [41, 197]) {
      const r = await request.post("/api/assets", { headers, data: png(red) });
      expect(r.ok()).toBeTruthy();
      const data = await r.json();
      imports.push(data);
      expect(data.src.endsWith("/" + name)).toBe(true);
      expect(await readFile(new URL("public" + data.src, root))).toEqual(
        png(red),
      );
    }
    expect(imports[0].src).not.toBe(imports[1].src);
    expect(await readFile(new URL("public" + imports[0].src, root))).toEqual(
      png(41),
    );
    const repeat = await request.post("/api/assets", {
      headers,
      data: png(41),
    });
    expect(await repeat.json()).toMatchObject({
      src: imports[0].src,
      imported: false,
    });
  } finally {
    for (const item of imports)
      if (item.imported) {
        const url = new URL("public" + item.src, root);
        await unlink(url);
        await rmdir(new URL(".", url));
      }
  }
});
test("作品目录保留源项目名，同名新作品获得稳定后缀且不占用旧目录", async () => {
  const dir = await mkdtemp(new URL(".cache/work-name-check-", root).pathname);
  try {
    const result = execFileSync(
      "python3",
      [
        "-c",
        `# coding: utf-8
import sys,json
from pathlib import Path
from importlib.util import spec_from_file_location,module_from_spec
spec=spec_from_file_location('names',sys.argv[1]);m=module_from_spec(spec);spec.loader.exec_module(m)
root=Path(sys.argv[2]);name=sys.argv[3]
first=m.source_directory(root,{},'first',name);(root/first).mkdir()
catalog={'first':{'sourceName':name,'folderName':first}}
second=m.source_directory(root,catalog,'second',name)
catalog['second']={'sourceName':name,'folderName':second}
print(json.dumps([first,second,m.source_directory(root,catalog,'second',name)],ensure_ascii=False))`,
        new URL("scripts/work-directories.py", root).pathname,
        dir,
        "260605_贴片_主号_哈根达斯&梦龙",
      ],
      { encoding: "utf8" },
    );
    const [first, second, repeated] = JSON.parse(result);
    expect(first).toBe("260605_贴片_主号_哈根达斯&梦龙");
    expect(second).toMatch(/^260605_贴片_主号_哈根达斯&梦龙__[a-f0-9]{8}$/);
    expect(repeated).toBe(second);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
