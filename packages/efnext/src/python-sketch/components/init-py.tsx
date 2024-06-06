import { code } from "../../framework/core/code.js";
import { AppFolderRecord } from "./app-folder.js";

export interface InitPyProps {
  folder: AppFolderRecord;
}
/**
 * Creates an InitPy for a folder.
 * Todo: could be more generalized by using <Reference> to get the type names, which would
 * allow us to change the emitting names at any point.
 */
export function InitPy({ folder }: InitPyProps) {
  let imports = [];
  let all = [];

  for (const subfolder of folder.subfolders) {
    imports.push(`from .${subfolder.path} import *`);
    all.push(subfolder.path);
  }

  if (folder.types.length > 0) {
    const typeNames = folder.types.map((t) => t.name);
    imports.push(`from models import ${typeNames.join(",")}`);
    all = all.concat(typeNames);
  }

  if (folder.operations.length > 0) {
    const opNames = folder.operations.map((t) => t.name);
    imports.push(`from operations import ${opNames.join(",")}`);
    all = all.concat(opNames);
  }

  return code`
    ${imports.join("\n")}
    
    __all__ = [
      ${all.map((v) => `"${v}"`).join("\n") /**Probably need to fix this in code? */}
    ]

  `;
}
