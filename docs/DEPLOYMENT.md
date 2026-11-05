# 本地开发与正式部署

## 本地运行

```bash
npm ci
npm run dev
```

访问 `http://127.0.0.1:4321/` 和 `/admin`。开发后台无需登录，文件接口仅允许本机、同源 JSON 请求。请勿用 `--host 0.0.0.0` 对外暴露开发环境。

`npm run build` 执行 Schema 预编译、类型检查、静态页面生成及 Pages Worker 打包。`npm run preview` 只检查静态发布产物，不运行保存 API；后台编辑请使用开发服务或部署后的 Pages。

## Cloudflare Pages

通过 Pages 的 Git 集成连接 `yimingdiary/ZBY-ZPJ-V2`，生产分支选择 `main`。如果仓库根目录就是 V2，构建根目录留空；若仓库包含版本子目录，构建根目录设为实际的 V2 目录。构建命令 `npm run build`，输出目录 `dist`，Node 版本使用 `22.23.4` 或满足当前依赖要求的版本。

Worker 以 Pages 官方 Advanced mode 方式生成到 `dist/_worker.js`，`public/_routes.json` 只让 `/api/*` 进入 Worker，其他请求走静态资源。无需 D1、R2 或常驻服务器。

生产环境设置以下变量；凭证使用加密 Secret：

| 名称                  | 类型   | 用途                                              |
| --------------------- | ------ | ------------------------------------------------- |
| `GITHUB_REPOSITORY`   | 变量   | `yimingdiary/ZBY-ZPJ-V2`                          |
| `GITHUB_TOKEN`        | Secret | 仅授权该仓库 Contents 读写的 fine-grained token   |
| `ADMIN_PASSWORD_HASH` | Secret | PBKDF2-SHA256 的 `迭代次数:盐:哈希`               |
| `SESSION_SECRET`      | Secret | 随机生成至少 32 字节的会话签名密钥                |
| `ALLOWED_ORIGIN`      | 变量   | 正式访问源，例如 `https://实际域名`，不含末尾 `/` |
| `DRAFT_BRANCH`        | 变量   | 默认 `content-draft`                              |
| `PUBLISH_BRANCH`      | 变量   | 默认 `main`                                       |

本阶段实现最小权限 Token 方案；未实现 GitHub App 安装流程。密码哈希可使用 `scripts/hash-password.mjs` 生成，密码通过 `ADMIN_PASSWORD` 环境变量传入，不提交到 Git 或聊天记录。会话使用 HttpOnly、Secure、SameSite=Strict Cookie，8 小时过期。修改会话密钥可使原会话失效。

首次登录读取内容时，会依据生产分支创建独立草稿分支。保存草稿只提交该分支；生产站仅跟踪 `main`。在 Pages 设置中关闭 `content-draft` 的 Preview 部署，避免每次保存草稿触发无用构建，且不要给预览环境配置生产写入密钥。

发布只提交 `content/published/home.json`，依赖 Pages Git 集成触发真实构建。后台显示“已提交，等待构建”，不能当作上线成功；需要到 Pages 查看构建结果并访问正式站核验。原内容可通过 Git 历史恢复后重新构建。

主分支保护规则必须允许所选凭证按既定流程写入内容；不允许时发布会失败，需调整为获授权的发布流程，不得绕过保护。

当前尚未绑定真实 Pages 项目或设置凭证；正式登录、GitHub 写入与自动部署仍需真实环境验收。

## 参考官方接口

- [Puck Dictionary API](https://puckeditor.com/docs/api-reference/dictionary)
- [Cloudflare Pages Advanced mode](https://developers.cloudflare.com/pages/functions/advanced-mode/)
- [GitHub Contents API](https://docs.github.com/en/rest/repos/contents)

## 更新字体资源

常规构建使用已生成的 WOFF2，不依赖 Python。更换原字体或希望刷新页面小字库时，在 V2 内创建 Python 虚拟环境，安装 `fonttools` 和 `brotli`，执行 `python scripts/prepare-fonts.py`。提交原字体、生成的 WOFF2 及 `src/styles/fonts.generated.css`；新文字未进入小字库时仍能使用完整字库显示。
