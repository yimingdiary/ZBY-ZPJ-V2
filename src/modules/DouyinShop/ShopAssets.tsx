import { createContext, useContext } from "react";
import { ImagePicker } from "../../editor/ImagePicker";
export const ShopAssetContext = createContext("");
export const folderForShop = (slug: string) => {
  const match = /^crocs-(\d{1,2})-(\d{2})-(\d{2})-(\d{2})$/.exec(slug || "");
  return match
    ? `Crocs-Kids_2026_${match[1].padStart(2, "0")}-${match[2]}_${match[3]}-${match[4]}`
    : slug || "";
};
export function ShopImagePicker(props: {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}) {
  const project = useContext(ShopAssetContext);
  return <ImagePicker {...props} namespace="shop" project={project} />;
}
