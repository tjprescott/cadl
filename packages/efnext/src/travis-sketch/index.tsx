import { EmitOutput, emit } from "#typespec/emitter/core";
import { EmitContext } from "@typespec/compiler";
import { pythonNamePolicy } from "../travis-python/naming-policy.js";
import { PythonProject } from "../travis-python/python-project.js";

export async function $onEmit(context: EmitContext) {
  // COMMENT: I would really like lines like this to never
  // be in someone's emitter. The `emit` method should probably
  // just honor this. So much time wasted debugging because
  // we require these lines!
  if (context.program.compilerOptions.noEmit) {
    return;
  }

  // TODO: Need to build the project model

  await emit(
    context,
    <EmitOutput namePolicy={pythonNamePolicy}>
      <PythonProject name={""} path={""} version={""} packages={[]} />
    </EmitOutput>
  );
}

// // use compiler APIs to assemble this structure.
// function queryApp({ program }: EmitContext) {
//   // todo: ignoring diagnostics for now
//   const services = getAllHttpServices(program)[0];
//   if (services.length === 0) {
//     throw new Error("No service found");
//   }

//   const service = services[0];
//   const models = new Map<Namespace, Type[]>();

//   // find all models within the service namespace
//   // and organize them by the namespace they're in.
//   function emitType(type: Model | Enum | Union) {
//     if (!models.get(type.namespace!)) {
//       models.set(type.namespace!, []);
//     }

//     const ms = models.get(type.namespace!)!;
//     ms.push(type);
//   }

//   navigateType(
//     service.namespace,
//     {
//       model: emitType,
//       enum: emitType,
//       union: emitType,
//     },
//     {}
//   );

//   return getFolderForNamespace(program, service.namespace, "./", models);
// }

// function getFolderForNamespace(
//   program: Program,
//   namespace: Namespace,
//   path: string,
//   models: Map<Namespace, Type[]>
// ): AppFolderRecord {
//   const rootFolder: AppFolderRecord = {
//     path,
//     types: findTypesInNamespace(namespace, models),
//     moduleName: namespace.name,
//     operations: [...namespace.operations.values()],
//     subfolders: [...namespace.namespaces.values()].map((n) =>
//       getFolderForNamespace(program, n, n.name, models)
//     ),
//   };

//   return rootFolder;
// }

// function findTypesInNamespace(root: Namespace, models: Map<Namespace, Type[]>) {
//   return (models.get(root) as Model[]) ?? [];
// }
