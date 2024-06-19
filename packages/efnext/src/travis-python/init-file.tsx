import { ComponentChild } from "#jsx/jsx-runtime";
import { SourceFile, useNamePolicy } from "#typespec/emitter/core";
import { PythonPackageModel } from "./python-package.js";

export interface InitFileModel {
  packages?: PythonPackageModel[];
  children?: ComponentChild[];
}

export function InitFile({ packages, children }: InitFileModel) {
  const namer = useNamePolicy();
  const packageNames = packages?.map((pkg) => {
    return pkg.name ?? namer.getName(pkg.type, "package");
  });
  let imports = "";
  let all = "";
  if (packageNames && packageNames.length > 0) {
    imports = `from . import ${packageNames.join(", ")}\n`;
    all = `__all__ = [${packageNames.map((x) => `"${x}"`).join(", ")}]\n`;
  }
  return (
    <SourceFile path="__init__.py" filetype="python">
      {imports}
      {all}
    </SourceFile>
  );
}
