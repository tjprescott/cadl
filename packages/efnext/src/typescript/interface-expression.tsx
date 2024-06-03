import { Model } from "@typespec/compiler";
import { Block } from "./block.js";
import { InterfaceMember } from "./interface-member.js";

export interface InterfaceExpressionProps {
  type: Model;
}

export function InterfaceExpression({type}: InterfaceExpressionProps) {
  const members = [];
  
  for (const prop of type.properties.values()) {
    members.push(<InterfaceMember type={prop} />)
  }

  return <Block>
    {members}
  </Block>
}