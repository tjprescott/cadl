import { Model } from "@typespec/compiler";
import { Declaration } from "../framework/components/declaration.js";
import { Block } from "./block.js";
import { Reference } from "./reference.js";
import { InterfaceMember } from "./interface-member.js";
import { InterfaceExpression } from "./interface-expression.js";

export interface InterfaceDeclarationProps {
  type: Model;
}

export function InterfaceDeclaration({ type }: InterfaceDeclarationProps) {
  const extendsClause = type.baseModel ? (
    <>
      extends <Reference refkey={type.baseModel} />
    </>
  ) : undefined;

  const members = [];
  
  for (const prop of type.properties.values()) {
    members.push(<InterfaceMember type={prop} />)
  }

  return (
    <Declaration name={type.name} refkey={type}>
      interface {type.name} {extendsClause} <InterfaceExpression type={type} />
    </Declaration>
  );
}
