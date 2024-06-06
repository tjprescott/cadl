import { ComponentChildren, SourceNode } from "#jsx/jsx-runtime";
import { Model, Operation } from "@typespec/compiler";
import { Declaration } from "../framework/components/declaration.js";
import { Scope } from "../framework/components/scope.js";
import { Block } from "./block.js";
import { TypeExpression } from "./type-expression.js";

export interface FunctionProps {
  type?: Operation;
  refkey?: unknown;
  name?: string;
  parameters?: Record<string, string>;
  children?: ComponentChildren;
}

export function Function({ type, parameters, name, children }: FunctionProps) {
  const functionName = name ?? type!.name;

  const parametersChild = children?.find((child) => (child as any).type === Function.Parameters);
  const bodyChild = children?.find((child) => (child as any).type === Function.Body);

  const sReturnType = type?.returnType ? <TypeExpression type={type.returnType} /> : undefined;
  const sParams = parametersChild ? (
    parametersChild
  ) : (
    <Function.Parameters type={type?.parameters} parameters={parameters} />
  );

  let sBody = bodyChild ? bodyChild : <Function.Body>{children}</Function.Body>;

  return (
    <Declaration name={functionName} refkey={type}>
      function {functionName} ({sParams}) {sReturnType}
      <Block>{sBody}</Block>
    </Declaration>
  );
}

export interface FunctionParametersProps {
  type?: Model;
  parameters?: Record<string, string>;
  children?: SourceNode[];
}

Function.Parameters = function Parameters({ type, parameters, children }: FunctionParametersProps) {
  if (children) {
    return children;
  } else if (parameters) {
    return Object.entries(parameters).map(([key, value]) => [key, ":", value, ","])
  } else {
    const params = Array.from(type?.properties.values() ?? []);
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
