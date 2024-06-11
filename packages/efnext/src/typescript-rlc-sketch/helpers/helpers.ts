import { EmitContext, Operation, mutateSubgraph } from "@typespec/compiler";
import { createContext, useContext } from "../../framework/core/context.js";
import { restOperationMutator } from "./rest-operation-mutator.js";

export const HelperContext = createContext<ReturnType<typeof getStateHelpers>>();

export function useHelpers() {
  return useContext(HelperContext)!;
}

export function getStateHelpers(context: EmitContext) {
  return {
    toRestOperation(type: Operation) {
      return mutateSubgraph(context.program, [restOperationMutator], type);
    },
  };
}
