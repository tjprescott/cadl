import { ComponentChildren } from "#jsx/jsx-runtime";
import { Interface, Model } from "@typespec/compiler";
import { Declaration } from "../framework/components/declaration.js";
import { isModel } from "../framework/utils/typeguards.js";
import { InterfaceExpression } from "./interface-expression.js";
import { Reference } from "./reference.js";

export interface InterfaceDeclarationProps {
  type?: Model | Interface;
  name?: string;
  children?: ComponentChildren;
}

export function InterfaceDeclaration({ type, name, children }: InterfaceDeclarationProps) {
  let extendsClause = undefined;
  const ifaceName = name ?? type!.name;

  if (type && isModel(type) && type.baseModel) {
    extendsClause = (
      <>
        extends <Reference refkey={type.baseModel} />
      </>
    );
  }

  return (
    <Declaration name={ifaceName} refkey={type}>
      interface {ifaceName} {extendsClause}{" "}
      <InterfaceExpression type={type}>{children}</InterfaceExpression>
    </Declaration>
  );
}
