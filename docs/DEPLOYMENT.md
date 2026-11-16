# V3 本地运行与 Cloudflare 部署

本地根目录 `/Users/yiming/yiming/App/ZPJ/v3`，Git 分支 `codex/v3-r2`。与 `v2.0` 的源码、依赖、内容和构建产物相互独立，不共用可写目录。

## 本地开发

```
npm ci
npm run dev
```

首页 http://127.0.0.1:4323/，后台 http://127.0.0.1:4323/admin。本地模式只读写当前目录的 `content/` 和 `public/`，不写入远端 R2。`npm run build` 完成类型检查、Astro 构建和 Pages Advanced mode Worker 打包。`npm run preview` 不运行 API，请使用开发服务或 `npm run cf:dev` 测试 API。

## R2 数据布局

只使用已存在的桶 `portfolio`，绑定名称 `PORTFOLIO`。所有对象固定写入 `v3/`，Worker 不接受客户端提供桶名或前缀。没有 D1，无需创建数据库或数据表。绝不能将桶根目录作为同步目标，禁止使用删除式同步。

```
portfolio（现有 R2 桶）
├── DY-Page/                 # 其他项目，保持原样
└── v3/
    ├── content/draft/home.json
    ├── content/published/home.json
    ├── images/             # 保留 public/images 内的原名称和项目结构
    ├── fonts/
    ├── decorations/
    ├── overlay/
    ├── image-library.json
    └── shop-image-library.json
```

站内素材 URL 仍为 `/images/...` 等，由 Worker 映射到 `v3/images/...`，桶无需公开。缺失对象返回错误，不回退到 V2 或 DY-Page 的数据。公开页通过 `/api/published` 读取已发布 JSON，用现有 React 展示组件渲染，需要 JavaScript；后台继续使用 Puck。保存草稿只写 `draft`，发布直接更新 `published`，刷新公开页生效，无需重新构建。新店铺 slug 通过通用 `/shop` 页面读取发布内容，无需预生成路由。代码、字体声明、贴片 catalog 或渲染组件变动仍需构建部署。

## 初始化素材和内容

先运行 `npm run build`，再运行 `npm run r2:plan` 查看文件数量。上传脚本固定桶名和前缀，没有删除操作。隐藏文件、符号链接和 Pages 控制文件不会上传。

通过环境变量提供 R2 S3 凭证（不提交到 Git）：`R2_ACCOUNT_ID`、`R2_ACCESS_KEY_ID`、`R2_SECRET_ACCESS_KEY`。脚本读取进程环境，不自动加载 `.env`。

```
npm run r2:upload -- --initialize-content
```

`--initialize-content` 只用于首次初始化，并以条件写入拒绝覆盖已有草稿和发布内容。日后同步本地素材使用 `npm run r2:upload`，默认不上传内容 JSON；同路径素材会更新，不删除远端已有图片。线上新上传图片在 R2，不会自动下载回本地，更新素材时避免覆盖线上同名文件。

## 独立 Pages 项目

`wrangler.jsonc` 定义独立项目 `zby-portfolio-v3`，输出 `dist`，R2 绑定现有 `portfolio`。不要修改 V2 或 DY-Page 的 Pages 项目。执行 `npm run cf:deploy` 部署本项目；Git 集成部署时也应新建独立 Pages 项目，生产分支选择 v3 分支，构建命令 `npm run build`，输出目录 `dist`。

正式环境设置：

| 名称 | 类型 | 用途 |
|---|---|---|
| `PORTFOLIO` | R2 绑定 | 现有桶 `portfolio` |
| `ADMIN_PASSWORD_HASH` | Secret | `scripts/hash-password.mjs` 生成的 PBKDF2 值 |
| `SESSION_SECRET` | Secret | 独立随机密钥，至少 32 字节 |
| `ALLOWED_ORIGIN` | 变量 | V3 正式访问源，不含末尾斜杠 |

不要复制 V2 登录密钥。Cookie 名为 `portfolio_v3_session`，HttpOnly、Secure、SameSite=Strict，有效期 8 小时。无需 `GITHUB_TOKEN`、`GITHUB_REPOSITORY` 或草稿分支配置。

`/api/published` 公开只读，草稿、保存、发布和上传必须登录且写入检查 Origin。上传支持 JPG、PNG、WebP、GIF、AVIF，单张最多 20MB，原名按内容哈希隔离。店铺素材限定项目目录；目录导入目前仍为本地能力，线上不要将普通图片上传当成完整贴片目录导入。多管理员同时保存时使用最后一次成功写入的数据，尚无冲突合并或自动版本回退。

正式验收必须验证登录、保存隔离、发布读取、真实 R2 上传、桌面和手机图片及交互；本地模拟测试不表示正式站已上线。

参考：[Cloudflare R2 Workers API](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/)、[上传对象](https://developers.cloudflare.com/r2/objects/upload-objects/)。
