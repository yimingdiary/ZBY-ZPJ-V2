import type { Config } from "@puckeditor/core";
import { Chrome } from "./Chrome/Chrome";
import { Navigation, type NavigationProps } from "./Navigation/Navigation";
import { PortfolioHero, type HeroProps } from "./PortfolioHero/PortfolioHero";
import { Footer, type FooterProps } from "./Footer/Footer";
export type Modules = {
  Navigation: NavigationProps;
  PortfolioHero: HeroProps;
  Footer: FooterProps;
};
const versionField = {
  type: "number" as const,
  label: "模块版本（固定为 1）",
  min: 1,
  max: 1,
};
export const config: Config<Modules> = {
  root: {
    fields: {
      chrome: {
        type: "radio",
        label: "Photoshop 装饰",
        options: [
          { label: "显示", value: true },
          { label: "隐藏", value: false },
        ],
      },
    },
    defaultProps: { chrome: true },
    render: ({ children, chrome }) => (
      <Chrome enabled={chrome}>{children}</Chrome>
    ),
  },
  components: {
    Navigation: {
      label: "顶部导航",
      fields: {
        version: versionField,
        brand: { type: "textarea", label: "品牌文字" },
        items: {
          type: "array",
          label: "分类导航",
          arrayFields: {
            label: { type: "text", label: "分类名称" },
            href: { type: "text", label: "链接（留空为文字）" },
          },
          getItemSummary: (item) => item.label,
        },
        motto: { type: "text", label: "右侧标语" },
      },
      defaultProps: {
        version: 1,
        brand: "DESIGN\nPORTFOLIO",
        items: [],
        motto: "KEEP EXPLORING",
      },
      render: Navigation,
    },
    PortfolioHero: {
      label: "作品集主视觉",
      fields: {
        version: versionField,
        title: { type: "text", label: "主标题（最多 12 字符）" },
        subtitle: { type: "text", label: "中文副标题" },
        welcome: { type: "textarea", label: "欢迎语" },
        motto: { type: "text", label: "右侧标语" },
        font: {
          type: "select",
          label: "主标题字体",
          options: [
            { label: "Gerbil 展示字体", value: "display" },
            { label: "阿里巴巴普惠体", value: "body" },
          ],
        },
        ink: { type: "text", label: "文字颜色（inherit 跟随全局／六位 HEX）" },
        spacing: {
          type: "number",
          label: "顶部留白（画布宽度百分比）",
          min: 4,
          max: 30,
        },
      },
      defaultProps: {
        version: 1,
        title: "PORTFOLIO",
        subtitle: "[設計作品集]",
        welcome: "Welcome To\nMy Channel",
        motto: "[KEEP LEARNING]",
        font: "display",
        ink: "inherit",
        spacing: 14.5,
      },
      render: PortfolioHero,
    },
    Footer: {
      label: "底部年份栏",
      fields: {
        version: versionField,
        years: { type: "text", label: "年份" },
        category: { type: "text", label: "设计领域" },
      },
      defaultProps: { version: 1, years: "2023-2026", category: "[平面/视觉]" },
      render: Footer,
    },
  },
};
