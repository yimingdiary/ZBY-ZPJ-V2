# CONTEXT.md

### 任务目标
修复 iPhone Safari 首页 PS 外壳内图片漏出问题，并增加 Cloudflare Pages 环境变量控制的访问码。

### 当前状态
- 已完成：已将首页图片内容限制在 PS 画布区域内，避免移动端从工具栏/外框处漏出；已新增 Cloudflare Pages `functions/_middleware.js` 访问码中间件；已在本地 `server.js` 接入同样的访问码逻辑；已更新 README。
- 进行中：等待手机端真机验证 PS 外壳裁剪效果。
- 待开始：如移动端仍有边缘漏出，需要基于实际截图微调 PS 内容区域坐标。

### 已做决策
| 决策 | 理由 | 排除的方案及原因 |
|---|---|---|
| 使用 `ACCESS_KEY_ENABLED` 控制访问码开关 | Cloudflare Pages 环境变量可以直接被 Pages Functions 读取 | 纯前端 JS 校验会暴露访问码，无法真正保护资源 |
| `ACCESS_KEY` 未配置时默认 `1234` | 符合用户要求，部署时也能快速启用 | 强制必须配置会增加部署步骤 |
| 本地 `server.js` 同步接入访问码 | 方便部署前复现 Cloudflare Pages 行为 | 只写 Pages 中间件会导致本地无法测试 |
| 首页内容按 PS SVG 工具栏坐标裁剪 | 移动端图片漏出来自底图全屏铺放，未受 PS 外框限制 | 只调整 SVG 外壳无法遮住底层图片 |

### 待解决问题
- [ ] 问题1：需要用 iPhone Safari 复测首页顶部和左右边缘是否仍有图片漏出。
- [ ] 问题2：Cloudflare Pages 生产环境需要配置 `ACCESS_KEY_ENABLED=true` 和需要的 `ACCESS_KEY`。

### 关键约束
- 必须遵守根目录 `AGENT.md`：项目结构、技术栈、状态或任务进度变化时，同步维护 `README.md` 和 `CONTEXT.md`。
- 访问码应在请求层拦截，不能只做前端提示。
- 默认访问码为 `1234`，开关关闭时不能影响公开访问。

### 参考资料
- `AGENT.md`
- `server.js`
- `index.html`
- `detail.html`
- `detail.js`
- `detail.css`
- `hotspots.json`
- `preview-manifest.json`
- `images-manifest.json`
- `yulan-README.md`
