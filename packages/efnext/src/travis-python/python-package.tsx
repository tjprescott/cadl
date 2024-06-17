import * as pathLib from "path";
import { SourceDirectory, SourceFile } from "../framework/components/index.js";
import { PythonModule, PythonModuleModel } from "./python-module.js";

/** A Python package is basically a SourceDirectory with an __init__ file.
 * Packages and subpackages should correspond to Namespaces and subnamespaces in the TypeSpec.
 * Every package will have an __init__.py file.
 */
export interface PythonPackageModel {
  name: string;
  path: string;
  subpackages?: PythonPackageModel[];
  modules?: PythonModuleModel[];
}
export function PythonPackage({ name, path, subpackages, modules }: PythonPackageModel) {
  const packageComponents = subpackages?.map((pkg) => <PythonPackage {...pkg} />);
  const moduleComponents = modules?.map((mod) => <PythonModule {...mod} />);
  const initPath = pathLib.join(path, "__init__.py");
  // TODO: Make components for each of these key files?
  return (
    <SourceDirectory path={path}>
      {packageComponents}
      <SourceFile path={initPath} filetype="python" />
      {moduleComponents}
    </SourceDirectory>
  );
}
