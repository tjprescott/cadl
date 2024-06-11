import {
  EmitContext,
  Model,
  ModelProperty,
  Mutator,
  MutatorFlow,
  Operation,
  Realm,
  Type,
  mutateSubgraph,
} from "@typespec/compiler";
import { HttpOperation, getHttpOperation } from "@typespec/http";
import { createContext, useContext } from "../framework/core/context.js";
import { isModel } from "../framework/utils/typeguards.js";

export const HelperContext = createContext<ReturnType<typeof getStateHelpers>>();

export function useHelpers() {
  return useContext(HelperContext)!;
}

export function getStateHelpers(context: EmitContext) {
  return {
    toRestOperation(type: Operation) {
      return mutateSubgraph(context.program, [toRestOperation], type);
    },
  };
}

/**
 * Mutator object to transform operations to REST API requests.
 *
 * @constant
 * @type {Mutator}
 */
const toRestOperation: Mutator = {
  name: "Optionals in options bag",
  Operation: {
    filter() {
      return MutatorFlow.DontRecurse;
    },
    mutate(op, clone, program, realm) {
      const [httpOperation] = getHttpOperation(program, op);

      if (!httpOperation) {
        return;
      }

      let bodyParam: Model | undefined;
      if (hasBodyParameter(httpOperation)) {
        bodyParam = realm.clone(httpOperation.parameters.body!.type as Model);
      }

      const queryParams = getHttpParameters(httpOperation, "query");
      const headerParams = getHttpParameters(httpOperation, "header");

      clone.name = httpOperation.verb;
      clone.parameters.properties.clear();

      if (bodyParam) {
        setBodyParameter(clone, realm, bodyParam);
      }

      if (queryParams.length) {
        setQueryParameters(clone, realm, queryParams);
      }

      if (headerParams.length) {
        setHeaderParameters(clone, realm, headerParams);
      }

      const optionality = hasRequiredProperties(clone.parameters) ? "" : "?";

      clone.parameters.name = `options${optionality}`;
    },
  },
};

function hasBodyParameter(httpOperation: HttpOperation): boolean {
  return Boolean(httpOperation.parameters.body?.type);
}

function hasRequiredProperties(model: Model): boolean {
  for (const prop of model.properties.values()) {
    if (!prop.optional) {
      return true;
    }
  }

  return false;
}

/**
 * Retrieves the parameters of a given type from an HTTP operation.
 *
 * @param {object} httpOperation - The HTTP operation containing parameters.
 * @param {string} type - The type of parameters to retrieve (e.g., "query", "header").
 * @returns {Array} - An array of parameters of the specified type.
 */
export function getHttpParameters(
  httpOperation: HttpOperation,
  type: "query" | "header" | "path"
): ModelProperty[] {
  return httpOperation.parameters.parameters.filter((p) => p.type === type).map((p) => p.param);
}

/**
 * Sets the body parameter for the clone's properties.
 *
 * @param {object} op - The operation to sate the body parameter on.
 * @param {object} realm - The realm to create cloned types.
 * @param {object} bodyParam - The body parameter to set.
 */
function setBodyParameter(op: Operation, realm: Realm, bodyParam: Type): void {
  if (!isModel(bodyParam)) {
    return;
  }

  const optional = !Array.from(bodyParam.properties.values()).some((p) => !p.optional);
  const body = realm.typeFactory.modelProperty("body", bodyParam, { optional });

  op.parameters.properties.set("bodyParameters", body);
}

/**
 * Sets the query parameters on an operation
 *
 * @param {object} op - The operation to append the query parameters to.
 * @param {object} realm - The realm to create cloned types.
 * @param {Array} queryParams - The query parameters to set.
 */
function setQueryParameters(op: Operation, realm: Realm, queryParams: ModelProperty[]): void {
  const clonedQueryParams = queryParams.map((p) => realm.clone(p));
  const optional = !clonedQueryParams.some((p) => !p.optional);
  const query = realm.typeFactory.modelProperty(
    "query",
    realm.typeFactory.model("", clonedQueryParams),
    { optional }
  );
  op.parameters.properties.set("queryParameters", query);
}

/**
 * Sets the header parameters for an operation.
 *
 * @param {object} op - The operation to set the header params on.
 * @param {object} realm - The realm to create cloned types.
 * @param {Array} headerParams - The header parameters to set.
 */
function setHeaderParameters(op: Operation, realm: Realm, headerParams: ModelProperty[]): void {
  const clonedHeaderParams = headerParams.map((p) => realm.clone(p));
  const optional = !clonedHeaderParams.some((p) => !p.optional);
  const headers = realm.typeFactory.modelProperty(
    "headers",
    realm.typeFactory.model("", clonedHeaderParams),
    { optional }
  );
  op.parameters.properties.set("headers", headers);
}
