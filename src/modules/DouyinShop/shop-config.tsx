import { marqueeDefaults } from "./marquee.js";
import { SHOP_HEADER } from "./shared";
import { GeometryField } from "./GeometryField";
import { useEffect, useRef } from "react";
import { usePuck } from "@puckeditor/core";
import type { Config, Data, Field } from "@puckeditor/core";
import { ShopImagePicker } from "./ShopAssets";
import { shopMarkup, attachShop } from "./engine.js";
import type { ShopDocument, ShopComponent } from "./ShopPage";
import { HotspotField } from "./HotspotField";
import s from "./ShopPage.module.css";
import editorStyles from "./ShopEditor.module.css";
export const shopNames = {
  marquee: "抖音店铺-图片跑马灯",
  poster: "抖音店铺-静态海报",
  carousel: "抖音店铺-轮播图",
  tabCarousel: "抖音店铺-Tab轮播",
  flipGrid: "抖音店铺-换一换",
};
const image = (label: string): Field => ({
  type: "custom",
  label,
  render: ({ value, onChange, readOnly }) => (
    <div className={editorStyles.assetField}>
      <strong>{label}</strong>
      <ShopImagePicker
        value={value || ""}
        onChange={onChange}
        readOnly={readOnly}
      />
    </div>
  ),
});
const geometry = (label: string, labels: string[]): Field => ({
  type: "custom",
  label,
  render: ({ value, onChange, readOnly }) => (
    <GeometryField
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      labels={labels}
      title={
        label +
        "（" +
        labels
          .map((l) =>
            l.replace(/缩略区域|缩略图|内容区域|列表|小图|网格|按钮/g, ""),
          )
          .join("/") +
        "）"
      }
    />
  ),
});
const imageSize = (src: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () =>
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(Error("店铺图片读取失败"));
    image.src = src;
  });
const text = (label: string): Field => ({ type: "text", label });
const number = (label: string, min = 0, max = 100000): Field => ({
  type: "number",
  label,
  min,
  max,
});
const radio = (label: string): Field => ({
  type: "radio",
  label,
  options: [
    { label: "否", value: false },
    { label: "是", value: true },
  ],
});
const select = (label: string, options: string[][]): Field => ({
  type: "select",
  label,
  options: options.map(([value, label]) => ({ value, label })),
});
const hotspots: Field = {
  type: "custom",
  label: "点击热区（框选、移动与缩放）",
  render: ({ value, onChange, readOnly, field }) => (
    <HotspotField
      value={value || []}
      onChange={onChange}
      readOnly={readOnly}
      image={(field as Field & { image?: string }).image}
    />
  ),
};
function TabHotspots({ value, onChange, readOnly, name }: any) {
  const { selectedItem } = usePuck();
  const index = Number(
    name.match(/tabs\[(\d+)\]/)?.[1] ?? name.match(/tabs\.(\d+)/)?.[1] ?? 0,
  );
  const tab = selectedItem?.props.tabs?.[index];
  return (
    <HotspotField
      value={value || []}
      onChange={onChange}
      readOnly={readOnly}
      image={tab?.image || tab?.images?.[0]}
    />
  );
}
const common = { link: text("整图跳转（网址或 /shop/作品标识）"), hotspots };
const defaults = { link: "", hotspots: [] };
export function ShopBlock({ component }: { component: ShopComponent }) {
  const ref = useRef<HTMLDivElement>(null);
  const page = { componentRadius: 10, components: [component] };
  useEffect(
    () => (ref.current ? attachShop(ref.current, page, false) : undefined),
    [component],
  );
  return (
    <div
      data-shop-block=""
      ref={ref}
      className={s.page}
      style={{ padding: 0, minHeight: 0, width: "100%" }}
      dangerouslySetInnerHTML={{ __html: shopMarkup(page) }}
    />
  );
}
export const shopConfig: Config<
  any,
  { componentRadius: number; header?: string; assetFolder?: string }
