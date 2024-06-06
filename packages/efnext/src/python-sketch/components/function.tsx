import { SourceNode } from "#jsx/jsx-runtime";
import { Model, Operation } from "@typespec/compiler";
import { Declaration } from "../../framework/components/declaration.js";
import { code } from "../../framework/core/code.js";
import { TypeExpression } from "./type-expression.js";

export interface FunctionProps {
  type?: Operation;
  name?: string;
  children?: SourceNode[];
}

export function Function({ type: operation, name, children }: FunctionProps) {
  // todo: take an Operation type and emit an empty function based on that.
  const functionName = name ?? operation!.name;
  const parameters = operation?.parameters;
  // Gets the return type of the function
  const typeExpression = operation?.returnType ? (
    code`
    -> ${(<TypeExpression type={operation.returnType} />)}
    `
  ) : (
    <></>
  );

  if (!children) {
    return (
      <Declaration name={functionName} refkey={operation}>
        {code`
          def ${functionName} (${(<Function.Parameters parameters={parameters} />)})${typeExpression}:
            ${(<Function.Body />)}
        `}
      </Declaration>
    );
  }

  return <>{children}</>;
}

export interface FunctionParametersProps {
  parameters?: Model;
  children?: SourceNode[];
}

Function.Parameters = function Parameters({ parameters, children }: FunctionParametersProps) {
  if (children) {
    return children;
  } else {
    const params = Array.from(parameters?.properties.values() ?? []);
    return (
      <>
        {params.map((param, index) => {
          const isLast = index === params.length - 1;
          const optionality = param.optional ? "?" : "";
          return (
            <>
              {param.name}
              {optionality}: <TypeExpression type={param.type} />
              {!isLast ? ", " : ""}
            </>
          );
        })}
      </>
    );
  }
};

export interface FunctionBodyProps {
  operation?: Operation;
  children?: SourceNode[];
}

Function.Body = function Body({ operation, children }: FunctionBodyProps) {
  return children;
};
