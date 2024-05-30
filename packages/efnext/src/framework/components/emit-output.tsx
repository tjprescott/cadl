import { SourceNode } from "#jsx/jsx-runtime";

export function EmitOutput({ children }: { children?: SourceNode[] }) {
  return <>{children}</>;
}