> = {
  root: {
    fields: {
      componentRadius: number("所有组件圆角", 0, 100),
    },
    defaultProps: { componentRadius: 10, header: SHOP_HEADER },
    render: ({
      children,
      componentRadius,
    }: {
      children: React.ReactNode;
      componentRadius: number;
      header?: string;
    }) => (
      <div
        className={s.page}
        style={
          {
            "--component-radius": `${componentRadius}px`,
          } as React.CSSProperties
        }
      >
        {
          <div className={s.header}>
            <img src={SHOP_HEADER} alt="店铺页头" />
          </div>
        }
        <div className={s.content}>{children}</div>
      </div>
    ),
  },
  components: {
    marquee: {
      label: shopNames.marquee,
      defaultProps: { ...marqueeDefaults(), hotspots: [] },
      resolveFields: ({ props }, params) => ({
        ...params.fields,
        hotspots: { ...hotspots, image: props.background } as Field,
      }),
      fields: {
        backgroundColor: text("背景颜色（六位 HEX 或留空）"),
        background: image("背景图"),
        hotspots,
        moduleHeight: number("组件高度（718 基准）", 1),
        scrollBox: geometry("滚动区域", ["左距", "上距", "宽度", "高度"]),
        imageGap: text("图片间距（718 基准）"),
        items: {
          type: "array",
          label: "跑马灯图片",
          max: 30,
          defaultItemProps: { images: [{ src: "" }], link: "" },
          getItemSummary: (_, i) => `第 ${(i ?? 0) + 1} 张`,
          arrayFields: {
            images: {
              type: "custom",
              label: "图片",
              render: ({ value, onChange, readOnly }) => (
                <div className={editorStyles.assetField}>
                  <strong>图片</strong>
                  <ShopImagePicker
                    value={value?.[0]?.src || ""}
                    readOnly={readOnly}
                    onChange={(src: string) => onChange([{ src }])}
                  />
                </div>
              ),
            },
            link: text("此图跳转（网址或 /shop/作品标识）"),
          },
        },
        direction: select("滚动方向", [
          ["left", "向左连续滚动"],
          ["right", "向右连续滚动"],
        ]),
        speed: number("滚动速度（越大越慢，建议5–10）", 0.1),
        gestures: radio("开启手势"),
        pauseAfterGesture: radio("手势后暂停"),
        pauseDuration: number("暂停时长（毫秒）"),
        showIndicator: radio("显示导标"),
        indicatorBox: geometry("导标区域", ["左距", "上距", "宽度", "高度"]),
        indicatorRadius: number("导标圆角"),
        indicatorColors: text("导标颜色（底色|滑块色，六位 HEX）"),
      },
      render: (props) => (
        <ShopBlock component={{ ...props, type: "marquee" }} />
      ),
    },

    poster: {
      label: shopNames.poster,
      resolveData: async ({ props }, { changed }) => {
        if (!changed.image || !props.image) return { props };
        const size = await imageSize(props.image);
        return {
          props: { ...props, posterAspect: `${size.width}/${size.height}` },
        };
      },
      fields: { image: image("海报图片"), ...common },
      defaultProps: { ...defaults, image: "" },
      resolveFields: ({ props }, params) => ({
        ...params.fields,
        hotspots: { ...hotspots, image: props.image } as Field,
      }),
      render: (props) => <ShopBlock component={{ ...props, type: "poster" }} />,
    },
    carousel: {
      label: shopNames.carousel,
      resolveData: async ({ props }, { changed }) => {
        if (!changed.images) return { props };
        const sizes = await Promise.all(
          (props.images || []).map((i: { src: string }) =>
            i.src ? imageSize(i.src) : Promise.resolve(null),
          ),
        );
        return {
          props: {
            ...props,
            carouselAspects: sizes.map((size) =>
              size ? `${size.width}|${size.height}` : "750|450",
            ),
          },
        };
      },
      fields: {
        images: {
          type: "array",
          label: "轮播图片",
          arrayFields: { src: image("图片") },
          defaultItemProps: { src: "" },
          getItemSummary: (_, i) => `第 ${(i ?? 0) + 1} 张`,
        },
        interval: number("自动播放间隔（毫秒）", 800),
        ...common,
      },
      defaultProps: { ...defaults, images: [], interval: 3000 },
      render: (props) => (
        <ShopBlock
          component={{
            ...props,
            type: "carousel",
            images: props.images.map((i: { src: string }) => i.src),
          }}
        />
      ),
    },
    tabCarousel: {
      label: shopNames.tabCarousel,
      resolveFields: ({ props }, params) => ({
        ...params.fields,
        hotspots: { ...hotspots, image: props.background } as Field,
      }),
      fields: {
        background: image("背景图"),
        backgroundColor: text("背景颜色（六位 HEX 或留空）"),
        moduleHeight: number("组件高度（718 基准）", 1),
        thumbnailLayout: select("缩略图方向", [
          ["horizontal", "横向"],
          ["vertical", "纵向"],
        ]),
        thumbnailBox: geometry("缩略图区域", [
          "缩略区域宽度",
          "缩略区域高度",
          "缩略区域上距",
          "缩略区域左距",
        ]),
        thumbnailSize: geometry("缩略图尺寸", [
          "缩略图宽度",
          "缩略图高度",
          "缩略图间距",
        ]),
        contentBox: geometry("内容区域", [
          "内容区域宽度",
          "内容区域高度",
          "内容区域上距",
          "内容区域左距",
        ]),
        transition: select("切换效果", [
          ["horizontal", "水平"],
          ["vertical", "垂直"],
          ["fade", "淡入淡出"],
        ]),
        animationTime: number("切换时长（秒）", 0, 60),
        autoPlay: radio("自动轮播"),
        autoInterval: number("停留时长（秒）", 0.1, 3600),
        initialIndex: number("初始标签（从0开始）", 0, 30),
        tabs: {
          type: "array",
          label: "标签及内容",
          max: 30,
          defaultItemProps: {
            title: "",
            image: "",
            selectedImage: "",
            unselectedImage: "",
            hotspots: [],
          },
          getItemSummary: (t, i) => t.title || `标签 ${(i ?? 0) + 1}`,
          arrayFields: {
            title: text("标签名称"),
            selectedImage: image("选中缩略图图片"),
            unselectedImage: image("未选中缩略图图片"),
            image: image("轮播图片"),
            hotspots: {
              ...hotspots,
              render: ({ value, onChange, readOnly, name }: any) => (
                <TabHotspots
                  value={value}
                  onChange={onChange}
                  readOnly={readOnly}
                  name={name}
                />
              ),
            } as Field,
          },
        },
        hotspots,
      },
      defaultProps: {
        ...defaults,
        background: "",
        backgroundColor: "",
        moduleHeight: 744,
        thumbnailLayout: "horizontal",
        thumbnailBox: "718|226|113|20",
        thumbnailSize: "170|55|0",
        contentBox: "718|744|0|0",
        transition: "horizontal",
        animationTime: 0.5,
        autoPlay: false,
        autoInterval: 3,
        initialIndex: 0,
        tabs: [],
      },
      render: (props) => (
        <ShopBlock component={{ ...props, type: "tabCarousel" }} />
      ),
    },
    flipGrid: {
      label: shopNames.flipGrid,
      resolveData: ({ props }) => {
        const [rows, cols] = String(props.gridSize || "3|3")
          .split("|")
          .map(Number);
        const count = Math.min(100, Math.max(1, rows * cols));
        const items = [...(props.items || [])];
        while (items.length < count) items.push({ empty: false, images: [] });
        return { props: { ...props, items } };
      },
      resolveFields: ({ props }, params) => ({
        ...params.fields,
        hotspots: { ...hotspots, image: props.background } as Field,
      }),
      fields: {
        background: image("背景图"),
        hotspots,
        backgroundColor: text("背景颜色"),
        moduleHeight: number("组件高度（718 基准）", 1),
        flipDirection: select("翻转方向", [
          ["horizontal", "水平"],
          ["vertical", "垂直"],
          ["none", "淡入淡出"],
        ]),
        autoSwitch: radio("自动换图"),
        carouselSettings: geometry("翻转时间", [
          "停留时间（毫秒）",
          "翻转时长（毫秒）",
          "逐格延迟（毫秒）",
        ]),
        listSettings: geometry("网格列表区域", [
          "列表左距",
          "列表上距",
          "列表宽度",
          "列表高度",
        ]),
        imageSize: geometry("网格小图尺寸", ["小图宽度", "小图高度"]),
        gridSize: geometry("网格行列", ["网格行数", "网格列数"]),
        buttonPosition: geometry("换一换按钮位置", ["按钮左距", "按钮上距"]),
        buttonImage: image("换一换按钮图片（透明图）"),
        buttonAnimation: select("按钮动画", [
          ["none", "无"],
          ["scale", "呼吸缩放"],
        ]),
        items: {
          type: "array",
          label: "网格图片（按行排序）",
          max: 100,
          defaultItemProps: { empty: false, images: [] },
          getItemSummary: (_, i) => `第 ${(i ?? 0) + 1} 格`,
          arrayFields: {
            empty: radio("置空此格"),
            images: {
              type: "array",
              label: "此格轮换图片",
              max: 30,
              defaultItemProps: { src: "", link: "" },
              arrayFields: {
                src: image("产品图片"),
                link: text("此图跳转网址"),
              },
              getItemSummary: (_, i) => `第 ${(i ?? 0) + 1} 张`,
            },
          },
        },
      },
      defaultProps: {
        hotspots: [],
        background: "",
        backgroundColor: "#ffffff",
        moduleHeight: 917,
        flipDirection: "horizontal",
        autoSwitch: false,
        carouselSettings: "2000|500|50",
        listSettings: "10|145|698|724",
        imageSize: "219|228",
        gridSize: "3|3",
        buttonPosition: "280|420",
        buttonImage: "",
        buttonAnimation: "none",
        items: Array.from({ length: 9 }, () => ({ empty: false, images: [] })),
      },
      render: (props) => (
        <ShopBlock component={{ ...props, type: "flipGrid" }} />
      ),
    },
  },
};
export function toShopData(
  page: ShopDocument,
): Data<
  any,
  { componentRadius: number; header?: string; assetFolder?: string }
> {
  return {
    root: {
      props: {
        componentRadius: page.componentRadius,
        header: SHOP_HEADER,
        assetFolder: page.assetFolder,
      },
    },
    content: page.components.map((c) => {
      const { type, ...props } = c;
      return {
        type,
        props: {
          ...props,
          ...(type === "carousel"
            ? { images: ((c.images as string[]) || []).map((src) => ({ src })) }
            : {}),
        },
      };
    }),
  } as Data<
    any,
    { componentRadius: number; header?: string; assetFolder?: string }
  >;
}
export function fromShopData(
  data: Data<
    any,
    { componentRadius: number; header?: string; assetFolder?: string }
  >,
): ShopDocument {
  return {
    componentRadius: data.root.props?.componentRadius ?? 10,
    header: SHOP_HEADER,
    assetFolder: data.root.props?.assetFolder,
    components: data.content.map((c) => {
      const { readOnly, ...props } = c.props;
      return {
        ...props,
        type: c.type,
        ...(c.type === "carousel"
          ? { images: (props.images || []).map((i: { src: string }) => i.src) }
          : {}),
      } as ShopComponent;
    }),
  };
}
