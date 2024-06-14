import { EmitContext, Model, Namespace, Operation, Type, navigateType } from "@typespec/compiler";
import {
  EmitOutput,
  SourceDirectory,
  SourceFile,
  emit,
  isDeclaration,
} from "@typespec/efnext/framework";
import { InterfaceDeclaration, typescriptNamePolicy } from "@typespec/efnext/typescript";
import { HttpOperation, getAllHttpServices } from "@typespec/http";
import { RestResource } from "./components/rest-resource.js";
import { HelperContext, StateHelpers, getStateHelpers } from "./helpers/helpers.js";

export async function $onEmit(context: EmitContext) {
  if (context.program.compilerOptions.noEmit) {
    return;
  }

  const tree = emitRlc(context);
  return emit(context, tree);
}

export function emitRlc(context: EmitContext) {
  const helpers = getStateHelpers(context);
  const { restResources, models } = queryProgram(context, helpers);

  const resources = Array.from(restResources.entries());
  return (
    <EmitOutput namePolicy={typescriptNamePolicy}>
      <HelperContext.Provider value={helpers}>
        <SourceDirectory path="src">
          <SourceFile path="models.ts" filetype="typescript">
            {models.map((model) => {
              return <InterfaceDeclaration type={model} />;
            })}
          </SourceFile>
          <SourceFile path="client-definitions.ts" filetype="typescript">
            <InterfaceDeclaration name="Client">
              {resources.map(([path, operations]) => (
                <RestResource path={path} operations={operations} />
              ))}
            </InterfaceDeclaration>
          </SourceFile>
        </SourceDirectory>
      </HelperContext.Provider>
    </EmitOutput>
  );
}

interface RlcRecord {
  restResources: Map<string, HttpOperation[]>;
  models: Model[];
}

function queryProgram({ program }: EmitContext, helpers: StateHelpers): RlcRecord {
  const services = getAllHttpServices(program)[0];
  if (services.length === 0) {
    throw new Error("No service found");
  }

  const service = services[0];
  const modelsInventory = new Map<Namespace, Type[]>();

  // find all models within the service namespace
  // and organize them by the namespace they're in.
  navigateType(
    service.namespace,
    {
      model(m) {
        if (m.namespace?.name === "TypeSpec") {
          return;
        }

        if (!modelsInventory.get(m.namespace!)) {
          modelsInventory.set(m.namespace!, []);
        }

        const ms = modelsInventory.get(m.namespace!)!;
        ms.push(m);
      },
    },
    {}
  );

  const httpOperations = service.operations.map((httpOperation) => {
    const mutated = helpers.toRestOperation(httpOperation.operation);
    const operation = mutated.type as Operation;

    const returnType = operation.returnType;
    if (isDeclaration(operation.returnType) && returnType.kind === "Model") {
      if (!modelsInventory.get(returnType.namespace!)) {
        modelsInventory.set(returnType.namespace!, []);
      }

      const ms = modelsInventory.get(returnType.namespace!)!;
      ms.push(returnType);
    }

    return {
      ...httpOperation,
      operation,
    };
  });

  const restResources = groupByPath(httpOperations);
  const models = [...modelsInventory.values()].flat() as Model[];
  return {
    restResources,
    models,
  };
}

function groupByPath(operations: HttpOperation[]): Map<string, HttpOperation[]> {
  return operations.reduce((acc, operation) => {
    if (!acc.has(operation.path)) {
      acc.set(operation.path, []);
    }
    acc.get(operation.path)!.push(operation);
    return acc;
  }, new Map<string, HttpOperation[]>());
}
