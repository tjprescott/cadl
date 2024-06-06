import { EmitContext, Namespace, Program } from "@typespec/compiler";
import { getAllHttpServices } from "@typespec/http";
import { EmitOutput } from "../framework/components/index.js";
import { emit } from "../framework/core/emit.js";
import { AppFolder, AppFolderRecord } from "./components/app-folder.js";
import { namePolicy } from "./naming-policy.js";

export async function $onEmit(context: EmitContext) {
  // queryApp walks the type graph and assembles the AppFolder structure.
  const rootFolder = queryApp(context);
  await emit(
    context,
    <EmitOutput namePolicy={namePolicy}>
      <AppFolder folder={rootFolder} />
    </EmitOutput>
  );
}

// use compiler APIs to assemble this structure.
function queryApp({ program }: EmitContext) {
  // todo: ignoring diagnostics for now
  const services = getAllHttpServices(program)[0];
  if (services.length === 0) {
    throw new Error("No service found");
  }

  const service = services[0];

  return getFolderForNamespace(program, service.namespace, "./");
}

function getFolderForNamespace(
  program: Program,
  namespace: Namespace,
  path: string
): AppFolderRecord {
  const rootFolder: AppFolderRecord = {
    path,
    types: findTypesInNamespace(namespace),
    moduleName: namespace.name,
    operations: [...namespace.operations.values()],
    subfolders: [...namespace.namespaces.values()].map((n) =>
      getFolderForNamespace(program, n, n.name)
    ),
  };

  return rootFolder;
}

function findTypesInNamespace(root: Namespace) {
  return [...root.models.values()];
  // const types: (Type & { name: string })[] = [];

  // function appendType(type: Type) {
  //   // todo: fix array handling here.
  //   if ("name" in type && typeof type.name === "string" && type.name !== "Array") {
  //     types.push(type as any);
  //   }
  // }

  // navigateType(
  //   root,
  //   {
  //     model: appendType,
  //     namespace(n) {
  //       if (n !== root) {
  //         return ListenerFlow.NoRecursion;
  //       }
  //       return undefined;
  //     },
  //   },
  //   {}
  // );

  // return types;
}
