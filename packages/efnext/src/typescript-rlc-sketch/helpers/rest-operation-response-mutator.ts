import { Interface, ModelProperty, Mutator, Namespace } from "@typespec/compiler";
import { getHttpOperation } from "@typespec/http";

/**
 * Mutator object to transform an operation result to REST API response.
 *
 * @constant
 * @type {Mutator}
 */
export const restResponseMutator: Mutator = {
  name: "rest-operation-response-mutator",
  Operation: {
    mutate(op, clone, program, realm) {
      const [httpOperation] = getHttpOperation(program, op);

      if (!httpOperation) {
        return;
      }

      // Each operation may have multiple responses with different status codes, and for each status code, there may be different response bodies based on content-type.
      const httpResponses = httpOperation.responses;

      for (const httpResponse of httpResponses) {
        const statusCode = httpResponse.statusCodes;
        if (typeof statusCode !== "number") {
          // TODO?
          console.warn("Skipping not numeric status codes...", statusCode);
          continue;
        }

        for (const httpResponseContent of httpResponse.responses) {
          // Here we are at a unique combination of status code and content type.
          // We can now create a model based on the response body.
          // Start by creating the new return type model.
          const containerName = getContainerFullName(httpOperation.container);
          //TODO: Add string to identify by contentType
          //TODO: Add naming policy
          const responseModelName = `${containerName}${httpOperation.verb}${statusCode}Response`;

          const responseProperties: ModelProperty[] = [];

          if (httpResponseContent.body?.type) {
            responseProperties.push(
              realm.typeFactory.modelProperty("body", realm.clone(httpResponseContent.body?.type))
            );
          }

          const httpHeaders = httpResponseContent.headers;
          if (httpHeaders) {
            const responseHeaders: ModelProperty[] = [];
            for (const key in httpHeaders) {
              const header = httpHeaders[key];
              responseHeaders.push(realm.typeFactory.modelProperty(key, realm.clone(header)));
            }

            responseProperties.push(
              realm.typeFactory.modelProperty(
                "headers",
                realm.typeFactory.model("", responseHeaders)
              )
            );
          }

          const response = realm.typeFactory.model(responseModelName, responseProperties);
          clone.returnType = response;
        }
      }
    },
  },
};

function getContainerFullName(container: Interface | Namespace | undefined): string {
  if (!container) {
    return "";
  }

  const containerName = container.name;
  // TODO: Handle casing
  return getContainerFullName(container.namespace) + containerName;
}
