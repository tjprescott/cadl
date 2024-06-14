import { Type } from "@typespec/compiler";
import { SourceFile } from "../framework/components/index.js";

type Declaration = Type & { name: string };

/**
 * A Python Module is basically a SourceFile which contains declarations. It will
 * basically contain the declarations that belong in the given TypeSpec namespace.
 */
export interface PythonModuleProps {
  name: string;
  declarations: Declaration[];
}
export function PythonModule({ name, declarations }: PythonModuleProps) {
  return (
    <SourceFile path="models.py" filetype="python">
      {declarations}
    </SourceFile>
  );
}
