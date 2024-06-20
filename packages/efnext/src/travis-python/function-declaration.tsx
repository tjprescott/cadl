import { ComponentChild } from "#jsx/jsx-runtime";
import { useNamePolicy } from "#typespec/emitter/core";
import { Operation } from "@typespec/compiler";
import { code } from "../framework/core/code.js";
import { TypeExpression } from "./type-expression.js";
import { mapWithSep } from "./utils.js";

export interface FunctionDeclarationModel {
  type: Operation;
  name?: string;
  children?: ComponentChild[];
}

export function FunctionDeclaration({ type, name, children }: FunctionDeclarationModel) {
  const namer = useNamePolicy();
  const functionName = name ?? namer.getName(type, "function");
  const signature = mapWithSep(
    type.parameters.properties.values(),
    (param) => (
      <>
        {param.name}: <TypeExpression type={param.type} />
      </>
    ),
    ", "
  );
  return code`
    def ${functionName}(${signature}):
      ${children}
  `;
}
