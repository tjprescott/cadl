import { ComponentChild } from "#jsx/jsx-runtime";
import { ModelProperty } from "@typespec/compiler";
import { code, useNamePolicy } from "../framework/core/index.js";
import { mapWithSep } from "./utils.js";

export interface InitializerModel {
  type: ModelProperty[];
  children?: ComponentChild[];
}

export function Initializer({ type, children }: InitializerModel) {
  // don't render __init__ if there are no instance variables
  if (type.length === 0 && !children) {
    return undefined;
  }
  const namer = useNamePolicy();
  // COMMENT: This syntax feels *very* unnecessarily verbose! It wouldn't work
  // when I tried to use code`...` because it says it needs to return ComponentChild,
  // not ComponentChildren
  const instanceVariables = mapWithSep(
    type,
    (prop) => {
      const propName = namer.getName(prop, "classMember");
      return (
        <>
          self.{propName} = kwargs.get('{propName}', None)
        </>
      );
    },
    "\n"
  );

  return code`
    def __init__(self, **kwargs):\n
      ${instanceVariables}
      ${children}
  `;
}
