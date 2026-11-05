import s from "./Footer.module.css";
export type FooterProps = { version: 1; years: string; category: string };
export function Footer({ years, category }: FooterProps) {
  return (
    <footer className={s.footer}>
      <span>◎{years}</span>
      <span>{category}</span>
    </footer>
  );
}
