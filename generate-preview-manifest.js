const fs = require("fs");
const path = require("path");

const previewDir = path.join(__dirname, "preview");
const outputFile = path.join(__dirname, "preview-manifest.json");
const mediaExtensions = new Set([".gif", ".jpeg", ".jpg", ".mp4", ".png", ".webp"]);

const manifest = {};

if (fs.existsSync(previewDir)) {
  fs.readdirSync(previewDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .forEach((entry) => {
      const directory = path.join(previewDir, entry.name);
      const manifestKey = `/preview/${entry.name}`;

      manifest[manifestKey] = fs
        .readdirSync(directory, { withFileTypes: true })
        .filter((file) => file.isFile())
        .map((file) => file.name)
        .filter((name) => mediaExtensions.has(path.extname(name).toLowerCase()))
        .sort((a, b) => a.localeCompare(b, "zh-CN", { numeric: true }));
    });
}

fs.writeFileSync(outputFile, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${path.relative(__dirname, outputFile)}`);
