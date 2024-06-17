import { ScopeContext } from "../framework/components/scope.js";
import { SourceFileContext } from "../framework/components/source-file.js";
import { useContext } from "../framework/core/context.js";

export interface ReferenceModel {
  refkey?: unknown;
  // COMMENT: The format here is confusing. Maybe a named tuple or object?
  builtin?: readonly [string, string] | [string, string];
}

// COMMENT: It would be great if the framework could provide this if there are only a
// few patterns that languages follow. But maybe this is just "the one tricky bit" that
// a language library author needs to provide and we can simply provide good examples.
export async function Reference({ refkey, builtin }: ReferenceModel) {
  // COMMENT: This line seems a little like magic.
  const sourceFile = useContext(SourceFileContext);
  if (!sourceFile) {
    throw new Error("Need source file context to form references");
  }

  // COMMENT: Okay, I see what this is doing, but it seems weird to me.
  // Could we simply register a set of builtins we can reference and then
  // Reference just resolves them normally?
  if (builtin) {
    sourceFile.addImport({ importPath: builtin[0], name: builtin[1] });
    return builtin[1];
  }

  // COMMENT: Oh, now I am confused! What is this doing?
  const scope = useContext(ScopeContext);
  if (!scope) {
    throw new Error("Need scope context to form references");
  }
  const binder = scope.binder;

  const result = await binder.resolveOrWaitForDeclaration(scope, refkey);
  if (!result.resolved) {
    throw new Error("Failed to resolve");
  }

  const { targetDeclaration, pathDown } = result;
  if (pathDown.length > 0 && pathDown[0].kind === "module") {
    sourceFile.addImport({ importPath: pathDown[0].path, name: targetDeclaration.name });
  }
  return targetDeclaration.name;
}
