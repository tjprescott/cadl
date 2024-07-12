import { Union } from "@typespec/compiler";
import { TypeExpression } from "./type-expression.js";
import { mapWithSep } from "./utils.js";

export interface UnionExpressionModel {
  type: Union;
}

export function UnionExpression({ type }: UnionExpressionModel) {
  // TODO: We need to ensure that `Union` is imported from typing
  const values = Array.from(type.variants.values());
  const variantComponents = mapWithSep(
    values,
    (variant) => {
      return <TypeExpression type={variant.type} />;
    },
    ", "
  );
  return <>Union[{variantComponents}]</>;
}
