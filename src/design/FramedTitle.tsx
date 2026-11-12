import { useEffect, useRef } from "react";
import { useDecorationVisibility } from "./DecorationVisibility";
import { attachTitleFrame } from "./title-frame";
export function FramedTitle({ title }: { title: string }) {
  const decorated = useDecorationVisibility();
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (ref.current) return attachTitleFrame(ref.current);
  }, [title, decorated]);
  return (
    <h2 aria-label={title}>
      <svg
        ref={ref}
        data-framed-title=""
        viewBox="0 -90 570 110"
        role="img"
        aria-label={title}
        style={{
          display: "block",
          height: "1.43em",
          width: "7.36em",
          overflow: "visible",
          fontFamily: "var(--font-display)",
          letterSpacing: 0,
        }}
      >
        <text x="0" y="0" fontSize="100">
          {title}
        </text>
        {decorated && (
          <image
            href="/decorations/about-guides.svg"
            preserveAspectRatio="none"
            aria-hidden="true"
          />
        )}
      </svg>
    </h2>
  );
}
