import { Render, type Data } from "@puckeditor/core";
import { config, type Modules } from "./registry";
import { assertPage } from "../content/validate";
export function Page({ data }: { data: unknown }) {
  assertPage(data);
  return <Render<typeof config> config={config} data={data as Data<Modules>} />;
}
