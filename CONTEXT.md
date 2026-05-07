# CONTEXT.md

### 任务目标
修复手机端首页滑动掉帧和缩放黑屏，并压紧详情页无主播层时的贴片/背景分层间距。

### 当前状态
- 已完成：已读取 `AGENT.md` 和 `CONTEXT.md`；根据用户反馈继续定位首页卡顿根因：上一版虽然恢复原生触摸，但仍保留 fixed 裁剪窗口，并在滚动时用 JS/`top` 每帧移动整条长图，手机端会触发大面积布局与重绘，表现为约 30fps 掉帧；已改为正常文档流滚动，`#app` 不再 fixed，图片流按 PS 内容区宽度和左边距排版，滚动完全交给浏览器原生文档滚动；已删除滚动时同步 `--content-scroll-y` 的逻辑，并在触摸设备上不再每帧更新 SVG 自定义滚动条；已禁用手机端页面缩放，避免缩小时 `visualViewport` 连续变化引发黑屏；详情页已把背景层、贴片背景层、贴片前景层、UI 层的 Z 深度和 XY 偏移整体压紧，并恢复详情页滚动容器的 iOS 惯性滚动；本地移动端模拟验证首页触摸上滑正常滚动，详情页实际 URL 加载后图层 transform 深度已从原先数百像素空档压缩到较小范围；已更新 README。
- 进行中：等待用户在 iPhone Safari 真机重新部署后复测首页滑动帧率、缩放黑屏是否消失，以及详情页上下贴片与背景图间距是否明显压紧。
- 待开始：如详情页仍显得间距过大，可进一步把 3D 展开深度降到近似 2.5D 或在移动端单独禁用大角度 3D 分离。

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

### 待解决问题
- [ ] 问题1：需要用 iPhone Safari 真机复测首页顶部、左右边缘和底部地址栏遮挡状态下是否仍有图片漏出。
- [ ] 问题4：需要用手机复测详情页分层间距是否比原先紧凑，以及移动端滑动是否足够灵敏。
- [ ] 问题7：需要用 iPhone Safari 真机复测首页是否恢复接近 60fps 原生滚动，以及缩放黑屏是否消失。
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
