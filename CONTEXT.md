### 任务目标
建立与 V2 互不干扰的独立 V3 分支及本地目录，使用现有 Cloudflare R2 桶 portfolio 的 v3/ 前缀保存内容和素材。

### 当前状态
- 2026-11-16 用户要求全部推送：本版本将独立提交至 origin/codex/v3-r2，V2 的现有修改另行推送 main；不合并两个版本。已检查凭证模式和忽略目录，源码、独立配置及原始素材纳入提交，依赖、缓存、dist 和真实凭证排除。
- 已完成：独立 worktree `/Users/yiming/yiming/App/ZPJ/v3`、分支 `codex/v3-r2`，从 V2 当前 HEAD 及用户现有未提交草稿／素材复制开始。V2 保持 main，未改动其业务文件和原有未提交修改。两个 worktree 仅共用 Git 管理元数据，源码、依赖、内容、素材、dist 和缓存独立。
- 已完成：本地使用端口 4323；本地开发仍只读写 V3 的 content/ 与 public/。后台 Cookie 名 `portfolio_v3_session` 与 V2 分开。
- 已完成：Worker 改用 R2，公开 `/api/published` 只读发布内容，后台鉴权后读取／保存草稿、发布和上传图片。写入固定 v3/，不依赖 GitHub Contents API，不使用 D1。图片保持站内 URL 与原名，按内容哈希及店铺项目隔离；支持条件缓存和 Range。
- 已完成：首页与通用店铺页面实时读取 R2 发布 JSON，由公开 React 展示组件渲染。公开端不加载 Puck；Puck 仍用于后台。新增店铺 slug 发布后无需重新构建，现有贴片目录与组件代码变更仍需构建。
- 已完成：2026-11-16 使用本机既有 Wrangler 登录，确认 portfolio/v3/ 原先为空后初始化 302 个对象（300 个 public 素材／索引与两个内容 JSON）。只执行 v3/ 下 PUT，无删除。随后按列表核对全部键与数量；远端草稿、发布 JSON 与 V2 原始内容及中文共享页头图片逐字节哈希一致；DY-Page 已有对象抽样 etag 不变。
- 已验证：`npm run build` 类型检查与构建通过；`npm test` 全部 44 项通过，包含桌面／手机、公开店铺与装修、贴片动画、上传、保存恢复、PS 滚动、R2 路径隔离和鉴权。已查看手机截图。`npm run test:r2-runtime` 使用编译产物在真实 workerd + 本地 R2 中验证公开读取、登录、草稿隔离、Range 和动态店铺路由。
- 已完成：独立 wrangler.jsonc、S3 上传计划／初始化脚本、运行时验证脚本与部署文档。本次用户明确要求推送后，PROGRESS.md 已改为 V3 独立验收快照。
- 待开始：独立 V3 Pages 项目部署、正式鉴权 Secret 配置与正式站端到端验收。本轮提交推送不包含正式部署，不能将 R2 数据初始化记作网站已上线。

### 已做决策
| 决策 | 理由 | 排除的方案及原因 |
|---|---|---|
| V3 使用独立 worktree 与 codex/v3-r2 分支 | 保留 V2 用户草稿及素材，独立编辑和构建 | 在 V2 原目录直接切分支会干扰当前工作区 |
| R2 绑定 portfolio，固定 v3/ 前缀 | 用户明确要求与 DY-Page/ 并存 | 不创建替代桶，不读写其他前缀，不做删除式同步 |
| 内容与素材均存 R2，不使用 D1 | JSON 页面文档无需关系数据库 | 不额外引入数据库和表；未来如需 D1 必须使用 portfolio 与独立表前缀 |
| 发布直接写 R2，公开页在浏览器读取最新内容 | 避免每次发布都提交 GitHub 并重新构建 | 不将旧构建 JSON 作为 R2 失败时的备用内容 |
| 公开 React 渲染与装修分离 | 复用真实展示组件，公开端不打包 Puck 编辑器 | 不重复初始化组件已具备的交互监听 |

### 待解决问题
- [ ] 创建／部署独立 zby-portfolio-v3 Pages 项目，配置 PORTFOLIO 绑定、独立 ADMIN_PASSWORD_HASH、SESSION_SECRET 和 ALLOWED_ORIGIN；完成正式登录、保存、发布、图片上传与手机验收。
- [ ] 当前公开首页／店铺依赖 JavaScript，禁用时明确提示；尚未提供服务端 R2 动态渲染。
- [ ] 线上完整作品目录导入仍未实现；普通图片可上传，完整贴片目录继续从本地导入后同步素材与构建代码。
- [ ] R2 多管理员写入使用最后一次成功保存，无自动合并、发布历史或自动回退。

### 关键约束
- 禁止修改其他版本的文件或 portfolio 桶内 DY-Page/ 等其他前缀。
- 不在源码、日志、Git 或聊天中记录真实凭证；正式 Cookie 与密钥独立。
- 本地编辑与远端 R2 不自动双向同步；素材上传默认不覆盖线上草稿或发布 JSON，首次初始化条件写入拒绝覆盖已有内容。
- 内容测试串行执行并恢复原文件，不与远端同步同时执行；本次远端内容初始化完成后已核对与源内容一致。

### 参考资料
- 用户确认：portfolio 是现有 R2 桶名，v3/ 为新文件夹，与 DY-Page/ 并列；本地也需独立 v3 目录。
- docs/DEPLOYMENT.md、wrangler.jsonc、scripts/upload-r2.mjs、scripts/verify-r2-runtime.mjs。
- https://developers.cloudflare.com/r2/api/workers/workers-api-reference/
- https://developers.cloudflare.com/r2/objects/upload-objects/
- 本地验收报告 `.cache/r2-initialized.json`、`.cache/r2-verified.json`（忽略上传）。
