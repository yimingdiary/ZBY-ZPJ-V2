import s from "./OverlayGallery.module.css";
export type OverlayGalleryProps = {
  version: 1;
  title: string;
  subtitle: string;
  category: string;
  items: { src: string; alt: string }[];
};
export function OverlayGallery(p: OverlayGalleryProps) {
  return (
    <section id="overlay" className={s.gallery} aria-label="贴片设计作品">
      <header className={s.header}>
        <div>
          <h2>{p.title}</h2>
          <p className={s.subtitle}>{p.subtitle}</p>
        </div>
        <p className={s.category}>{p.category}</p>
      </header>
      <div className={s.grid}>
        {p.items.map((item, i) => (
          <figure key={i}>
            <img
              src={item.src}
              alt={item.alt}
              width="1080"
              height="1920"
              loading="lazy"
              decoding="async"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
