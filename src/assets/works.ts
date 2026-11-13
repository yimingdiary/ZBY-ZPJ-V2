import catalog from "../../public/images/works/catalog.json";
export type Work = {
  id: string;
  cover: string;
  aliases: string[];
  name: string;
  canvas: { width: number; height: number };
  canAnimate: boolean;
  folderName: string;
};
export const works: Work[] = Object.entries(catalog).map(([id, work]) => ({
  id,
  ...work,
}));
export function workForImage(src: string) {
  return works.find((w) => w.cover === src || w.aliases.includes(src));
}
/** public 与 dist 均是站点根目录映射，不依赖用户名、磁盘或父文件夹名称。 */
export function siteImagePath(input: string) {
  let value = decodeURIComponent(input.trim()).replace(/\\/g, "/");
  const marker = value.match(/\/(?:public|dist)\/(images\/.*)$/);
  if (marker) value = "/" + marker[1];
  if (
    !value.startsWith("/images/") ||
    value.split("/").some((part) => part === "." || part === "..")
  )
    throw new Error("请选择项目图片，或提供 public／dist 下的图片路径");
  return workForImage(value)?.cover || value;
}

export function registerWork(work: Work) {
  const i = works.findIndex((w) => w.id === work.id);
  if (i < 0) works.push(work);
  else works[i] = work;
}
