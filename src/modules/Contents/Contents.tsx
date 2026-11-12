import { FramedTitle } from "../../design/FramedTitle";
import { useDecorationVisibility } from "../../design/DecorationVisibility";
import s from "./Contents.module.css";
export type ContentsProps = {
  version: 1;
  title: string;
  subtitle: string;
  items: {
    letter: string;
    number: string;
    label: string;
    english: string;
    href: string;
  }[];
};
const centers = [371, 755, 1145, 1535];
const textX = [320.38, 688.06, 1079.1877, 1470.0291];
const numberX = [405.45, 772.74, 1166.2043, 1561.7175];
const labelX = [314.4, 699.09, 1088.3621, 1485.4438];
export function Contents(p: ContentsProps) {
  const decorated = useDecorationVisibility();
  return (
    <section id="contents" className={s.contents} aria-label="作品目录">
      <header className={s.header}>
        <FramedTitle title={p.title} />
        <p>{p.subtitle}</p>
      </header>
      <div className={s.items}>
        {p.items.map((item, i) => {
          const slot = i % 4,
            center = centers[slot];
          const card = (
            <>
              <svg
                className={s.card}
                viewBox={`${center - 110} 450 220 220`}
                aria-label={`${item.letter}${item.number} ${item.label}`}
                role="img"
              >
                <text
                  x={textX[slot]}
                  y="575.36"
                  fontSize="97.34"
                  fontFamily="var(--font-display)"
                >
                  {item.letter}
                </text>
                <text
                  x={numberX[slot]}
                  y="575.36"
                  fontSize="51.26"
                  fontFamily="var(--font-display)"
                >
                  {item.number}
                </text>
                <text
                  x={labelX[slot]}
                  y="624.97"
                  fontSize="28"
                  fontFamily="var(--font-body)"
                >
                  {item.label}
                </text>
                {decorated && (
                  <image
                    href={`/decorations/contents-${slot + 1}-guides.svg`}
                    x={center - 110}
                    y="450"
                    width="220"
                    height="220"
                  />
                )}
              </svg>
              <span className={s.english}>{item.english}</span>
            </>
          );
          return item.href ? (
            <a className={s.item} href={item.href} key={i}>
              {card}
            </a>
          ) : (
            <div className={s.item} key={i}>
              {card}
            </div>
          );
        })}
      </div>
    </section>
  );
}
