import { ComponentChildren } from "#jsx/jsx-runtime";
import { HttpOperation } from "@typespec/http";
import { code } from "../../framework/core/code.js";
import { FunctionDeclaration } from "../../typescript/function-declaration.js";
import { InterfaceMember } from "../../typescript/interface-member.js";
import { getHttpParameters } from "../helpers/http-utils.js";

export interface RestResourceProps {
  path: string;
  operations: HttpOperation[];
  children?: ComponentChildren;
}

export function RestResource({ path, operations, children }: RestResourceProps) {
  // Since we get a list of operation grouped by path, we can assume that all operations have the same path parameters
  const pathParameters = getHttpParameters(operations[0], "path");
  return (
    <>
      {code`
      (path: "${path}", ${(<FunctionDeclaration.Parameters parameters={pathParameters} />)}): {
        ${operations.map(({ operation }) => {
          return <InterfaceMember type={operation} />;
        })}
      };
    `}
      {children}
    </>
  );
}
