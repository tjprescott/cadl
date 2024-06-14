import { SourceDirectory, SourceFile } from "../framework/components/index.js";
import { PythonModule, PythonModuleProps } from "./python-module.js";

/** A Python package is basically a SourceDirectory with an __init__ file.
 * Packages and subpackages should correspond to Namespaces and subnamespaces in the TypeSpec.
 * Every package will have an __init__.py file.
 */
export interface PythonPackageProps {
  name: string;
  path: string;
  subpackages?: PythonPackageProps[];
  modules?: PythonModuleProps[];
}
export function PythonPackage({ name, path, subpackages, modules }: PythonPackageProps) {
  const packageComponents = subpackages?.map((pkg) => <PythonPackage {...pkg} />);
  const moduleComponents = modules?.map((mod) => <PythonModule {...mod} />);
  const folderPath = `${path}/${name}`;
  const initPath = `${folderPath}/__init__.py`;
  // TODO: Make components for each of these key files?
  return (
    <SourceDirectory path={folderPath}>
      <SourceFile path={initPath} filetype="python"></SourceFile>
      {packageComponents}
      {moduleComponents}
    </SourceDirectory>
  );
}
