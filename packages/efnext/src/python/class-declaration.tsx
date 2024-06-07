import { ComponentChildren } from "#jsx/jsx-runtime";
import { Model } from "@typespec/compiler";
import { Declaration } from "../framework/components/declaration.js";
import { code } from "../framework/core/code.js";
import { ClassExpression } from "./class-expression.js";

export interface ClassDeclarationProps {
  type: Model;
  name?: string;
  children?: ComponentChildren;
}

export function ClassDeclaration({ type, name, children }: ClassDeclarationProps) {
  const className = name ?? type.name;
  return (
    <Declaration name={className} refkey={type}>
      {code`
        class ${className}:
          ${(<ClassExpression type={type} />)}
      `}
    </Declaration>
  );
}
