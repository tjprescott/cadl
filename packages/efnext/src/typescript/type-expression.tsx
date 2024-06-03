import { Type } from "@typespec/compiler";
import { Reference } from "./reference.js";
import { TypeLiteral } from "./type-literal.js";
import { InterfaceExpression } from "./interface-expression.js";

export interface TypeExpressionProps {
  type: Type;
}

export function TypeExpression({ type }: TypeExpressionProps) {
  if ("name" in type && type.name) {
    // TODO: better isDeclaration check
    return <Reference refkey={type} />
  }
  

  switch(type.kind) {
    case "Boolean":
    case "Number":
    case "String":
     return <TypeLiteral type={type} />;
    case "Model":
      return <InterfaceExpression type={type} />
    default:
      throw new Error(type.kind + " not supported in TypeExpression");
  }
}