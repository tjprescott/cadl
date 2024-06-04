import { SourceNode } from "#jsx/jsx-runtime";
import { BinderContext, ModuleScope } from "../core/binder.js";
import { createContext, useContext } from "../core/context.js";
import { useResolved } from "../core/use-resolved.js";
import { ScopeContext } from "./scope.js";

export interface SourceFileProps {
  path: string;
  children?: SourceNode[];
}

interface ImportRecord {
  importPath: string;
  name: string;
}

interface SourceFileState {
  imports: Map<string, ImportRecord[]>;
  addImport(record: ImportRecord): void;
  scope: ModuleScope;
}

export const SourceFileContext = createContext<SourceFileState>();

export function SourceFile({ path, children }: SourceFileProps) {
  const binder = useContext(BinderContext);
  if (!binder) {
    throw new Error("Scope requires binder context");
  }
  const scope = binder.createModuleScope(path);
  const imports: Map<string, ImportRecord[]> = new Map()
  const sourceFileState: SourceFileState = {
    scope,
    imports,
    addImport(record) {
      if (!imports.has(record.importPath)) {
        imports.set(record.importPath, []);
      }
      const records = imports.get(record.importPath)!;
      records.push(record);
    }
  }
  const ImportContainer = useResolved(() => {
    let importString = "";
    for(const [importPath, records] of imports) {
      importString += `import {${records.map(r => r.name).join(",")}} from "${importPath.replace(/\.ts$/, ".js")}"\n`;
    }

    return <>{importString}</>;
  })

  return <SourceFileContext.Provider value={sourceFileState}>
    <br />// File {path}<br />
    <ImportContainer />
    <ScopeContext.Provider value={scope}>
      {children}
    </ScopeContext.Provider>;
  </SourceFileContext.Provider>
}
