import { ModelProperty } from "@typespec/compiler";
import { TypeExpression } from "./type-expression.js";

export interface InterfaceMemberProps {
  type: ModelProperty;
}

export function InterfaceMember({ type }: InterfaceMemberProps) {
  return <>
    {type.name}: <TypeExpression type={type.type} />;
  </>
}