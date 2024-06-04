import { Union } from "@typespec/compiler";
import { TypeExpression } from "./type-expression.js";

export interface UnionExpressionProps {
  type: Union;
}

export function UnionExpression({ type }: UnionExpressionProps) {
  const variants = Array.from(type.variants.values());

  return (
    <>
      {variants.map((variant, index) => {
        const isLast = index === variants.length - 1;
        return (
          <>
            <TypeExpression type={variant.type} /> {!isLast && " | "}
          </>
        );
      })}
    </>
  );
}
