import { EmitContext, MutatableType, Operation, Realm, mutateSubgraph } from "@typespec/compiler";
import { createContext, useContext } from "../../framework/core/context.js";
import { restOperationMutator } from "./rest-operation-mutator.js";
import { restResponseMutator } from "./rest-operation-response-mutator.js";

export const HelperContext = createContext<ReturnType<typeof getStateHelpers>>();

export function useHelpers() {
  return useContext(HelperContext)!;
}

export interface MutateResult {
  type: MutatableType;
  realm: Realm | null;
}
export interface StateHelpers {
  toRestOperation(type: Operation): MutateResult;
}

export function getStateHelpers(context: EmitContext): StateHelpers {
  return {
    toRestOperation(type: Operation): MutateResult {
      return mutateSubgraph(context.program, [restOperationMutator, restResponseMutator], type);
    },
  };
}
