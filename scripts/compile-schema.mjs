import Ajv from "ajv";
import standaloneCode from "ajv/dist/standalone/index.js";
import { build } from "esbuild";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const schema = JSON.parse(
  await readFile(
    new URL("../src/content/page.schema.json", import.meta.url),
    "utf8",
  ),
);
const ajv = new Ajv({ code: { source: true, esm: true }, allErrors: true });
const result = await build({
  stdin: {
    contents: standaloneCode(ajv, ajv.compile(schema)),
    resolveDir: fileURLToPath(new URL("../", import.meta.url)),
  },
  bundle: true,
  write: false,
  format: "esm",
  platform: "browser",
});
await writeFile(
  new URL("../src/content/compiled-validation.mjs", import.meta.url),
  result.outputFiles[0].text,
);

const {writeImageLibrary}=await import("./image-library.mjs");
await writeImageLibrary();

const {writeWorkDescriptors}=await import("./work-folders.mjs");
await writeWorkDescriptors();
