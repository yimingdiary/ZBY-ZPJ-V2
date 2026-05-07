# CONTEXT.md

### 任务目标
修复 iPhone Safari 首页图片裁剪后出现的滑动闪屏、抖动、不丝滑，以及确认顶部黑条来源。

### 当前状态
- 已完成：已读取 `AGENT.md` 和 `CONTEXT.md`；根据用户反馈定位到上次修复中的高风险点：移动端手写 `touchmove -> window.scrollBy` 会丢失 iOS 原生惯性并触发布局抖动，`-webkit-mask-image/clip-path/transform` 叠在 fixed 裁剪层上也容易造成 Safari 合成闪屏；已移除这些合成裁剪属性，改回轻量 `overflow:hidden`；移动端让 `ps-yemian.svg` 覆盖层不再接管触摸事件，触摸直接落到图片/热区层并使用浏览器原生滚动；图片流改用 absolute `top` 位移，减少 transform 合成闪烁；滚动同步改为 `requestAnimationFrame` 节流；触摸滑动期间延迟 `visualViewport.resize` 布局重算，避免 iOS 地址栏动画时连续重排；已将图片裁剪区顶部改为 `0`，让展示图片和 SVG 顶部对齐；本地移动端模拟验证原生上滑可滚动且图片流同步移动；已确认顶部深色条主要来自 `ps-yemian.svg` 顶部 PS 工具栏，不是图片裁剪外漏；已更新 README。
- 进行中：等待用户在 iPhone Safari 真机重新部署后复测首页滑动流畅度、闪屏和顶部深色条观感。
- 待开始：如用户不希望显示 SVG 顶部 PS 工具栏深色条，需要进一步调整或裁切 `ps-yemian.svg` 顶部界面元素。

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

### 待解决问题
- [ ] 问题1：需要用 iPhone Safari 真机复测首页顶部、左右边缘和底部地址栏遮挡状态下是否仍有图片漏出。
- [ ] 问题4：需要用手机复测详情页分层间距是否比原先紧凑，以及移动端滑动是否足够灵敏。
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
