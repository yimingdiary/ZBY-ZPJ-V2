# ZBY-ZPJ

朱宝玉贴片作品集与直播间贴片 3D 分层预览项目。项目使用原生 HTML、CSS、JavaScript 和 Node.js 静态服务，不依赖构建工具。

## 项目功能

- 首页按顺序展示 `images/` 内的作品集长图。
- 首页同名多格式图片会优先加载 WebP/AVIF 等更轻格式，避免 JPG 和 WebP 重复显示。
- `ps-yemian.svg` 作为固定的 Photoshop 风格界面外壳覆盖在页面上，并接管滚轮、滚动条拖拽和热区点击。
- 首页图片流按 PS 内容显示区宽度排版，移动端触摸滑动使用浏览器原生文档滚动以保留 60fps 惯性和流畅度；PS 内容区外用固定遮挡层防止滚动图片漏出。
- `hotspots.json` 定义作品集图片中的可点击区域，热区可跳转到详情页。
- 热区悬停时读取 `preview-manifest.json`，在原位置叠加贴片素材预览。
- 触摸设备不创建首页热区悬浮预览，点击热区直接进入详情页。
- 详情页根据热区关联的 `preview/webp/` 子目录，渲染 1290 x 2791 的直播间贴片分层舞台。
- 详情页支持滚动触发 3D 视差展开、图层选区框显隐、桌面端背景横向拖动预览、animated WebP 和视频素材播放。

## 运行方式

需要本机已安装 Node.js。

```bash
node server.js
```

默认打开：

```text
http://localhost:4173
```

如果 `4173` 被占用且没有显式设置 `PORT`，服务会自动尝试下一个端口。也可以手动指定端口：

```bash
PORT=8127 node server.js
```

不要直接用 `file://` 打开 `index.html`。首页会通过 `/api/images` 或 `images-manifest.json` 获取图片列表，详情页会通过 `hotspots.json` 和 `preview-manifest.json` 获取配置。

## 访问码

项目支持类似分享码的访问保护。本地服务和 Cloudflare Pages Functions 使用同样的环境变量：

```text
ACCESS_KEY_ENABLED=false
ACCESS_KEY=1234
```

- `ACCESS_KEY_ENABLED=true`：开启访问码。
- `ACCESS_KEY_ENABLED=false`：关闭访问码。
- `ACCESS_KEY`：访问码，未配置时默认 `1234`。

本地测试开启访问码：

```bash
ACCESS_KEY_ENABLED=true ACCESS_KEY=1234 node server.js
```

Cloudflare Pages 部署时，在 Pages 项目的环境变量中配置 `ACCESS_KEY_ENABLED` 和 `ACCESS_KEY`。项目内的 `functions/_middleware.js` 会在边缘层拦截所有页面和资源请求；输入正确访问码后会写入 cookie，后续访问不需要重复输入。

如果线上仍然可以直接访问，优先检查：

- 是否发布到了 Production 环境，且变量配置在 Production 中。
- 配置变量后是否重新部署了最新版本。
- 是否使用 Cloudflare Dashboard 的 Direct Upload 上传静态文件；Direct Upload 不支持 Pages Functions，需要改用 Git 部署或 Wrangler 部署，才能让 `functions/_middleware.js` 生效。

## 移动端显示

首页 PS 外壳会根据浏览器可视视口动态调整。底层图片内容不直接铺满页面，而是放在与 SVG 画布镂空区域对齐的固定裁剪视窗里；滚动时只移动裁剪视窗内的图片流。这样图片只能在 PS 画布区域显示，顶部工具栏、左右面板和底部工具栏区域不会出现内容溢出。

## 常用维护命令

重新生成 `preview-manifest.json`：

```bash
node generate-preview-manifest.js
```

该脚本会扫描 `preview/webp/` 下每个子目录中的 `.webp` 和 `.mp4` 文件，并写入 `preview-manifest.json`。

## 目录结构

