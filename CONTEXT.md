# CONTEXT.md

### 任务目标
在保留手机端首页原生丝滑滚动的前提下，修复滑动时图片露到 PS 界面外的问题。

### 当前状态
- 已完成：已读取 `AGENT.md` 和 `CONTEXT.md`；根据用户最新反馈确认首页原生文档流滚动已经丝滑，但因为不再使用 fixed 裁剪窗口，图片在滑动时会从 PS 内容显示区外侧露出；已新增四块 `.ps-content-mask` 固定遮挡层，按 `visualViewport` 和 PS 内容区变量覆盖内容区外的上、左、右、下区域；遮挡层层级位于图片之上、`ps-yemian.svg` 外壳之下，并设置 `pointer-events:none`，不参与滚动、不接管触摸，因此保留原生丝滑滚动；本地移动端滚动截图验证遮挡层位置正确，滚动后内容区外侧不再直接显示图片；已更新 README。
- 进行中：等待用户在 iPhone Safari 真机重新部署后复测首页滑动时 PS 界面外是否仍有图片漏出。
- 待开始：如真机仍有局部漏出，需要依据截图微调 PS 内容区坐标或遮挡层颜色。

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
| 触摸设备禁用 SVG 覆盖层指针事件，恢复原生滚动 | iPhone Safari 对 fixed + object + 手写 touchmove 滚动容易抖动并失去惯性；移动端没有 hover 预览需求，热区本身在图片层内仍可点击 | 继续手写 touchmove 虽能滚动，但用户复测出现严重闪屏和不丝滑 |
| 移除首页 fixed 裁剪层上的 `-webkit-mask-image`、`clip-path` 和 transform | 这些属性叠加滚动位移会增加 Safari 合成层闪烁风险；变量继承问题修复后，仅 `overflow:hidden` 已能裁剪 | 保留 mask 作为兜底会继续带来闪屏风险 |
| 首页改为正常文档流滚动，不再 fixed 裁剪窗口内每帧移动长图 | 手机端滚动长图时更新 `top` 会触发布局和大面积重绘，是掉帧主因；正常文档流滚动由浏览器 compositor 优化 | 继续用 fixed 裁剪窗口即使不 transform，也仍然需要 JS 同步滚动位置 |
| 手机端禁用页面缩放 | 用户反馈缩小画面会卡出黑屏，缩放会导致 `visualViewport` 和 SVG viewBox 连续变化，触发重排和黑屏风险 | 保留 pinch 缩放会继续让 iOS Safari 在视觉视口变化时反复重算 PS 外壳 |
| 详情页无主播层时压紧 3D 深度 | 当前素材没有主播层，背景和贴片之间不应保留主播层时代的数百像素深度空档 | 只隐藏主播层但保留原始 Z 深度会继续造成上下贴片背景与背景图间距过大 |
| 使用固定遮挡层覆盖首页 PS 内容区外侧 | 正常文档流滚动最丝滑，但没有 fixed 裁剪窗口；固定遮挡层可以阻止图片露出且不需要每帧 JS 更新 | 回到 fixed 裁剪窗口会重新引入掉帧；用 mask/clip-path 又有 iOS Safari 合成闪屏风险 |

### 待解决问题
- [ ] 问题1：需要用 iPhone Safari 真机复测首页顶部、左右边缘和底部地址栏遮挡状态下是否仍有图片漏出。
- [ ] 问题4：需要用手机复测详情页分层间距是否比原先紧凑，以及移动端滑动是否足够灵敏。
- [ ] 问题7：需要用 iPhone Safari 真机复测首页是否恢复接近 60fps 原生滚动，以及缩放黑屏是否消失。
- [ ] 问题8：需要用 iPhone Safari 真机复测新增固定遮挡层后，滑动时图片是否仍会露到 PS 界面外。
- [x] 问题5：本地移动端模拟验证 `#app` 裁剪框从全屏修正为 PS 内容区，并验证触摸上滑可驱动 `window.scrollY` 和图片流同步移动。
- [x] 问题6：本地移动端模拟确认触摸设备上 SVG 覆盖层不再接管触摸，触摸上滑使用原生滚动；初始顶部深色条来自 SVG 顶部工具栏区域。
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
