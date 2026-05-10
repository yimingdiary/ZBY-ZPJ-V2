const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const rootDir = __dirname;
const imagesDir = path.join(rootDir, "images");
const preferredPort = Number(process.env.PORT || 4173);
const accessCookieName = "zpj_access_key";
const defaultAccessKey = "1234";

const imageExtensions = new Set([
  ".avif",
  ".bmp",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".svg",
  ".webp",
]);

const mimeTypes = {
  ".avif": "image/avif",
  ".bmp": "image/bmp",
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mov": "video/quicktime",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webm": "video/webm",
  ".webp": "image/webp",
};

const longCacheExtensions = new Set([
  ".avif",
  ".bmp",
  ".gif",
  ".jpeg",
  ".jpg",
  ".mov",
  ".mp4",
  ".png",
  ".svg",
  ".webm",
  ".webp",
]);

const collator = new Intl.Collator("zh-CN", {
  numeric: true,
  sensitivity: "base",
});

const imageExtensionPreference = new Map([
  [".avif", 5],
  [".webp", 4],
  [".jpg", 3],
  [".jpeg", 3],
  [".png", 2],
  [".gif", 1],
  [".bmp", 0],
  [".svg", 0],
]);

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function cacheControlFor(ext) {
  if (longCacheExtensions.has(ext)) return "public, max-age=31536000, immutable";
  return "no-store";
}

function accessKeyEnabled() {
  return String(process.env.ACCESS_KEY_ENABLED || "false").toLowerCase() === "true";
}

function expectedAccessKey() {
  return String(process.env.ACCESS_KEY || defaultAccessKey);
}

function cookieValue(req, name) {
  const cookie = req.headers.cookie || "";
  const match = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : "";
}

function authCookie(value) {
  return `${accessCookieName}=${encodeURIComponent(value)}; Path=/; Max-Age=2592000; HttpOnly; SameSite=Lax`;
}

function withoutCodeParam(req) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  url.searchParams.delete("code");
  return `${url.pathname}${url.search}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function lockPage(req, error = "") {
  const errorHtml = error ? `<p class="error">${error}</p>` : "";
  return `<!doctype html>
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
      <form method="post" action="${escapeHtml(withoutCodeParam(req))}">
        <input name="code" inputmode="numeric" autocomplete="one-time-code" placeholder="访问码" autofocus />
        <button type="submit">进入</button>
      </form>
    </main>
  </body>
</html>`;
}

function redirectWithAccessCookie(req, res) {
  res.writeHead(303, {
    Location: withoutCodeParam(req),
    "Set-Cookie": authCookie(expectedAccessKey()),
    "Cache-Control": "no-store",
  });
  res.end();
}

function readRequestBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2048) req.destroy();
    });
    req.on("end", () => resolve(body));
    req.on("error", () => resolve(""));
  });
}

async function authorize(req, res, url) {
  if (!accessKeyEnabled()) return true;

  const expected = expectedAccessKey();
  if (cookieValue(req, accessCookieName) === expected) return true;

  const queryCode = url.searchParams.get("code");
  if (queryCode === expected) {
    redirectWithAccessCookie(req, res);
    return false;
  }

  if (req.method === "POST") {
    const body = await readRequestBody(req);
    const postedCode = new URLSearchParams(body).get("code");
    if (postedCode === expected) {
      redirectWithAccessCookie(req, res);
      return false;
    }

    send(res, 401, lockPage(req, "访问码不正确。"), mimeTypes[".html"]);
    return false;
  }

  send(res, 401, lockPage(req), mimeTypes[".html"]);
  return false;
}

function listImages() {
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

  const preferredByStem = new Map();

  fs
    .readdirSync(imagesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => imageExtensions.has(path.extname(name).toLowerCase()))
    .forEach((name) => {
      const ext = path.extname(name).toLowerCase();
      const stem = name.slice(0, -ext.length);
      const current = preferredByStem.get(stem);
      const score = imageExtensionPreference.get(ext) || 0;
      const currentScore = current ? imageExtensionPreference.get(path.extname(current).toLowerCase()) || 0 : -1;

      if (!current || score > currentScore || (score === currentScore && collator.compare(name, current) < 0)) {
        preferredByStem.set(stem, name);
      }
    });

  return [...preferredByStem.values()]
    .sort(collator.compare)
    .map((name) => ({
      name,
      url: `/images/${encodeURIComponent(name)}`,
    }));
}

function resolveStaticPath(pathname) {
  const decodedPath = decodeURIComponent(pathname);
  const relativePath = decodedPath === "/" ? "index.html" : decodedPath.slice(1);
  const filePath = path.resolve(rootDir, relativePath);

  if (!filePath.startsWith(rootDir + path.sep) && filePath !== rootDir) {
    return null;
  }

  return filePath;
}

function serveStatic(req, res, pathname) {
  const filePath = resolveStaticPath(pathname);
  if (!filePath) {
    send(res, 403, "Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stat) => {
    if (statError || !stat.isFile()) {
      send(res, statError?.code === "ENOENT" ? 404 : 500, "Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const type = mimeTypes[ext] || "application/octet-stream";
    const cacheControl = cacheControlFor(ext);
    const range = req.headers.range;

    if (range) {
      const match = range.match(/bytes=(\d*)-(\d*)/);
      const start = match?.[1] ? Number(match[1]) : 0;
      const end = match?.[2] ? Number(match[2]) : stat.size - 1;

      if (!match || start >= stat.size || end >= stat.size || start > end) {
        res.writeHead(416, {
          "Content-Range": `bytes */${stat.size}`,
          "Accept-Ranges": "bytes",
          "Cache-Control": cacheControl,
        });
        res.end();
        return;
      }

      res.writeHead(206, {
        "Content-Type": type,
        "Content-Length": end - start + 1,
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
        "Cache-Control": cacheControl,
      });
      if (req.method === "HEAD") {
        res.end();
        return;
      }

      fs.createReadStream(filePath, { start, end }).pipe(res);
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        send(res, error.code === "ENOENT" ? 404 : 500, "Not found");
        return;
      }

      res.writeHead(200, {
        "Content-Type": type,
        "Content-Length": stat.size,
        "Accept-Ranges": "bytes",
        "Cache-Control": cacheControl,
      });
      res.end(req.method === "HEAD" ? undefined : data);
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (!(await authorize(req, res, url))) return;

  if (url.pathname === "/api/images") {
    send(res, 200, JSON.stringify(listImages()), mimeTypes[".json"]);
    return;
  }

  serveStatic(req, res, url.pathname);
});

function listen(port) {
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && !process.env.PORT) {
      listen(port + 1);
      return;
    }

    throw error;
  });

  server.listen(port, () => {
    console.log(`PS preview running at http://localhost:${port}`);
    console.log(`Put images in: ${imagesDir}`);
  });
}

listen(preferredPort);
