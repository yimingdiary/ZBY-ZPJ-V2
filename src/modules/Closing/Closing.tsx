import { useId } from "react";
import { useDecorationVisibility } from "../../design/DecorationVisibility";
import { Navigation, type NavigationProps } from "../Navigation/Navigation";
import { Footer } from "../Footer/Footer";
import letters from "./letters.json";
import s from "./Closing.module.css";
export type ClosingProps = NavigationProps & {
  title: string;
  subtitle: string;
  wish: string;
  welcome: string;
  learning: string;
  years: string;
  category: string;
};
const edges = [169, 339, 516, 692, 869, 1045, 1221, 1394, 1575, 1773];
export function Closing(p: ClosingProps) {
  const decorated = useDecorationVisibility();
  const uid = useId().replace(/:/g, "");
  const chars = [...p.title];
  // 原稿 THANK / 花形 / YOU 共九格，八个字母仍使用真实 SVG text。
  const standard = chars.length === 8;
  return (
    <section id="closing" className={s.closing} aria-label="结束页">
      <Navigation version={1} brand={p.brand} items={p.items} motto={p.motto} />
      <div className={s.hero}>
        <h2 aria-label={p.title}>
          <svg
            className={s.art}
            viewBox="169 323 1604 298"
            role="img"
            aria-label={p.title}
          >
            <defs>
              {chars.map((_, i) => {
                const slot = standard ? (i < 5 ? i : i + 1) : i;
                const x = standard
                  ? edges[slot]
                  : 169 + (1604 * i) / chars.length;
                const right = standard
                  ? edges[slot + 1]
                  : 169 + (1604 * (i + 1)) / chars.length;
                return (
                  <clipPath id={`${uid}-closing-${i}`} key={i}>
                    <rect x={x} y="385.8" width={right - x} height="177.82" />
                  </clipPath>
                );
              })}
            </defs>
            <g fill="currentColor">
              {chars.map((char, i) => {
                const layout = letters[i % 8];
                return (
                  <g key={i} clipPath={`url(#${uid}-closing-${i})`}>
                    <text
                      transform={
                        standard
                          ? layout.transform
                          : `translate(${169 + (1604 * i) / chars.length} 570)`
                      }
                      fontSize={
                        standard ? layout.size : (1604 / chars.length) * 1.2
                      }
                      fontFamily={`var(--font-${standard ? layout.font : "display"})`}
                    >
                      {char}
                    </text>
                  </g>
                );
              })}
            </g>
            {standard && (
              <image
                href="/decorations/closing-flower.svg"
                x="1070"
                y="400"
                width="135"
                height="150"
              />
            )}
            {decorated && (
              <image
                href="/decorations/closing-guides.svg"
                x="117"
                y="323"
                width="1696"
                height="298"
              />
            )}
          </svg>
        </h2>
        <div className={s.captions}>
          <div>
            <p>{p.subtitle}</p>
            <p className={s.wish}>{p.wish}</p>
          </div>
          <p className={s.welcome}>{p.welcome}</p>
          <p className={s.learning}>{p.learning}</p>
        </div>
      </div>
      <Footer version={1} years={p.years} category={p.category} />
    </section>
  );
}
