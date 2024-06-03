import { Type } from "@typespec/compiler";
import { Declaration } from "../framework/components/declaration.js";
import { InterfaceDeclaration } from "./interface-declaration.js";

export interface TypeDeclarationProps {
  type: Type,
}

export function TypeDeclaration({ type }: TypeDeclarationProps) {
  let declaration;

  switch (type.kind) {
    case "Model":
      return <InterfaceDeclaration type={type} />;
    default:
      throw new Error("Not yet supported");
  }
}

