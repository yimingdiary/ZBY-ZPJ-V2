import { usePuck } from "@puckeditor/core";
import { ShopAssetContext, ShopImagePicker, folderForShop } from "./ShopAssets";
import { ShopPageField } from "./ShopPageField";
export function ShopWorkField({
  name,
  kind,
  value,
  onChange,
  readOnly,
}: {
  name: string;
  kind: "cover" | "page";
  value: any;
  onChange: (value: any) => void;
  readOnly?: boolean;
}) {
  const { selectedItem: selected } = usePuck();
  const index = Number(
    name.match(/items\[(\d+)\]/)?.[1] ?? name.match(/items\.(\d+)/)?.[1] ?? 0,
  );
  const item = selected?.props.items?.[index];
  const project = item?.page?.assetFolder || folderForShop(item?.slug);
  return kind === "cover" ? (
    <ShopAssetContext.Provider value={project}>
      <ShopImagePicker value={value} onChange={onChange} readOnly={readOnly} />
    </ShopAssetContext.Provider>
  ) : (
    <ShopPageField
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      project={project}
    />
  );
}
