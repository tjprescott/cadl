import { ModelProperty } from "@typespec/compiler";
import { TypeExpression } from "./type-expression.js";

export interface ClassMemberProps {
  type: ModelProperty;
}

export function ClassMember({ type }: ClassMemberProps) {
  return (
    <>
      {type.name}: <TypeExpression type={type.type} />
      <br />
    </>
  );
}
