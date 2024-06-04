import { ScopeContext } from "../framework/components/scope.js";
import { SourceFileContext } from "../framework/components/source-file.js";
import { useContext } from "../framework/core/context.js";

export interface ReferenceProps {
  refkey?: unknown;
}
export async function Reference({ refkey }: ReferenceProps) {
  const sourceFile = useContext(SourceFileContext);
  const scope = useContext(ScopeContext);
  if (!scope) {
    throw new Error("Need scope context to form references");
  }
  const binder = scope.binder;

  const result = await binder.resolveOrWaitForDeclaration(scope, refkey);
  if (!result.resolved) {
    throw new Error("Failed to resolve");
  }
  

  const {targetDeclaration, pathDown } = result;
  if (pathDown.length > 0 && pathDown[0].kind === "module") {
    sourceFile!.addImport({ importPath: pathDown[0].path, name: targetDeclaration.name });
  }
  
  return targetDeclaration.name;
}