```text
.
├── AGENT.md                    # AI 协作约束
├── CONTEXT.md                  # 项目状态与任务记忆
├── README.md                   # 项目说明
├── server.js                   # 本地静态服务和 /api/images
├── index.html                  # 首页作品集与热区入口
├── detail.html                 # 贴片详情页结构
├── detail.css                  # 详情页 3D 舞台和图层样式
├── detail.js                   # 详情页素材解析、渲染和交互逻辑
├── functions/_middleware.js    # Cloudflare Pages 访问码中间件
├── generate-preview-manifest.js# 预览素材清单生成脚本
├── hotspots.json               # 首页图片热区配置
├── images-manifest.json        # 静态图片清单兜底
├── preview-manifest.json       # 预览素材清单
├── images/                     # 首页作品集图片
├── preview/
│   └── webp/                   # 每个贴片项目的 WebP 分层素材目录
└── assets/
    ├── icons/                  # logo、移动光标等 SVG
    └── overlays/               # 直播间 UI 覆盖图
```

## 运行逻辑

### 本地服务

`server.js` 基于 Node.js 内置 `http` 模块实现：

- 根目录静态资源服务，`/` 默认返回 `index.html`。
- `/api/images` 动态扫描 `images/` 目录，按同名文件去重并优先返回 AVIF、WebP、JPG/JPEG、PNG 等更适合网页加载的版本。
- 支持常见图片、视频、CSS、JS、JSON、HTML、SVG MIME 类型。
- 支持 Range 请求，便于详情页中的视频素材播放。
- 对请求路径做 `path.resolve` 校验，避免访问项目根目录外的文件。

### 首页

`index.html` 的主要流程：

1. 加载 `/hotspots.json` 和 `/preview-manifest.json`。
2. 优先请求 `/api/images` 获取图片列表，失败时回退到 `/images-manifest.json`。
3. 为每张图片创建 `.image-frame`，图片使用 `images/` 内 WebP 文件。
4. 根据 `hotspots.json` 为对应图片生成绝对定位热区。
5. 热区点击默认打开 `detail.html?id=...&preview=...&image=...`。
6. 热区悬停时，根据 `preview-manifest.json` 中的文件列表创建预览层。
7. 固定加载 `ps-yemian.svg` 作为 UI 外壳，并将 SVG 内滚轮、滚动条点击和拖动同步到页面滚动。
8. 使用 `visualViewport` 计算 PS 内容显示区的实际像素边界，并同步写入 `html` 和 `body` 的 CSS 变量；图片流按该宽度正常参与文档流滚动，不再用 JS 每帧移动长图。
9. 在触摸设备上让 SVG 外壳不接管触摸事件，避免 iPhone Safari 中手写 `touchmove` 滚动造成抖动、闪屏和惯性缺失；手机端禁用页面缩放，避免缩放时 `visualViewport` 连续变化导致黑屏。
10. 通过 `.ps-content-mask` 固定遮挡 PS 内容显示区外侧，遮挡层位于图片之上、SVG 外壳之下，不参与滚动、不接管触摸。

在触摸设备或无 hover 能力的设备上，首页不会创建和预热热区悬浮动态预览，点击热区会直接进入详情页。

热区调试可以在 URL 增加参数：

```text
http://localhost:4173/?debugHotspots
```

### 详情页

`detail.html` 提供固定的图层容器，`detail.js` 负责运行时填充素材：

1. 读取 URL 参数中的 `preview`、`directory` 或 `path`。如果没有直接传目录，则通过 `id` 和 `image` 到 `hotspots.json` 中查找。
2. 读取 `preview-manifest.json`，找到该预览目录的文件列表。
3. 识别 `背景.webp` 作为背景层。
4. 识别 `背景视频.mp4/webm/mov` 或其他视频文件作为背板层。
5. 按文件名识别四类主贴片：`顶部挂件-文`、`顶部挂件-背`、`底部挂件-文`、`底部挂件-背`。
6. 同名素材存在动态版本时，优先使用 `-动-loop.webp`，其次使用 `-动.webp`。
7. 其他未归类图片作为额外前景素材渲染。
8. `assets/overlays/douyin-ui.png` 存在时作为最上层直播间 UI 覆盖图，否则显示 CSS 占位控件。

