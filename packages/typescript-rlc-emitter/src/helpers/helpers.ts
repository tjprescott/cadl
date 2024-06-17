import {
  EmitContext,
  MutatableType,
  Operation,
  Realm,
  Type,
  mutateSubgraph,
} from "@typespec/compiler";
import { createContext, useContext } from "@typespec/efnext/framework";
import { restOperationMutator } from "./rest-operation-mutator.js";
import { restResponseMutator } from "./rest-operation-response-mutator.js";
import { TypeTrackingGroup, createTypeTracker } from "./type-tracker.js";

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
  getVisitedTypes(): Map<TypeTrackingGroup, Set<Type>>;
}

export function getStateHelpers(context: EmitContext): StateHelpers {
  const typeTracker = createTypeTracker();
  return {
    toRestOperation(type: Operation): MutateResult {
      return mutateSubgraph(
        context.program,
        [restOperationMutator(typeTracker), restResponseMutator(typeTracker)],
        type
      );
    },
    getVisitedTypes() {
      return typeTracker.getTracked();
    },
  };
}
