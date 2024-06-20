import { ComponentChild } from "#jsx/jsx-runtime";
import { ModelProperty } from "@typespec/compiler";
import { code, useNamePolicy } from "../framework/core/index.js";
import { TypeExpression } from "./type-expression.js";
import { mapWithSep } from "./utils.js";

export interface InitializerModel {
  type: ModelProperty[];
  children?: ComponentChild[];
}

export function Initializer({ type, children }: InitializerModel) {
  // don't render __init__ if there are no variables
  if (type.length === 0 && !children) {
    return undefined;
  }
  const namer = useNamePolicy();

  // FIXME: This should be typed kwargs-only like a method signature.
  const signature = mapWithSep(
    type,
    (param) => (
      <>
        {param.name}: <TypeExpression type={param.type} />
      </>
    ),
    ", "
  );

  // COMMENT: This syntax feels *very* unnecessarily verbose! It wouldn't work
  // when I tried to use code`...` because it says it needs to return ComponentChild,
  // not ComponentChildren
  const variables = mapWithSep(
    type,
    (prop) => {
      const propName = namer.getName(prop, "classMember");
      return (
        <>
          self.{propName} = {propName}
        </>
      );
    },
    "\n"
  );

  return code`
    def __init__(self, *, ${signature}):\n
      ${variables}
      ${children}
  `;
}