详情页通过 CSS 变量驱动交互：

- `--scroll` 控制 3D 图层展开、旋转和选区框显隐。
- `--stage-scale` 根据窗口尺寸等比例缩放 1290 x 2791 舞台。
- `--bg-pan` 控制背景横向位置。
- `--pointer-*` 控制鼠标移动时的轻微位移和倾斜。

为降低移动端崩溃风险，详情页动画循环只在滚动、拖动、缩放或指针状态变化时运行；触摸设备会跳过大图透明像素 Canvas 扫描，改用图层元素盒子计算选区。详情页移动端禁用背景拖拽命中，并用触摸事件手动驱动内层滚动位置，同时把滚动位置限制在顶/底边界内侧，避免 iPhone Safari 把内层触底拉动误判为页面级弹性刷新。

详情页 3D 展开已按无主播层素材重新调整深度：背景视频、背景层、贴片背、贴片文和 UI 层按等距 Z 轴序列展开，并保留轻微初始 Z 偏移，避免 WebKit/微信内核在未滚动时把共面图层渲染成黑屏。移动端当前使用更紧凑的展开距离，减少图层过散和 iPhone Safari 3D 合成压力。用户真机复测发现 iPhone Safari 标签页栏在底部时更容易在滑到底继续滑动时触发重复刷新，把标签页栏改到顶部后不再复现。

详情页直接使用 `preview/webp/` 中的 WebP 分层素材，不再读取 `preview-optimized/` 或裁切映射。视频层会先使用背景图作为 poster，拿到可播放帧后再显示，避免加载期黑屏。舞台媒体不再统一加圆角和 paint containment，避免视频、侧贴和文字图层被圆角裁切。

## 配置说明

### `hotspots.json`

基础结构：

```json
{
  "baseSize": { "width": 1920, "height": 1080 },
  "detailPage": "detail.html",
  "debugHotspots": false,
  "images": [
    {
      "image": "ZBY_ZPJ_内页_05.webp",
      "areas": [
        {
          "id": "ZBY_ZPJ_005",
          "label": "动态贴片-毛孩子",
          "preview": "/preview/webp/260117_贴片_宠物生活_毛孩子",
          "x": 230.9638,
          "y": 289.9725,
          "width": 335.5798,
          "height": 724.9252
        }
      ]
    }
  ]
}
```

坐标以 `baseSize` 为基准。首页会转换为百分比定位，因此图片在不同屏幕宽度下仍能对齐。

### `preview/` 素材命名

推荐每个贴片目录使用以下命名：

```text
背景.webp
背景视频.mp4
顶部挂件-背.webp
顶部挂件-文.webp
顶部挂件-文-动.webp
顶部挂件-文-动-loop.webp
底部挂件-背.webp
底部挂件-文.webp
```

额外素材可以使用任意文件名，详情页会放入前景额外层。

新增或替换 `preview/webp/` 素材后，需要重新生成 `preview-manifest.json`。

## 添加新贴片

1. 在 `preview/webp/` 下新增一个目录，并放入 WebP 分层素材。
2. 运行 `node generate-preview-manifest.js` 更新 `preview-manifest.json`。
3. 在 `hotspots.json` 中为对应 `images/` 图片增加热区，`preview` 指向 `/preview/webp/...` 新目录。
4. 重启或刷新 `node server.js` 打开的页面检查效果。

## 注意事项

- 根目录 `README.md` 和 `CONTEXT.md` 需要随项目结构、技术栈、任务状态变化同步维护。
- `images-manifest.json` 是 `/api/images` 不可用时的静态兜底；如果部署到纯静态环境，需要手动维护或生成它。当前兜底清单已指向 `images/` 内 WebP 长图。
- 当前项目包含 `.ai` 源文件和大量媒体素材，提交或分发前应确认文件体积和版权范围。
