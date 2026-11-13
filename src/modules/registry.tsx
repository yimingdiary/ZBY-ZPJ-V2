import { WorkFolderPicker } from "../editor/WorkFolderPicker";
import { ImagePicker } from "../editor/ImagePicker";
import type { Config } from "@puckeditor/core";
import { Chrome } from "./Chrome/Chrome";
import { Navigation, type NavigationProps } from "./Navigation/Navigation";
import { PortfolioHero, type HeroProps } from "./PortfolioHero/PortfolioHero";
import { Footer, type FooterProps } from "./Footer/Footer";
import { AboutMe, type AboutMeProps } from "./AboutMe/AboutMe";
import aboutDefaults from "./AboutMe/defaults.json";
import { Contents, type ContentsProps } from "./Contents/Contents";
import contentsDefaults from "./Contents/defaults.json";
import { Closing, type ClosingProps } from "./Closing/Closing";
import closingDefaults from "./Closing/defaults.json";
import {
  OverlayGallery,
  type OverlayGalleryProps,
} from "./OverlayGallery/OverlayGallery";
import overlayDefaults from "./OverlayGallery/defaults.json";
export type Modules = {
  OverlayGallery: OverlayGalleryProps;
  Contents: ContentsProps;
  Closing: ClosingProps;
  AboutMe: AboutMeProps;
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
    OverlayGallery: {
      label: "贴片设计作品",
      fields: {
        version: versionField,
        title: { type: "text", label: "作品板块英文标题" },
        subtitle: { type: "text", label: "作品类型说明" },
        category: { type: "text", label: "作品分类名称" },
        layout: {
          type: "object",
          label: "作品排版（1920 设计稿单位）",
          objectFields: {
            safeWidth: {
              type: "number",
              label: "安全区域总宽度",
              min: 0.01,
              max: 10000,
            },
            imageWidth: {
              type: "number",
              label: "单图宽度",
              min: 0.01,
              max: 10000,
            },
            imageHeight: {
              type: "number",
              label: "单图高度",
              min: 0.01,
              max: 10000,
            },
            gap: {
              type: "number",
              label: "图间距（0 自动均分）",
              min: 0,
              max: 10000,
            },
          },
        },
        items: {
          type: "array",
          label: "作品图片",
          max: 12,
          defaultItemProps: { src: "", alt: "", dynamic: false },
          getItemSummary: (item, index) =>
            item.alt || `作品 ${(index ?? 0) + 1}`,
          arrayFields: {
            alt: { type: "text", label: "作品名称" },
            src: {
              type: "custom",
              label: "选择路径",
              render: ({ value, onChange, readOnly }) => (
                <WorkFolderPicker
                  value={value}
                  onChange={onChange}
                  readOnly={readOnly}
                />
              ),
            },
            dynamic: {
              type: "radio",
              label: "是否动态",
              options: [
                { label: "否", value: false },
                { label: "是", value: true },
              ],
            },
          },
        },
      },
      defaultProps: { ...overlayDefaults, version: 1 },
      render: OverlayGallery,
    },
    Contents: {
      label: "作品目录",
      fields: {
        version: versionField,
        title: { type: "text", label: "目录英文标题" },
        subtitle: { type: "text", label: "目录中文标题" },
        items: {
          type: "array",
          label: "分类项目",
          arrayFields: {
            letter: { type: "text", label: "大字母" },
            number: { type: "text", label: "序号" },
            label: { type: "text", label: "中文分类" },
            english: { type: "textarea", label: "英文分类（可换行）" },
            href: { type: "text", label: "链接（无真实目标时留空）" },
          },
          getItemSummary: (item) => item.label,
        },
      },
      defaultProps: { ...contentsDefaults, version: 1 },
      render: Contents,
    },
    Closing: {
      label: "结束页",
      fields: {
        version: versionField,
        title: { type: "text", label: "结束页标题（8字符使用原稿排版）" },
        brand: { type: "textarea", label: "品牌文字" },
        items: {
          type: "array",
          label: "结束页导航",
          arrayFields: {
            label: { type: "text", label: "分类名称" },
            href: { type: "text", label: "链接（无真实目标时留空）" },
          },
          getItemSummary: (item) => item.label,
        },
        motto: { type: "text", label: "导航右侧标语" },
        subtitle: { type: "text", label: "中文副标题" },
        wish: { type: "text", label: "祝福语" },
        welcome: { type: "textarea", label: "欢迎语" },
        learning: { type: "text", label: "右侧标语" },
        years: { type: "text", label: "年份" },
        category: { type: "text", label: "设计领域" },
      },
      defaultProps: { ...closingDefaults, version: 1 },
      render: Closing,
    },
    AboutMe: {
      label: "个人介绍 · 第二屏",
      fields: {
        version: versionField,
        title: { type: "text", label: "页面标题" },
        name: { type: "text", label: "中文姓名" },
        englishName: { type: "text", label: "英文姓名" },
        portrait: {
          type: "custom",
          label: "照片",
          render: ({ value, onChange, readOnly }) => (
            <ImagePicker
              value={value}
              onChange={onChange}
              readOnly={readOnly}
            />
          ),
        },
        portraitAlt: { type: "text", label: "照片描述" },
        company: { type: "text", label: "公司名称" },
        role: { type: "text", label: "职位" },
        period: { type: "text", label: "工作时间" },
        summary: { type: "textarea", label: "工作概述" },
        facts: {
          type: "array",
          label: "基础信息",
          arrayFields: {
            label: { type: "text", label: "名称" },
            value: { type: "text", label: "内容" },
          },
          getItemSummary: (item) => item.label,
        },
        achievements: {
          type: "array",
          label: "工作成果",
          arrayFields: {
            title: { type: "text", label: "标题" },
            description: { type: "text", label: "说明" },
          },
          getItemSummary: (item) => item.title,
        },
        education: {
          type: "array",
          label: "教育经历",
          arrayFields: {
            school: { type: "text", label: "学校" },
            qualification: { type: "text", label: "学历简称" },
            major: { type: "text", label: "专业" },
            period: { type: "text", label: "就读时间" },
          },
          getItemSummary: (item) => item.school,
        },
        skills: {
          type: "array",
          label: "技能",
          arrayFields: { label: { type: "text", label: "技能名称" } },
          getItemSummary: (item) => item.label,
        },
      },
      defaultProps: { ...aboutDefaults, version: 1 },
      render: AboutMe,
    },

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
