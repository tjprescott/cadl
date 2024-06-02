import { ScopeContext } from "../framework/components/scope.js";
import { useContext } from "../framework/core/context.js";

export interface ReferenceProps {
  refkey?: unknown;
}
export function Reference({ refkey }: ReferenceProps) {
  const scope = useContext(ScopeContext);
  if (!scope) {
    throw new Error("Need scope context to form references");
  }
  const binder = scope.binder;

  const {targetDeclaration, pathDown } = binder.resolveDeclarationByKey(scope, refkey);
  // handle cross-file references.
  const basePath = pathDown.map((s) => s.name).join(".");
  return basePath
    ? basePath + "." + targetDeclaration.name
    : targetDeclaration.name;
}