import { useId, type CSSProperties } from "react";
import s from "./PortfolioHero.module.css";
export type HeroProps = {
  version: 1;
  title: string;
  subtitle: string;
  welcome: string;
  motto: string;
  font: "display" | "body";
  ink: string;
  spacing: number;
};
// 原参考稿的字形排版坐标；文字依然是真实可编辑的 SVG text。
const edges = [169, 339, 516, 692, 869, 1045, 1220, 1402, 1575, 1772];
const letters = [
  { transform: "translate(189.79 593.91) rotate(-14.1)", size: 223.25 },
  {
    transform: "translate(362.9 613.3) rotate(-27) scale(1.14 1)",
    size: 215.36,
  },
  { transform: "translate(494.97 552.82) rotate(12.89)", size: 221.3 },
  { transform: "translate(749.13 611.32) rotate(-23.51)", size: 229.87 },
  {
    transform: "translate(879.85 603.31) rotate(-10.69) skewX(-.06)",
    size: 227.88,
  },
  {
    transform: "translate(1277.7176 499.1043) rotate(-124.6986)",
    size: 294.38,
  },
  { transform: "translate(1229.2239 519.8709) rotate(25.8102)", size: 211.28 },
  { transform: "translate(1462.953 585.0889) rotate(-14.0991)", size: 251.64 },
  {
    transform:
      "translate(1501.5056 499.066) rotate(27.495) scale(1.052 .9962) skewX(-4.7521)",
    size: 257.51,
  },
];
export function PortfolioHero({
  title,
  subtitle,
  welcome,
  motto,
  font,
  ink,
  spacing,
}: HeroProps) {
  const uid = useId().replace(/:/g, "");
  const chars = [...title];
  const standard = chars.length === 9;
  return (
    <section
      className={s.hero}
      style={
        {
          "--hero-ink": ink === "inherit" ? "var(--color-ink)" : ink,
          "--hero-space": `${spacing - 3.4}cqw`,
          "--hero-font": `var(--font-${font})`,
        } as CSSProperties
      }
      aria-label={title}
    >
      <h1 className={s.heading} aria-label={title}>
        <svg
          className={s.art}
          viewBox="169 325 1603 290"
          role="img"
          aria-label={title}
        >
          <defs>
            {chars.map((_, i) => {
              const x = standard ? edges[i] : 169 + (1603 * i) / chars.length;
              const right = standard
                ? edges[i + 1]
                : 169 + (1603 * (i + 1)) / chars.length;
              return (
                <clipPath id={`${uid}-${i}`} key={i}>
                  <rect x={x} y="386" width={right - x} height="178" />
                </clipPath>
              );
            })}
          </defs>
          <g fill="currentColor">
            {chars.map((char, i) => {
              const layout = letters[i % 9];
              return (
                <g key={i} clipPath={`url(#${uid}-${i})`}>
                  <text
                    transform={
                      standard
                        ? layout.transform
                        : `translate(${169 + (1603 * i) / chars.length} 575)`
                    }
                    fontSize={
                      standard ? layout.size : (1603 / chars.length) * 1.2
                    }
                    fontFamily={
                      i === 5 && font === "display"
                        ? "var(--font-accent)"
                        : "var(--hero-font)"
                    }
                  >
                    {char}
                  </text>
                </g>
              );
            })}
          </g>
          <image
            href="/decorations/portfolio-guides.svg"
            x="117"
            y="323"
            width="1696"
            height="298"
            aria-hidden="true"
          />
        </svg>
      </h1>
      <div className={s.captions}>
        <h2>{subtitle}</h2>
        <p>
          {welcome.split("\n").map((x, i) => (
            <span key={i}>{x}</span>
          ))}
        </p>
        <p>{motto}</p>
      </div>
    </section>
  );
}
