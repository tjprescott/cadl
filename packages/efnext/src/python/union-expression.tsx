import { Union } from "@typespec/compiler";
import { TypeExpression } from "./type-expression.js";
import { Reference } from "./reference.js";
import { stdlib } from "./builtins.js";

export interface UnionExpressionProps {
  type: Union;
}

export function UnionExpression({ type }: UnionExpressionProps) {
  const variants = Array.from(type.variants.values());

  return (
    <>
      <Reference builtin={stdlib.typing.Union} />[
      {variants.map((variant, index) => {
        const isLast = index === variants.length - 1;
        return (
          <>
            <TypeExpression type={variant.type} />{!isLast && ", "}
          </>
        );
      })}
      ]
    </>
  );
}
