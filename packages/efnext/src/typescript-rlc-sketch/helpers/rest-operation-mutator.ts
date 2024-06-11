import { Model, Mutator, MutatorFlow } from "@typespec/compiler";
import { getHttpOperation } from "@typespec/http";
import {
  getHttpParameters,
  hasBodyParameter,
  setBodyParameter,
  setHeaderParameters,
  setQueryParameters,
} from "./http-utils.js";

/**
 * Mutator object to transform operations to REST API requests.
 *
 * @constant
 * @type {Mutator}
 */
export const restOperationMutator: Mutator = {
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

function hasRequiredProperties(model: Model): boolean {
  for (const prop of model.properties.values()) {
    if (!prop.optional) {
      return true;
    }
  }

  return false;
}
