import { ModelProperty, Operation } from "@typespec/compiler";
import { isModelProperty, isOperation } from "../framework/utils/typeguards.js";
import { Function } from "./function.js";
import { TypeExpression } from "./type-expression.js";

export interface InterfaceMemberProps {
  type: ModelProperty | Operation;
}

export function InterfaceMember({ type }: InterfaceMemberProps) {
  if (isModelProperty(type)) {
    return (
      <>
        "{type.name}": <TypeExpression type={type.type} />;
      </>
    );
  }

  if (isOperation(type)) {
    return (
      <>
        {type.name}(<Function.Parameters parameters={type.parameters} />
        ): <TypeExpression type={type.returnType} />;
      </>
    );
  }
}
