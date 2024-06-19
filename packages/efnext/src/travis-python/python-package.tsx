import { ComponentChild } from "#jsx/jsx-runtime";
import { useNamePolicy } from "#typespec/emitter/core";
import { Namespace } from "@typespec/compiler";
import { SourceDirectory } from "../framework/components/index.js";
import { InitFile } from "./init-file.js";
import { PythonModule, PythonModuleModel } from "./python-module.js";

/** A Python package is basically a SourceDirectory with an __init__ file.
 * Packages and subpackages should correspond to Namespaces and subnamespaces in the TypeSpec.
 * Every package will have an __init__.py file.
 */
export interface PythonPackageModel {
  type: Namespace;
  name?: string;
  subpackages?: PythonPackageModel[];
  modules?: PythonModuleModel[];
  children?: ComponentChild[];
}
export function PythonPackage({ type, name, subpackages, modules, children }: PythonPackageModel) {
  const packageComponents = subpackages?.map((pkg) => <PythonPackage {...pkg} />);
  const moduleComponents = modules?.map((mod) => <PythonModule {...mod} />);
  const namer = useNamePolicy();
  const packageName = name ?? namer.getName(type, "package");
  // TODO: Make components for each of these key files?
  // TODO: Check if components are already supplied by children
  return (
    <SourceDirectory path={packageName}>
      <InitFile packages={subpackages} />
      {packageComponents}
      {moduleComponents}
      {children}
    </SourceDirectory>
  );
}
