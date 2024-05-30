import { Model, Operation } from "@typespec/compiler";
import { SourceNode } from "../jsx.js";
import { Block } from "./block.js";
export interface FunctionProps {
  operation?: Operation;
  name?: string;
  children?: SourceNode[];
}

export function Function({ operation, name, children }: FunctionProps) {
  if (!children) {
    return (
      <>
        function {name ?? operation!.name} (
        <Function.Parameters parameters={operation!.parameters} />)
        <Block>
          <Function.Body />
        </Block>
      </>
    );
  }
  return null;
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
