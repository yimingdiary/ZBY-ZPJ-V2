import { useRef, useState } from "react";
import type { Hotspot } from "./ShopPage";
import s from "./ShopEditor.module.css";
export function HotspotField({
  value,
  onChange,
  readOnly,
  image,
}: {
  value: Hotspot[];
  onChange: (spots: Hotspot[]) => void;
  readOnly?: boolean;
  image?: string;
}) {
  const [selected, setSelected] = useState(-1),
    [drawing, setDrawing] = useState(false);
  const drag = useRef<{
    x: number;
    y: number;
    index: number;
    mode: "draw" | "move" | "resize";
    spot: Hotspot;
  } | null>(null);
  const area = useRef<HTMLDivElement>(null);
  const source = image;
  const point = (e: React.PointerEvent) => {
    const b = area.current!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(100, ((e.clientX - b.left) / b.width) * 100)),
      y: Math.max(0, Math.min(100, ((e.clientY - b.top) / b.height) * 100)),
    };
  };
  const patch = (index: number, p: Partial<Hotspot>) =>
    onChange(value.map((h, i) => (i === index ? { ...h, ...p } : h)));
  return (
    <div className={s.hotspots}>
      <button
        type="button"
        disabled={readOnly || !source || value.length >= 50}
        onClick={() => {
          setDrawing(!drawing);
          setSelected(-1);
        }}
      >
        {drawing ? "结束框选" : "框选新热区"}
      </button>
      {source && (
        <div
          ref={area}
          className={s.hotspotCanvas}
          style={{ cursor: drawing ? "crosshair" : "default" }}
          onPointerDown={(e) => {
            if (readOnly) return;
            const target = (e.target as HTMLElement).closest<HTMLElement>(
              "[data-spot]",
            );
            const p = point(e);
            let index = Number(target?.dataset.spot ?? -1);
            let spot = value[index];
            let mode: "draw" | "move" | "resize" = target
              ? (e.target as HTMLElement).dataset.resize
                ? "resize"
                : "move"
              : "draw";
            if (!target && !drawing) return;
            if (mode === "draw") {
              index = value.length;
              spot = { ...p, width: 0, height: 0, action: "url", target: "" };
              onChange([...value, spot]);
            }
            setSelected(index);
            drag.current = { ...p, index, spot: { ...spot }, mode };
            e.currentTarget.setPointerCapture(e.pointerId);
            e.preventDefault();
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d) return;
            const p = point(e),
              dx = p.x - d.x,
              dy = p.y - d.y;
            const next =
              d.mode === "draw"
                ? {
                    x: Math.min(p.x, d.x),
                    y: Math.min(p.y, d.y),
                    width: Math.abs(dx),
                    height: Math.abs(dy),
                  }
                : d.mode === "move"
                  ? {
                      x: Math.max(
                        0,
                        Math.min(100 - d.spot.width, d.spot.x + dx),
                      ),
                      y: Math.max(
                        0,
                        Math.min(100 - d.spot.height, d.spot.y + dy),
                      ),
                    }
                  : {
                      width: Math.max(
                        1,
                        Math.min(100 - d.spot.x, d.spot.width + dx),
                      ),
                      height: Math.max(
                        1,
                        Math.min(100 - d.spot.y, d.spot.height + dy),
                      ),
                    };
            patch(d.index, next);
          }}
          onPointerUp={() => {
            drag.current = null;
          }}
          onPointerCancel={() => {
            drag.current = null;
          }}
        >
          <img src={source} alt="框选热区参考图" draggable={false} />
          {value.map((h, i) => (
            <div
              data-spot={i}
              key={i}
              className={s.spot}
              style={{
                left: `${h.x}%`,
                top: `${h.y}%`,
                width: `${h.width}%`,
                height: `${h.height}%`,
                borderColor: i === selected ? "#ff9500" : "#0071e3",
              }}
            >
              <span>{i + 1}</span>
              <i data-resize="true" />
            </div>
          ))}
        </div>
      )}
      {value.map((h, i) => (
        <details key={i} open={i === selected}>
          <summary onClick={() => setSelected(i)}>热区 {i + 1}</summary>
          <label>
            动作
            <select
              disabled={readOnly}
              value={h.action}
              onChange={(e) =>
                patch(i, { action: e.target.value as Hotspot["action"] })
              }
            >
              <option value="url">打开网址</option>
              <option value="project">打开店铺作品</option>
              <option value="switch">换一换</option>
            </select>
          </label>
          {h.action !== "switch" && (
            <label>
              {h.action === "project" ? "店铺标识" : "目标网址"}
              <input
                disabled={readOnly}
                value={h.target}
                onChange={(e) => patch(i, { target: e.target.value })}
              />
            </label>
          )}
          <div className={s.coordinates}>
            {(["x", "y", "width", "height"] as const).map((key) => (
              <label key={key}>
                {{ x: "左%", y: "上%", width: "宽%", height: "高%" }[key]}
                <input
                  type="number"
                  min="0"
                  max="100"
                  step=".1"
                  disabled={readOnly}
                  value={Number(h[key].toFixed(2))}
                  onChange={(e) => patch(i, { [key]: Number(e.target.value) })}
                />
              </label>
            ))}
          </div>
          <button
            type="button"
            disabled={readOnly}
            onClick={() => onChange(value.filter((_, n) => i !== n))}
          >
            删除热区
          </button>
        </details>
      ))}
    </div>
  );
}
