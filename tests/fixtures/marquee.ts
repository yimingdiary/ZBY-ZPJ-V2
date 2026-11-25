import { marqueeDefaults } from "../../src/modules/DouyinShop/marquee.js";
export const marqueeFixture = (direction = "left") => ({
  id: "local-marquee",
  type: "marquee",
  ...marqueeDefaults(),
  direction,
  speed: 0.2,
  pauseAfterGesture: true,
  pauseDuration: 800,
  background: "/images/douyin-shop/marquee-test/card-3.png",
  backgroundColor: "#ffffff",
  showIndicator: true,
  indicatorBox: "300|195|120|10",
  items: [1, 2, 3].map((i) => ({
    images: [{ src: `/images/douyin-shop/marquee-test/card-${i}.png` }],
    link: `https://example.com/marquee-${i}`,
  })),
  hotspots: [
    {
      x: 95,
      y: 0,
      width: 5,
      height: 8,
      action: "url",
      target: "https://example.com/hotspot",
    },
  ],
});
