import { Interface, Model, ModelProperty, Operation } from "@typespec/compiler";
import { isInterface, isModel } from "../framework/utils/typeguards.js";
import { Block } from "./block.js";
import { InterfaceMember } from "./interface-member.js";

export interface InterfaceExpressionProps {
  type: Model | Interface;
}

export function InterfaceExpression({ type }: InterfaceExpressionProps) {
  const members = [];
  let typeMembers: IterableIterator<ModelProperty | Operation> | undefined;

  if (isModel(type)) {
    typeMembers = type.properties.values();
  } else if (isInterface(type)) {
    typeMembers = type.operations.values();
  }

  for (const prop of typeMembers ?? []) {
    members.push(<InterfaceMember type={prop} />);
  }

  return <Block>{members}</Block>;
}
