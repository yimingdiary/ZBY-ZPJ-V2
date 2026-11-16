import { Chrome } from "./Chrome/Chrome";
import { Navigation } from "./Navigation/Navigation";
import { PortfolioHero } from "./PortfolioHero/PortfolioHero";
import { Footer } from "./Footer/Footer";
import { AboutMe } from "./AboutMe/AboutMe";
import { Contents } from "./Contents/Contents";
import { Closing } from "./Closing/Closing";
import { OverlayGallery } from "./OverlayGallery/OverlayGallery";
import { DouyinGallery } from "./DouyinShop/DouyinGallery";
import type { ComponentType } from "react";
// 与装修页共用实际组件，公开端不加载 Puck 编辑器和上传控件。
const components: Record<string, ComponentType<any>> = {
  Navigation,
  PortfolioHero,
  Footer,
  AboutMe,
  Contents,
  Closing,
  OverlayGallery,
  DouyinGallery,
};
export function PublicPage({
  data,
}: {
  data: {
    root: { props: { chrome: boolean } };
    content: { type: string; props: { id: string; [key: string]: unknown } }[];
  };
}) {
  return (
    <Chrome enabled={data.root.props.chrome}>
      {data.content.map((block) => {
        const Component = components[block.type];
        if (!Component) throw Error(`未注册的公开模块 ${block.type}`);
        return <Component key={block.props.id} {...block.props} />;
      })}
    </Chrome>
  );
}
