import { ModelProperty, Operation } from "@typespec/compiler";
import { useNamePolicy } from "../framework/core/name-policy.js";
import { isModelProperty, isOperation } from "../framework/utils/typeguards.js";
import { FunctionDeclaration } from "./function-declaration.js";
import { TypeExpression } from "./type-expression.js";

export interface InterfaceMemberProps {
  type: ModelProperty | Operation;
}

export function InterfaceMember({ type }: InterfaceMemberProps) {
  const namer = useNamePolicy();
  const name = namer.getName(type, "interfaceMember");
  if (isModelProperty(type)) {
    return (
      <>
        "{name}"{type.optional && "?"}: <TypeExpression type={type.type} />;
      </>
    );
  }

  if (isOperation(type)) {
    return (
      <>
        {name}(<FunctionDeclaration.Parameters type={type.parameters} />
        ): <TypeExpression type={type.returnType} />;
      </>
    );
  }
}
