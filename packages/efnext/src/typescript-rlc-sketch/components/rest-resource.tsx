import { ComponentChildren } from "#jsx/jsx-runtime";
import { Operation } from "@typespec/compiler";
import { HttpOperation } from "@typespec/http";
import { code } from "../../framework/core/code.js";
import { FunctionDeclaration } from "../../typescript/function-declaration.js";
import { InterfaceMember } from "../../typescript/interface-member.js";
import { getHttpParameters, useHelpers } from "../helpers.js";

export interface RestResourceProps {
  path: string;
  operations: HttpOperation[];
  children?: ComponentChildren;
}

export function RestResource({ path, operations, children }: RestResourceProps) {
  const helpers = useHelpers();
  const pathParameters = getHttpParameters(operations[0], "path");
  return (
    <>
      {code`
      (path: "${path}", ${(<FunctionDeclaration.Parameters parameters={pathParameters} />)}): {
        ${operations.map(({ operation }) => {
          const restOperation = helpers.toRestOperation(operation).type as Operation;
          return <InterfaceMember type={restOperation} />;
        })}
      };
    `}
      {children}
    </>
  );
}
