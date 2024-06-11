import { ComponentChildren, SourceNode } from "#jsx/jsx-runtime";
import { Model, ModelProperty, Operation } from "@typespec/compiler";
import { Declaration } from "../framework/components/declaration.js";
import { code } from "../framework/core/code.js";
import { Block } from "./block.js";
import { TypeExpression } from "./type-expression.js";

export interface FunctionDeclarationProps {
  type?: Operation;
  refkey?: unknown;
  name?: string;
  parameters?: Record<string, string>;
  children?: ComponentChildren;
}

function coerceArray(v: unknown): any {
  if (v === null || v === undefined || Array.isArray(v)) {
    return v;
  }

  return [v];
}

export function FunctionDeclaration({
  type,
  parameters,
  name,
  refkey,
  children,
}: FunctionDeclarationProps) {
  const functionName = name ?? type!.name;

  const parametersChild = coerceArray(children)?.find(
    (child: any) => child.type === FunctionDeclaration.Parameters
  );
  const bodyChild = coerceArray(children)?.find(
    (child: any) => child.type === FunctionDeclaration.Body
  );

  // Filter out parametersChild and bodyChild from children
  const filteredChildren = coerceArray(children)?.filter(
    (child: any) => child !== parametersChild && child !== bodyChild
  );

  const sReturnType = type?.returnType ? (
    <>
      :<TypeExpression type={type.returnType} />
    </>
  ) : undefined;
  const sParams = parametersChild ? (
    parametersChild
  ) : (
    <FunctionDeclaration.Parameters type={type?.parameters} parameters={parameters} />
  );

  let sBody = bodyChild ? (
    bodyChild
  ) : (
    <FunctionDeclaration.Body>{filteredChildren}</FunctionDeclaration.Body>
  );

  return (
    <Declaration name={functionName} refkey={refkey ?? type}>
      function {functionName} ({sParams}) {sReturnType}
      <Block>{sBody}</Block>
    </Declaration>
  );
}

export interface FunctionParametersProps {
  type?: Model;
  parameters?: Record<string, string> | ModelProperty[];
  children?: SourceNode[];
}

FunctionDeclaration.Parameters = function Parameters({
  type,
  parameters,
  children,
}: FunctionParametersProps) {
  if (children) {
    return children;
  } else if (parameters) {
    if (Array.isArray(parameters)) {
      return buildParameters(parameters);
    }
    return Object.entries(parameters).map(([key, value]) => [key, ":", value, ","]);
  } else {
    const params = Array.from(type?.properties.values() ?? []);
    return <WrappingParameter type={type}>{buildParameters(params)}</WrappingParameter>;
  }
};

function buildParameters(params: ModelProperty[]): SourceNode[] {
  return params.map((param, index) => {
    const isLast = index === params.length - 1;
    const optionality = param.optional ? "?" : "";
    return (
      <>
        {param.name}
        {optionality}: <TypeExpression type={param.type} />
        {!isLast ? ", " : ""}
      </>
    );
  });
}

function WrappingParameter({ type, children }: { type?: Model; children?: ComponentChildren }) {
  if (!type || !type.name) {
    return <>{children}</>;
  }

  const paramName = type.name; // TODO: rename
  return code`
  ${paramName}: {${children}}
  `;
}

export interface FunctionBodyProps {
  operation?: Operation;
  children?: SourceNode[];
}

FunctionDeclaration.Body = function Body({ operation, children }: FunctionBodyProps) {
  return children;
};
