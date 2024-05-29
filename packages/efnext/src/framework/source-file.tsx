import { SourceNode } from "#jsx/jsx-runtime";

export interface SourceFileProps {
  path: string;
  children?: SourceNode[];
}
export function SourceFile({ path, children }: SourceFileProps) {
  const p = new Promise((resolve) => {
    setTimeout(() => {
      resolve("hi");
    }, 1000);
  });

  return (
    <>
      File path: {path}
      {p}
    </>
  );
}
