# CONTEXT.md

### 任务目标
修复 iPhone Safari 首页 PS 外壳内图片漏出问题，优化详情页无主播层时的分层间距和移动端滑动灵敏度，并保留 Cloudflare Pages 环境变量访问码。

### 当前状态
- 已完成：已将首页图片内容限制在 PS 画布区域内；已针对 iPhone Safari 使用 `visualViewport` 同步动态视口尺寸，并把内容顶部对齐到 SVG 真实画布起点 `y=60.68`；已新增 PS 画布外固定遮罩，强制盖住顶部、左右和 Safari 底部半透明工具栏背后的内容；根据用户复测截图，移动端底部遮罩增加固定最小高度，避免 Safari 未正确上报底栏遮挡时图片漏出；详情页已移除空的主播层，压紧贴片/UI 分层间距，并提高移动端滑动响应；已新增 Cloudflare Pages `functions/_middleware.js` 访问码中间件；已在本地 `server.js` 接入同样的访问码逻辑；已更新 README。
- 进行中：等待用户在 iPhone Safari 真机重新部署后复测首页溢出、详情页无主播层分层间距和移动端滑动灵敏度。
- 待开始：如移动端仍有边缘漏出，需要基于实际截图继续调高固定遮罩范围或改为单独画布裁剪容器。

### 已做决策
| 决策 | 理由 | 排除的方案及原因 |
|---|---|---|
| 使用 `ACCESS_KEY_ENABLED` 控制访问码开关 | Cloudflare Pages 环境变量可以直接被 Pages Functions 读取 | 纯前端 JS 校验会暴露访问码，无法真正保护资源 |
| `ACCESS_KEY` 未配置时默认 `1234` | 符合用户要求，部署时也能快速启用 | 强制必须配置会增加部署步骤 |
| 本地 `server.js` 同步接入访问码 | 方便部署前复现 Cloudflare Pages 行为 | 只写 Pages 中间件会导致本地无法测试 |
| 首页内容按 PS SVG 工具栏坐标裁剪 | 移动端图片漏出来自底图全屏铺放，未受 PS 外框限制 | 只调整 SVG 外壳无法遮住底层图片 |
| Cloudflare Pages 需使用 Git 或 Wrangler 部署访问码中间件 | 官方文档说明 Dashboard Direct Upload 不支持 Functions；直接上传静态资源时 `functions/_middleware.js` 不会运行 | 仅配置环境变量无法让未部署的 Functions 生效 |
| iPhone Safari 首页使用 `visualViewport` 而不是只依赖 `100vh` | Safari 底部地址栏会改变实际可见高度，`100vh` 容易把外壳算到浏览器工具栏背后 | 单纯增加 `overflow:hidden` 不能修正动态视口和 SVG viewBox 的错位 |
| 首页增加 PS 画布外固定遮罩，移动端底部保留固定最小高度 | iOS Safari 仍可能在透明/动态工具栏下露出 layout viewport 内容，且不稳定上报底栏遮挡高度；遮罩可以直接盖住非画布区域 | 继续只调坐标无法覆盖 Safari 半透明底栏背后的内容 |
| 详情页移除空主播层并压紧 3D 深度 | 当前素材没有主播层，沿用原有 5 层深度会让分层间距显得过大 | 保留空 host 层会持续占用视觉间距 |

### 待解决问题
- [ ] 问题1：需要用 iPhone Safari 复测首页顶部、左右边缘和底部地址栏遮挡状态下是否仍有图片漏出。
- [ ] 问题4：需要用手机复测详情页分层间距是否比原先紧凑，以及移动端滑动是否足够灵敏。
- [x] 问题2：Cloudflare Pages Production 环境变量截图显示已配置 `ACCESS_KEY_ENABLED=true` 和 `ACCESS_KEY=1234`；用户确认重新部署后访问码已生效。
- [x] 问题3：确认线上部署不是 Dashboard Direct Upload；用户使用 GitHub 仓库绑定 Cloudflare Pages，同步部署支持 Pages Functions。

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
- Cloudflare Pages Functions Middleware 文档：https://developers.cloudflare.com/pages/functions/middleware/
- Cloudflare Pages Functions Get started 文档：https://developers.cloudflare.com/pages/functions/get-started/
