# CONTEXT.md

### 任务目标
修复 iPhone Safari 首页无法滑动、图片进入页面即超出 PS 内容显示区，以及滚动后图片露到 PS 框外的问题。

### 当前状态
- 已完成：已读取 `AGENT.md` 和 `CONTEXT.md`；定位到首页布局变量同时定义在 `html, body` 上，但 JS 只写入 `documentElement`，导致 `#app` 在移动端测试中继承 `body` 的默认值并变成全屏裁剪；已改为用 `visualViewport` 计算 PS 内容显示区实际像素边界，并同步写入 `html` 和 `body`；已将 `--content-scroll-y` 同步写入 `body`，让图片流滚动时真实向上移动；已给固定裁剪区增加 `contain`、`clip-path` 和 `-webkit-mask-image`，强化 iOS Safari 对 transform 子元素的裁剪；已在 SVG 覆盖层内增加 touch 滑动处理，拖动时手动同步 `window.scrollBy`；已更新 README。
- 进行中：等待用户在 iPhone Safari 真机重新部署后复测首页顶部对齐、边缘裁剪和触摸滑动。
- 待开始：如真机仍有边缘漏出，需要基于实际截图继续核对 PS SVG 真实内容框坐标。

### 已做决策
| 决策 | 理由 | 排除的方案及原因 |
|---|---|---|
| 使用 `ACCESS_KEY_ENABLED` 控制访问码开关 | Cloudflare Pages 环境变量可以直接被 Pages Functions 读取 | 纯前端 JS 校验会暴露访问码，无法真正保护资源 |
| `ACCESS_KEY` 未配置时默认 `1234` | 符合用户要求，部署时也能快速启用 | 强制必须配置会增加部署步骤 |
| 本地 `server.js` 同步接入访问码 | 方便部署前复现 Cloudflare Pages 行为 | 只写 Pages 中间件会导致本地无法测试 |
| 首页内容按 PS SVG 工具栏坐标裁剪 | 移动端图片漏出来自底图全屏铺放，未受 PS 外框限制 | 只调整 SVG 外壳无法遮住底层图片 |
| Cloudflare Pages 需使用 Git 或 Wrangler 部署访问码中间件 | 官方文档说明 Dashboard Direct Upload 不支持 Functions；直接上传静态资源时 `functions/_middleware.js` 不会运行 | 仅配置环境变量无法让未部署的 Functions 生效 |
| iPhone Safari 首页使用 `visualViewport` 而不是只依赖 `100vh` | Safari 底部地址栏会改变实际可见高度，`100vh` 容易把外壳算到浏览器工具栏背后 | 单纯增加 `overflow:hidden` 不能修正动态视口和 SVG viewBox 的错位 |
| 首页使用固定裁剪视窗承载图片流 | 用户明确要求底层图片只能在 PS 界面框中的镂空部分显示；裁剪视窗从内容结构上限制可见区域，不会出现额外黑框 | 用黑色遮罩盖住溢出会产生界面内黑框，不符合 PS 画布镂空裁剪语义 |
| 详情页移除空主播层并压紧 3D 深度 | 当前素材没有主播层，沿用原有 5 层深度会让分层间距显得过大 | 保留空 host 层会持续占用视觉间距 |
| 首页布局变量同时写入 `html` 和 `body` | CSS 变量原先在 `html, body` 选择器上都有定义，子元素实际继承 `body`；只写 `html` 会让移动端裁剪框和滚动变量失效 | 只删除 `body` 上变量风险较高，可能影响已有级联；双写更直接 |
| SVG 覆盖层内手动处理 touch 滑动 | `<object>` 覆盖在图片上方并接管 pointer，iPhone Safari 原生触摸不一定能传给页面滚动 | 关闭 SVG pointer-events 会破坏热区点击和自定义滚动条交互 |

### 待解决问题
- [ ] 问题1：需要用 iPhone Safari 真机复测首页顶部、左右边缘和底部地址栏遮挡状态下是否仍有图片漏出。
- [ ] 问题4：需要用手机复测详情页分层间距是否比原先紧凑，以及移动端滑动是否足够灵敏。
- [x] 问题5：本地移动端模拟验证 `#app` 裁剪框从全屏修正为 PS 内容区，并验证触摸上滑可驱动 `window.scrollY` 和图片流同步移动。
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
