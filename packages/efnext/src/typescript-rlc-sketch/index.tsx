import { EmitContext, Model } from "@typespec/compiler";
import { HttpOperation, getAllHttpServices } from "@typespec/http";
import { EmitOutput } from "../framework/components/emit-output.js";
import { SourceDirectory } from "../framework/components/source-directory.js";
import { SourceFile } from "../framework/components/source-file.js";
import { emit } from "../framework/core/emit.js";
import { InterfaceDeclaration } from "../typescript/interface-declaration.js";
import { RestResource } from "./components/rest-resource.js";
import { HelperContext, getStateHelpers } from "./helpers.js";

export async function $onEmit(context: EmitContext) {
  if (context.program.compilerOptions.noEmit) {
    return;
  }

  const tree = emitRlc(context);
  return emit(context, tree);
}

export function emitRlc(context: EmitContext) {
  const { restResources, models } = queryProgram(context);
  const helpers = getStateHelpers(context);

  const resources = Array.from(restResources.entries());
  return (
    <EmitOutput>
      <HelperContext.Provider value={helpers}>
        <SourceDirectory path="src">
          <SourceFile path="client-definitions.ts" filetype="typescript">
            <InterfaceDeclaration name="Client">
              {resources.map(([path, operations]) => (
                <RestResource path={path} operations={operations} />
              ))}
            </InterfaceDeclaration>
          </SourceFile>
          <SourceFile path="models.ts" filetype="typescript">
            {models.map((model) => (
              <InterfaceDeclaration type={model} />
            ))}
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

function queryProgram({ program }: EmitContext): RlcRecord {
  const services = getAllHttpServices(program)[0];
  if (services.length === 0) {
    throw new Error("No service found");
  }

  const service = services[0];
  const restResources = groupByPath(service.operations);
  const models = Array.from(service.namespace.models.values());

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
