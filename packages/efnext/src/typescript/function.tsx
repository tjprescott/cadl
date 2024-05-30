import { SourceNode } from "#jsx/jsx-runtime";
import { Model, Operation } from "@typespec/compiler";
import { Block } from "./block.js";
export interface FunctionProps {
  operation?: Operation;
  name?: string;
  children?: SourceNode[];
}

export function Function({ operation, name, children }: FunctionProps) {
  const functionName = name ?? operation!.name;
  const parameters = operation?.parameters;
  if (!children) {
    return (
      <>
        function {functionName} (
        <Function.Parameters parameters={parameters} />)
        <Block>
          <Function.Body />
        </Block>
      </>
    );
  }

  // Changed this to handle then the Function actually get the parameters and body as children
  return (
    <>
      function {functionName}(
      {children?.filter((child) => (child as any).type === Function.Parameters)}){" "}
      <Block>{children?.filter((child) => (child as any).type === Function.Body)}</Block>
    </>
  );
}

export interface FunctionParametersProps {
  parameters?: Model;
  children?: SourceNode[];
}

Function.Parameters = function Parameters({ parameters, children }: FunctionParametersProps) {
  if (children) {
    return children;
  } else {
    return <></>;
    // do the default thing.
  }
};

export interface FunctionBodyProps {
  operation?: Operation;
  children?: SourceNode[];
}

Function.Body = function Body({ operation, children }: FunctionBodyProps) {
  return children;
};
