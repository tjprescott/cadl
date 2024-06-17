import { EmitContext, Namespace } from "@typespec/compiler";
import { EmitOutput, emit } from "@typespec/efnext/framework";
import {
  PythonModuleModel,
  PythonPackageModel,
  PythonProject,
  PythonProjectModel,
  pythonNamePolicy,
} from "@typespec/efnext/travis-python";
import { getAllHttpServices } from "@typespec/http";

export async function $onEmit(context: EmitContext) {
  // COMMENT: I would really like lines like this to never
  // be in someone's emitter. The `emit` method should probably
  // just honor this. So much time wasted debugging because
  // we require these lines!
  if (context.program.compilerOptions.noEmit) {
    return;
  }

  // TODO: Need to build the project model
  const projectModel = createProjectModel(context);

  await emit(
    context,
    <EmitOutput namePolicy={pythonNamePolicy}>
      <PythonProject {...projectModel} />
    </EmitOutput>
  );
}

/**
 * Use compiler APIs to construct the PythonProjectModel
 * needed to feed the PythonProject component.
 */
function createProjectModel({ program }: EmitContext): PythonProjectModel {
  const services = getAllHttpServices(program)[0];
  if (services.length === 0) {
    throw new Error("No service found");
  }

  const service = services[0];
  const projectName = service.namespace.name;
  const projectPath = "./";

  // treat all subnamespaces of the service namespace as Python packages.
  const subnamespaces = [...service.namespace.namespaces.values()];
  if (subnamespaces.length === 0) {
    // need to consider if there are top-level models and so on. For now, just error out.
    throw new Error("No subnamespaces found");
  }
  const packages = subnamespaces.map((ns) => createPythonPackage(projectPath, ns));
  return {
    name: projectName,
    path: projectPath,
    version: "0.1.0",
    packages: packages,
  };
}

function createPythonPackage(parentPath: string, ns: Namespace): PythonPackageModel {
  const packagePath = `${parentPath}/${ns.name}`;
  const subpackages = [...ns.namespaces.values()].map((n) => createPythonPackage(packagePath, n));
  const modules: PythonModuleModel[] = [];
  const models = [...ns.models.values(), ...ns.enums.values()];
  if (models.length > 0) {
    modules.push({
      name: "models",
      declarations: models,
    });
  }
  const operations = [...ns.operations.values()];
  if (operations.length > 0) {
    modules.push({
      name: "operations",
      declarations: operations,
    });
    modules.push({
      name: "_operations",
      declarations: operations,
    });
  }
  if (modules.length === 0) {
    throw new Error("No modules found");
  }
  return {
    name: ns.name,
    path: packagePath,
    subpackages: subpackages,
    modules: modules,
  };
}
