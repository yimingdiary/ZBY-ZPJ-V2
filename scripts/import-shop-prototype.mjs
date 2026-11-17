import { cp, readFile, writeFile, mkdir } from "node:fs/promises";
const source = new URL("../public/CROCS店铺UI原型/dist/", import.meta.url);
const target = new URL("../public/shop-ui/", import.meta.url);
await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true });
const original = await readFile(new URL("index.html", source), "utf8");
let html = original
  .replace(/(["'])assets\//g, "$1/shop-ui/assets/")
  .replace(
    /href="(style\.css|header-motion\.css|source-style\.css|ios-refinement\.css)"/g,
    'href="/shop-ui/$1"',
  )
  .replace(
    /src="(source-contract\.js|app\.js|ios-interactions\.js)"/g,
    'src="/shop-ui/$1"',
  );
// The original header, product columns and document structure stay intact.
const start = html.indexOf(">", html.indexOf('<section id="panel-brand"')) + 1;
const end = html.indexOf("</section>", start);
html = html.slice(0, start) + "<!--V2_BRAND_CONTENT-->" + html.slice(end);
html = html.replace(/<button class="floating-live"[\s\S]*?<\/button>/, "");
html = html.replace(
  /<div class="overlay"[\s\S]*?<script src="\/shop-ui\/source-contract.js"><\/script>/,
  '<script src="/shop-ui/source-contract.js"></script>',
);
// The prototype CSP is document-specific; Astro injects its own dev/module code.
html = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/, "");
await writeFile(
  new URL("../src/modules/DouyinShop/prototype.html", import.meta.url),
  html,
);
let app = await readFile(new URL("app.js", source), "utf8");
const prefix = app.slice(0, app.indexOf("const overlay="));
const products = app
  .slice(app.indexOf("function card("), app.indexOf("const realSlides="))
  .replace(
    "$('#featured').innerHTML=products.slice(0,6).map(card).join('');",
    "",
  );
const clickLine = app
  .split("\n")
  .find((line) => line.startsWith("document.addEventListener('click'"));
const click = clickLine
  .replace("if(b.hasAttribute('data-close'))return closeSheet();", "")
  .replace("if(b.dataset.product)return productDetail(+b.dataset.product);", "")
  .replace(
    "if(b.dataset.action)return actions[b.dataset.action]?.();",
    "if(b.dataset.action==='back'){if(activeTab!=='brand')return setTab('brand');window.scrollTo({top:0,behavior:'smooth'});return;}",
  )
  .replace("if(b.dataset.query)return doSearch(b.dataset.query);", "")
  .replace(/if\(b\.dataset\.size\)\{[\s\S]*?;return\}/, "")
  .replace(/if\(b\.dataset\.filter\)\{[\s\S]*?;return\}/, "");
const keyboard = app.slice(
  app.indexOf("if(e.target.matches('[role=tab]')"),
  app.indexOf("const root="),
);
const scroll = app.slice(app.indexOf("const root=$('#store')"));
app =
  prefix +
  products +
  click +
  "\n" +
  "document.addEventListener('keydown',e=>{" +
  keyboard +
  "\n" +
  scroll;
app = app.replaceAll('src="assets/', 'src="/shop-ui/assets/');
await writeFile(new URL("app.js", target), app);
let ios = await readFile(new URL("ios-interactions.js", source), "utf8");
ios = ios
  .replace("||!overlay.hidden", "")
  .replace(
    "e.target.closest('#carousel')",
    "e.target.closest('.carousel,.tab-carousel,.flip-grid,.hotspot')",
  );
await writeFile(new URL("ios-interactions.js", target), ios);
console.log(
  "Copied original prototype. Only brand content, popup handlers, floating live and brand gesture exclusion adapted.",
);
