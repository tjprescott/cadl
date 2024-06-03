import { SourceNode } from "#jsx/jsx-runtime";
import { Scope } from "./scope.js";

export interface SourceFileProps {
  path: string;
  children?: SourceNode[];
}

export function SourceFile({ path, children }: SourceFileProps) {
  return <Scope name={path}>{children}</Scope>;
}
