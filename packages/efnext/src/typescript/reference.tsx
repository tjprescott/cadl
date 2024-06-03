import { ScopeContext } from "../framework/components/scope.js";
import { useContext } from "../framework/core/context.js";

export interface ReferenceProps {
  refkey?: unknown;
}
export async function Reference({ refkey }: ReferenceProps) {
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
  // handle cross-file references
  const basePath = pathDown.map((s) => s.name).join(".");
  return basePath
    ? basePath + "." + targetDeclaration.name
    : targetDeclaration.name;
}