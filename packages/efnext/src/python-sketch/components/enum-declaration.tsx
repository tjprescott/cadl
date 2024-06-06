import { ComponentChildren } from "#jsx/jsx-runtime";
import { Enum } from "@typespec/compiler";
import { Declaration } from "../../framework/components/declaration.js";
import { code } from "../../framework/core/code.js";
import { EnumExpression } from "./enum-expression.js";

export interface EnumDeclarationProps {
  type: Enum;
  children?: ComponentChildren;
}

export function EnumDeclaration({ type, children }: EnumDeclarationProps) {
  const members = [...type.members.values()];

  // TODO: do we need to import: from enum import Enum?
  return (
    <Declaration name={type.name!} refkey={type}>
      {code`
      class {type.name}(Enum):
      ${members.map((member) => <EnumExpression type={member} />)}
      {children}
      `}
    </Declaration>
  );
}
