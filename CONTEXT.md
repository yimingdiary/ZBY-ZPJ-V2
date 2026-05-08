# CONTEXT.md

### 任务目标
继续修复详情页 iPhone Safari 滑到底重复刷新/重载、微信初始黑屏、图层间距不统一和 MP4 黑屏问题。

### 当前状态
- 已完成：已按要求读取 `AGENT.md` 和 `CONTEXT.md`；用户复测反馈 iPhone Safari 滑到底仍会触发重新刷新/重载，微信内打开不刷新但详情页初始为黑屏、滑动展开后才逐渐正常，且图层距离不统一、背景与背景视频过近、底贴背景与总背景过远、视频黑屏；已把详情页移动端边界处理升级为触摸开始时从精确顶/底边界内缩 1px，并保持 `touchmove` 边界拦截和 `body` fixed，进一步阻止 Safari 页面级弹性刷新；已把 3D Z 轴改为等距序列：背景视频 -720、总背景 -360、贴片背 0、贴片文 360、UI 720，并加大横向/纵向展开距离；已给每层保留轻微初始 Z 偏移，避免 WebKit/微信内核初始共面渲染黑屏；已取消视频层黑色底色，改为透明并仅在 `loadeddata/canplay/playing` 后显示，同时设置背景图 poster 和触摸后重试播放；本地 Playwright 移动端验证初始页不黑屏，展开后层距统一，视频 `readyState=4` 且播放中；已更新 README。
- 进行中：等待用户在 iPhone Safari 和微信真机重新部署后复测详情页滑到底是否还会刷新/重载、微信初始是否还黑屏、视频是否显示并播放。
- 待开始：如 Safari 仍因 GPU/视频 3D 合成重载，需要在触摸设备上进一步降低旋转角度，或把视频层改为静态 poster/非 3D 分离兜底。

### 已做决策
| 决策 | 理由 | 排除的方案及原因 |
|---|---|---|
| 使用 `ACCESS_KEY_ENABLED` 控制访问码开关 | Cloudflare Pages 环境变量可以直接被 Pages Functions 读取 | 纯前端 JS 校验会暴露访问码，无法真正保护资源 |
| `ACCESS_KEY` 未配置时默认 `1234` | 符合用户要求，部署时也能快速启用 | 强制必须配置会增加部署步骤 |
| 本地 `server.js` 同步接入访问码 | 方便部署前复现 Cloudflare Pages 行为 | 只写 Pages 中间件会导致本地无法测试 |
| Cloudflare Pages 需使用 Git 或 Wrangler 部署访问码中间件 | 官方文档说明 Dashboard Direct Upload 不支持 Functions；直接上传静态资源时 `functions/_middleware.js` 不会运行 | 仅配置环境变量无法让未部署的 Functions 生效 |
| 首页布局变量同时写入 `html` 和 `body` | CSS 变量原先在 `html, body` 选择器上都有定义，子元素实际继承 `body`；只写 `html` 会让移动端裁剪框和滚动变量失效 | 只删除 `body` 上变量风险较高，可能影响已有级联；双写更直接 |
| 触摸设备禁用 SVG 覆盖层指针事件，恢复原生滚动 | iPhone Safari 对 fixed + object + 手写 touchmove 滚动容易抖动并失去惯性；移动端没有 hover 预览需求，热区本身在图片层内仍可点击 | 继续手写 touchmove 虽能滚动，但用户复测出现严重闪屏和不丝滑 |
| 首页改为正常文档流滚动，不再 fixed 裁剪窗口内每帧移动长图 | 手机端滚动长图时更新 `top` 会触发布局和大面积重绘，是掉帧主因；正常文档流滚动由浏览器 compositor 优化 | 继续用 fixed 裁剪窗口即使不 transform，也仍然需要 JS 同步滚动位置 |
| 使用固定遮挡层覆盖首页 PS 内容区外侧 | 正常文档流滚动最丝滑，但没有 fixed 裁剪窗口；固定遮挡层可以阻止图片露出且不需要每帧 JS 更新 | 回到 fixed 裁剪窗口会重新引入掉帧；用 mask/clip-path 又有 iOS Safari 合成闪屏风险 |
| 详情页移动端禁用背景拖拽并拦截滚动边界 | 用户反馈 iPhone Safari 详情页滑到底继续上滑会误触刷新/崩溃重复加载；内层滚动到边界后必须阻止事件继续交给页面级弹性刷新 | 完全禁用详情页触摸滚动会牺牲核心分层预览；只依赖 `overscroll-behavior` 对 iOS Safari 不够稳定 |
| 详情页改用 `100dvh` 辅助动态视口 | iPhone Safari 地址栏变化会让 `100vh` 和实际可见区域错位，增加边界拉动和重排风险 | 只监听 `resize` 不能覆盖所有地址栏折叠过程 |
| 详情页重新拉开 3D 图层间距 | 用户反馈图层间距太近、像被压扁；增加 Z 深度和横向错位可以让分层关系更清楚 | 回到主播层时代的大间距会再次显得过散，因此只做中等幅度增加 |
| MP4 使用优化 H.264 fast-start 版本 | 原视频为 HEVC 且非 streamable，网页解码和 3D 合成更容易出现乱码或初始帧异常；优化版本在浏览器验证中可加载播放 | 直接覆盖原始素材会丢失源文件；只改 CSS 无法解决浏览器拿不到可稳定解码视频的问题 |
| 详情页改用等距 Z 轴分层 | 用户反馈不同层之间距离不统一；等距序列能保证背景视频、总背景、贴片背、贴片文和 UI 的视觉间隔一致 | 继续逐层手调容易让某两层过近、另两层过远 |
| 图层保留轻微初始 Z 偏移 | 微信内核初始黑屏、滚动后恢复，符合 WebKit 对共面 3D 图层初始合成不稳定的表现 | 等用户滚动后再修正会继续产生黑屏首屏 |
| 视频层拿到可播放帧后再显示 | 用户反馈视频黑屏；去掉黑色底色并等待 `loadeddata/canplay/playing` 可避免加载期或自动播放失败时露出黑色视频面 | 一直显示 video 元素会在 Safari/微信里把未解码视频渲染成黑块 |

