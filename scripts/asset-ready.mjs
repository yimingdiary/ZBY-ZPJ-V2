// Vite 的 public 文件索引晚于磁盘写入更新；上传响应必须等同一路径已可读取。
export async function waitForAsset(host, src) {
  const url = new URL(encodeURI(src), `http://${host}`);
  const deadline = Date.now() + 5000;
  while (true) {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "error",
      signal: AbortSignal.timeout(1000),
    });
    if (
      response.ok &&
      response.headers.get("content-type")?.startsWith("image/")
    )
      return;
    if (response.status !== 404)
      throw Error(`图片服务尚未就绪（${response.status}）`);
    if (Date.now() >= deadline)
      throw Error("图片已写入，但开发服务器尚未完成素材登记，请重新选择图片");
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
}
