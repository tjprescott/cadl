import { Enum, Model, Operation } from "@typespec/compiler";
import { SourceFile } from "../framework/components/index.js";
import { ClassDeclaration } from "./class-declaration.js";
import { FunctionDeclaration } from "./function-declaration.js";

/**
 * A Python Module is basically a SourceFile which contains declarations. It will
 * basically contain the declarations that belong in the given TypeSpec namespace.
 */
export interface PythonModuleModel {
  name: string;
  types: (Model | Enum | Operation)[];
}
export function PythonModule({ name, types }: PythonModuleModel) {
  const typeComponents: any[] = [];
  for (const item of types) {
    switch (item.kind) {
      case "Model":
        typeComponents.push(<ClassDeclaration type={item} />);
        break;
      case "Operation":
        typeComponents.push(<FunctionDeclaration type={item} />);
        break;
      case "Enum":
        // TODO: Support enums
        break;
      default:
        break;
    }
  }
  return (
    <SourceFile path={name} filetype="python">
      {typeComponents}
    </SourceFile>
  );
}
