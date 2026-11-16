import { validationMessage } from "./validation-message";
import { assertShopPages } from "./shop-validation.mjs";
// 校验器由 JSON Schema 预编译，兼容 Cloudflare 禁止动态代码生成的运行环境。
import validate from "./compiled-validation.mjs";
export function assertPage(data: unknown): void {
  if (!validate(data))
    throw new Error(
      "页面配置不符合规范：" +
        validationMessage(
          data,
          Array.isArray(validate.errors) ? validate.errors : [],
        ),
    );
  assertShopPages(data);
  const ids = (data as { content: { props: { id: string } }[] }).content.map(
    (x) => x.props.id,
  );
  if (new Set(ids).size !== ids.length) throw new Error("模块 ID 不得重复");
}
