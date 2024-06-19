import { EmitContext, Namespace } from "@typespec/compiler";
import { EmitOutput, emit } from "@typespec/efnext/framework";
import {
  CollectedTypes,
  PythonModuleModel,
  PythonPackageModel,
  PythonProject,
  PythonProjectModel,
  TypeCollector,
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
      <PythonProject {...projectModel}></PythonProject>
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
  const serviceNamespaceName = service.namespace.name;
  const collector = new TypeCollector(service.namespace);
  const grouped = collector.groupByNamespace() as Map<string, CollectedTypes>;

  const projectName = serviceNamespaceName;
  const projectPath = path.join(".", projectName);

  // // treat all subnamespaces of the service namespace as Python packages.
  // const subnamespaces = [...service.namespace.namespaces.values()];
  // if (subnamespaces.length === 0) {
  //   // need to consider if there are top-level models and so on. For now, just error out.
  //   throw new Error("No subnamespaces found");
  // }
  // const packages = subnamespaces.map((ns) => createPythonPackage(ns));
  const packages: PythonPackageModel[] = [];
  for (const [nsName, types] of grouped.entries()) {
    const ns = collector.namespaceForName(nsName);
    if (ns) {
      packages.push(createPythonPackage(ns, types));
    }
  }
  return {
    name: projectName,
    path: projectPath,
    version: "0.1.0",
    packages: packages,
  };
}

function createPythonPackage(ns: Namespace, data: CollectedTypes): PythonPackageModel {
  const modules: PythonModuleModel[] = [];
  const models = [...data.models.values(), ...data.enums.values()];
  if (models.length > 0) {
    modules.push({
      name: "models.py",
      types: models,
    });
  }
  const operations = [...data.operations.values()];
  if (operations.length > 0) {
    modules.push({
      name: "operations.py",
      types: operations,
    });
    modules.push({
      name: "_operations.py",
      types: operations,
    });
  }
  return {
    type: ns,
    modules: modules,
  };
}