### 待解决问题
- [ ] 问题1：需要用 iPhone Safari 真机复测首页顶部、左右边缘和底部地址栏遮挡状态下是否仍有图片漏出。
- [ ] 问题4：需要用手机复测详情页等距分层是否符合预期，以及移动端滑到底继续滑动是否不再重复加载。
- [ ] 问题7：需要用 iPhone Safari 真机复测首页是否恢复接近 60fps 原生滚动，以及缩放黑屏是否消失。
- [ ] 问题8：需要用 iPhone Safari 真机复测新增固定遮挡层后，滑动时图片是否仍会露到 PS 界面外。
- [ ] 问题9：需要用 iPhone Safari 真机复测 `260117_贴片_宠物生活_毛孩子` 的 MP4 是否还会出现乱码。
- [ ] 问题11：需要用微信真机复测详情页初始打开是否不再黑屏，视频是否能在触摸后播放。
- [x] 问题5：本地移动端模拟验证 `#app` 裁剪框从全屏修正为 PS 内容区，并验证触摸上滑可驱动 `window.scrollY` 和图片流同步移动。
- [x] 问题6：本地移动端模拟确认触摸设备上 SVG 覆盖层不再接管触摸，触摸上滑使用原生滚动；初始顶部深色条来自 SVG 顶部工具栏区域。
- [x] 问题2：Cloudflare Pages Production 环境变量截图显示已配置 `ACCESS_KEY_ENABLED=true` 和 `ACCESS_KEY=1234`；用户确认重新部署后访问码已生效。
- [x] 问题3：确认线上部署不是 Dashboard Direct Upload；用户使用 GitHub 仓库绑定 Cloudflare Pages，同步部署支持 Pages Functions。
- [x] 问题10：本地 Playwright 移动端验证详情页无 JS 错误，反复滑到底后主框架加载次数保持 1 次；优化 MP4 `readyState=4` 且处于播放状态。
- [x] 问题12：本地 Playwright 移动端验证详情页初始截图不黑屏，展开截图中背景视频、总背景、贴片背、贴片文/UI 分层距离更统一。

### 关键约束
- 必须遵守根目录 `AGENT.md`：项目结构、技术栈、状态或任务进度变化时，同步维护 `README.md` 和 `CONTEXT.md`。
- 访问码应在请求层拦截，不能只做前端提示。
- 默认访问码为 `1234`，开关关闭时不能影响公开访问。
- 详情页移动端优先保证 iPhone Safari 不误触刷新、不重复加载，再保留尽可能完整的 3D 分层效果。

### 参考资料
- `AGENT.md`
- `server.js`
- `index.html`
- `detail.html`
- `detail.js`
- `detail.css`
- `hotspots.json`
- `preview-manifest.json`
- `preview-optimized-manifest.json`
- `images-manifest.json`
- `README.md`
- `yulan-README.md`
