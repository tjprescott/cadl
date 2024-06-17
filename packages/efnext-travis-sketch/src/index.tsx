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
import path from "path";

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
  const projectPath = path.join(".", projectName);

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
  // join parentPath and ns.name
  const packagePath = path.join(parentPath, ns.name);
  const subpackages = [...ns.namespaces.values()].map((n) => createPythonPackage(packagePath, n));
  const modules: PythonModuleModel[] = [];
  const models = [...ns.models.values(), ...ns.enums.values()];
  if (models.length > 0) {
    modules.push({
      name: "models.py",
      declarations: models,
    });
  }
  const operations = [...ns.operations.values()];
  if (operations.length > 0) {
    modules.push({
      name: "operations.py",
      declarations: operations,
    });
    modules.push({
      name: "_operations.py",
      declarations: operations,
    });
  }
  if (modules.length === 0) {
    throw new Error("No modules found");
  }
  // COMMENT: I really want the namer to be able to accept a raw
  // string and be able to transform it per policy. I tried aquiring
  // the namer here so I could apply the policy, but that crashed. I
  // also don't want to force package to accept a Namespace because you
  // might want some other basis for structuring your Python packages.
  // FIXME: package name needs to be snake_case
  return {
    name: ns.name,
    path: packagePath,
    subpackages: subpackages,
    modules: modules,
  };
}
