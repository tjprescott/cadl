import { ModelProperty } from "@typespec/compiler";
import { useNamePolicy } from "../framework/core/index.js";
import { TypeExpression } from "./type-expression.js";

export interface ClassVariableProps {
  /** The TypeSpec type this understands */
  type: ModelProperty;
}

export function ClassVariable({ type }: ClassVariableProps) {
  const namer = useNamePolicy();
  const name = namer.getName(type, "classMember");
  // TODO: Some way to configure whether you actually want types
  // Python doesn't require them.

  return (
    <>
      {name}: <TypeExpression type={type.type} />
    </>
  );
}
