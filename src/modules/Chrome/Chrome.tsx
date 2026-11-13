import { useEffect, useRef, type ReactNode } from "react";
import s from "./Chrome.module.css";
import { attachPhotoshopFrame } from "../../design/photoshop-frame";
export function Chrome({
  children,
  enabled = true,
}: {
  children: ReactNode;
  enabled?: boolean;
}) {
  const frame = useRef<HTMLObjectElement>(null);
  // Puck 的 React 预览在自己的 iframe 中挂载；正式静态页由 Astro 小脚本初始化。
  useEffect(() => {
    if (enabled && frame.current) return attachPhotoshopFrame(frame.current);
  }, [enabled]);
  return (
    <>
      <div
        data-page-scroll=""
        data-photoshop-workspace={enabled ? "" : undefined}
        className={enabled ? s.workspace : s.bare}
      >
        <div className={enabled ? s.canvas : s.clean}>{children}</div>
        {enabled && (
          <object
            ref={frame}
            className={s.overlay}
            type="image/svg+xml"
            data="/decorations/ps-yemian.svg"
            data-photoshop-frame=""
            aria-label="Photoshop 外壳"
            tabIndex={0}
          />
        )}
      </div>
    </>
  );
}
