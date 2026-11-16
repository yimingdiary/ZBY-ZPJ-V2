import s from "./ShopEditor.module.css";
export function GeometryField({
  value,
  onChange,
  labels,
  readOnly,
  title,
}: {
  value: string;
  onChange: (value: string) => void;
  labels: string[];
  readOnly?: boolean;
  title: string;
}) {
  return (
    <label className={s.combinedField}>
      <strong>{title}</strong>
      <input
        aria-label={title}
        type="text"
        value={String(value || "").replaceAll("|", "/")}
        readOnly={readOnly}
        placeholder={labels.join("/")}
        onChange={(event) => onChange(event.target.value.replaceAll("/", "|"))}
      />
    </label>
  );
}
