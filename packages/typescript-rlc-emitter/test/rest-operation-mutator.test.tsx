import { Model, ModelProperty, Operation, mutateSubgraph } from "@typespec/compiler";
import { assert, describe, it } from "vitest";
import { restOperationMutator } from "../src/helpers/rest-operation-mutator.js";
import { getProgram } from "./test-host.js";

describe("e2e operation mutator", () => {
  describe("non-http operations", () => {
    //TODO: Find a good way to tell if an operation is an http operation
    it.skip("should not mutate operation if not http", async () => {
      const program = await getProgram(
        `
        namespace DemoService;
  
        interface A {
          foo(): Widget;
        }
  
        model Widget {
          name: string;
        }
          `
      );

      const namespace = Array.from(program.getGlobalNamespaceType().namespaces.values()).filter(
        (n) => n.name === "DemoService"
      )[0];

      const iface = Array.from(namespace.interfaces.values()).find((i) => i.name === "A")!;
      const operation = Array.from(iface.operations.values())[0];

      const { type } = mutateSubgraph(program, [restOperationMutator], operation);
      const mutatedOperation = type as Operation;

      assert.equal(mutatedOperation.name, "foo");
    });
  });
  describe("parameters mutation", () => {
    it("should handle body when is named but not decorated", async () => {
      const program = await getProgram(
        `
        import "@typespec/http";
  
        using TypeSpec.Http;
        @service({
          title: "Widget Service",
        })
        namespace DemoService;
  
        @route("/widgets")
        @tag("Widgets")
        interface A {
          @post create(param: Widget): Widget;
        }
  
        model Widget {
          name: string;
        }
          `,
        { libraries: ["Http"] }
      );

      const namespace = Array.from(program.getGlobalNamespaceType().namespaces.values()).filter(
        (n) => n.name === "DemoService"
      )[0];
      const iface = Array.from(namespace.interfaces.values()).find((i) => i.name === "A")!;
      const operation = Array.from(iface.operations.values())[0];

      const { type } = mutateSubgraph(program, [restOperationMutator], operation);
      const mutatedOperation = type as Operation;

      const parameters = Array.from(mutatedOperation.parameters.properties.values());

      assert.equal(mutatedOperation.name, "post");
      assert.equal(parameters.length, 1);
      assert.equal(parameters[0].name, "body");

      const body = parameters[0].type as Model;
      assert.equal(body.properties.size, 1);
      // When the body is not decorated, the body is an anonymous model with the parameters listed in the operation
      // in this case {body: {param: Widget}}
      assert.isDefined(body.properties.get("param") as ModelProperty);
    });

    it("should only have body property", async () => {
      const program = await getProgram(
        `
        import "@typespec/http";
  
        using TypeSpec.Http;
        @service({
          title: "Widget Service",
        })
        namespace DemoService;
  
        @route("/widgets")
        @tag("Widgets")
        interface A {
          @post create(...Widget): Widget;
        }
  
        model Widget {
          name: string;
        }
          `,
        { libraries: ["Http"] }
      );

      const namespace = Array.from(program.getGlobalNamespaceType().namespaces.values()).filter(
        (n) => n.name === "DemoService"
      )[0];
      const iface = Array.from(namespace.interfaces.values()).find((i) => i.name === "A")!;
      const operation = Array.from(iface.operations.values())[0];

      const { type } = mutateSubgraph(program, [restOperationMutator], operation);
      const mutatedOperation = type as Operation;

      const parameters = Array.from(mutatedOperation.parameters.properties.values());

      assert.equal(mutatedOperation.name, "post");
      assert.equal(parameters.length, 1);
      assert.equal(parameters[0].name, "body");

      const body = parameters[0].type as Model;
      assert.equal(body.name, "");
      assert.equal(body.properties.size, 1);
      assert.isDefined(body.properties.get("name") as ModelProperty);
    });

    it("should only correctly create body, header and query properties", async () => {
      const program = await getProgram(
        `
        import "@typespec/http";
  
        using TypeSpec.Http;
        @service({
          title: "Widget Service",
        })
        namespace DemoService;
  
        @route("/widgets")
        @tag("Widgets")
        interface A {
          @post create(...Widget): Widget;
        }
  
        model Widget {
          name: string;
          @query filter: string;
          @header requestId: string;
        }
          `,
        { libraries: ["Http"] }
      );

      const namespace = Array.from(program.getGlobalNamespaceType().namespaces.values()).filter(
        (n) => n.name === "DemoService"
      )[0];
      const iface = Array.from(namespace.interfaces.values()).find((i) => i.name === "A")!;
      const operation = Array.from(iface.operations.values())[0];

      const { type } = mutateSubgraph(program, [restOperationMutator], operation);
      const mutatedOperation = type as Operation;

      const parameters = Array.from(mutatedOperation.parameters.properties.values());

      assert.equal(mutatedOperation.name, "post");
      assert.equal(parameters.length, 3);

      const bodyParam = parameters.find((p) => p.name === "body")!;
      assert.isDefined(bodyParam);

      const bodyProperties = Array.from((bodyParam.type as Model).properties.values());
      assert.equal(bodyProperties.length, 1);
      assert.equal(bodyProperties[0].name, "name");

      const queryParam = parameters.find((p) => p.name === "queryParameters")!;
      assert.isDefined(queryParam);

      const queryProperties = Array.from((queryParam.type as Model).properties.values());
      assert.equal(queryProperties.length, 1);
      assert.equal(queryProperties[0].name, "filter");

      const headerParam = parameters.find((p) => p.name === "headers")!;
      assert.isDefined(headerParam);

      const headerProperties = Array.from((headerParam.type as Model).properties.values());
      assert.equal(headerProperties.length, 1);
      assert.equal(headerProperties[0].name, "requestId");
    });
  });
});
