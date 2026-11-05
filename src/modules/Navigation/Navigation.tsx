import s from "./Navigation.module.css";
export type NavigationProps = {
  version: 1;
  brand: string;
  items: { label: string; href: string }[];
  motto: string;
};
export function Navigation({ brand, items, motto }: NavigationProps) {
  return (
    <header className={s.nav}>
      <a className={s.brand} href="/">
        {brand.split("\n").map((line, i) => (
          <span key={i}>{line}</span>
        ))}
      </a>
      <nav aria-label="作品分类">
        {items.map((item, i) =>
          item.href ? (
            <a href={item.href} key={i}>
              {item.label}
            </a>
          ) : (
            <span key={i}>{item.label}</span>
          ),
        )}
      </nav>
      <span className={s.motto}>
        {motto}
        <span>↙</span>
      </span>
    </header>
  );
}
