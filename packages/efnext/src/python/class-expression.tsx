import { ComponentChildren } from "#jsx/jsx-runtime";
import { Model, ModelProperty } from "@typespec/compiler";
import { code } from "../framework/core/code.js";
import { isModel } from "../framework/utils/typeguards.js";
import { ClassMember } from "./class-member.js";

export interface ClassExpressionProps {
  type: Model;
  children?: ComponentChildren;
}

export function ClassExpression({ type, children }: ClassExpressionProps) {
  const members = [];
  let typeMembers: IterableIterator<ModelProperty> | undefined;

  if (isModel(type)) {
    typeMembers = type.properties.values();
  }

  for (const prop of typeMembers ?? []) {
    members.push(<ClassMember type={prop} />);
  }

  if (children) {
    members.push(children);
  }

  return code`
    ${members}
  `;
}
