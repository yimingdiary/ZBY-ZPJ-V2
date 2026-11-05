# 全局设计变量

统一入口：`src/styles/tokens.css`。变量可在任何 CSS Module 中使用，无需导入其他模块。

| 变量                    | 用途                   | 当前取值／来源           |
| ----------------------- | ---------------------- | ------------------------ |
| `--font-display`        | 主标题默认字体         | Gerbil                   |
| `--font-accent`         | 主标题特殊 O 字形      | Geyster                  |
| `--font-body`           | 正文、导航与中文大标题 | 阿里巴巴普惠体 3.0 Light |
| `--font-label`          | 小型英文说明与标签     | 思源黑体 Medium          |
| `--color-paper`         | 页面底色               | `#f8f8f8`                |
| `--color-ink`           | 主文字、黑色底栏       | `#080808`                |
| `--color-guide`         | 主标题辅助线与节点     | `#727272`                |
| `--color-chrome`        | Photoshop 外壳         | `#535353`                |
| `--space-page`          | 主内容左右留白         | 画布宽度的 5.3%          |
| `--size-nav`            | 导航字号               | 响应式 12–23px           |
| `--size-caption`        | 辅助文字字号           | 响应式 11–15px           |
| `--size-subtitle`       | 中文副标题字号         | 响应式 20–48px           |
| `--size-year`           | 底栏年份字号           | 画布宽度的 2.7%          |
| `--size-footer-caption` | 底栏领域字号           | 画布宽度的 1.8%          |
| `--line-guide`          | 辅助线线宽             | 1px                      |
| `--duration-fast`       | 预留快速过渡时长       | 180ms                    |

`cqw` 以当前页面画布宽度为基准，编辑器缩放预览也能保持比例。手机断点可在所属模块中覆盖字号和布局。

使用示例：

```css
.title {
  color: var(--color-ink);
  font-family: var(--font-display);
  font-size: var(--size-subtitle);
}
```

整体更换标题字体：先提供有使用权限的字体文件，准备 WOFF2，在 `tokens.css` 增加或修改 `@font-face`，再更改 `--font-display`。改变变量名时应检索全部引用并更新本表。

主视觉允许在后台选择受控字体与自定义六位 HEX 文字颜色；颜色值为 `inherit` 时使用全局 `--color-ink`。字号和网格几何结构由模块样式维护，以免任意拖动破坏整体排版。

模块私有变量例子：`--hero-ink`、`--hero-space`、`--hero-font`。它们由主视觉配置映射产生，只供该模块内部使用。

主视觉各字母的字号与旋转基于参考 SVG 的内在坐标，集中在 `PortfolioHero.tsx` 的排版数据中维护。它属于特定模块的图形排版，不与普通文本共用单一字号。

中文字体优先使用同一原字体生成的页面小字库（`AlibabaPage` / `SourceHanPage`），未包含的新字符再使用完整 WOFF2。两者字形完全一致；`fonts.generated.css` 由字体脚本生成，不手工修改。

标题线框已按用户要求改为原 SVG 素材，其线条与圆点保留原色，不再跟随 `--color-guide`；修改该素材需保留来源及准确几何信息。
