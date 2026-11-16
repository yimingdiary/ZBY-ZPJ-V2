# 作品集 V3 · Cloudflare R2 独立版本

基于当前 V2 内容建立的独立版本，保留 Astro、React、中文 Puck 装修、作品集首页、贴片详情和抖音店铺。目录为 `/Users/yiming/yiming/App/ZPJ/v3`，分支为 `codex/v3-r2`，开发端口为 `4323`。

云端草稿、发布配置和素材使用现有 R2 桶 `portfolio` 的 `v3/` 前缀，不读写 `DY-Page/`，不使用 D1，也不依赖 GitHub 内容 API。公开页面读取已发布内容并由 React 渲染，发布不再触发整站构建。需要 JavaScript 才能显示公开页面。

```
npm ci
npm run dev
npm run build
npm test
```

本地首页 http://127.0.0.1:4323/，后台 http://127.0.0.1:4323/admin。本地保存仅修改当前 V3 文件。`public/` 是独立源素材，`dist/` 为自动生成的构建产物。

首次准备浏览器测试：`PLAYWRIGHT_BROWSERS_PATH=.cache/ms-playwright npx playwright install chromium`。

[部署与 R2 初始化](docs/DEPLOYMENT.md)说明绑定、密钥、上传与正式验收流程。[项目结构规范](docs/PROJECT-RULES.md)和[设计变量](docs/DESIGN-TOKENS.md)延续 V2 的模块边界；其中存储和发布流程以 V3 部署文档为准。`AGENT.md` 为当前开发规则，`CONTEXT.md` 记录真实验证状态，`PROGRESS.md` 为 V3 独立验收快照，本地通过不表示正式站已上线。
