import { SourceDirectory, SourceFile } from "../framework/components/index.js";
import { PythonPackage, PythonPackageProps } from "./python-package.js";

/**
 * A Python project is a collection of Python packages and packaging metadata.
 * {path}/{project_name}/
 * |-- LICENSE
 * |-- pyproject.toml
 * |-- README.md
 * |-- setup.py
 * |-- src/
 *     |-- {package_name}/
 *     |   |-- __init__.py
 *     |   |-- {module_name}.py
 *     |-- {package_name}/
 *         |-- __init__.py
 *         |-- {module_name}.py
 */
export interface PythonProjectProps {
  name: string;
  path: string;
  version: string;
  packages: PythonPackageProps[];
}
export function PythonProject({ name, path, version, packages }: PythonProjectProps) {
  const packageComponents = packages.map((pkg) => <PythonPackage {...pkg} />);
  // TODO: Make components for each of these key files? Also, add necessary file types.
  return (
    <SourceDirectory path={path}>
      <SourceFile path="pyproject.toml" filetype="python" />
      <SourceFile path="LICENSE" filetype="python" />
      <SourceFile path="README.md" filetype="python" />
      <SourceFile path="setup.py" filetype="python" />
      <SourceDirectory path="{path}/src">{packageComponents}</SourceDirectory>
    </SourceDirectory>
  );
}
