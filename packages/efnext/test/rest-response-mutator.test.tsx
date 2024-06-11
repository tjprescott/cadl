import { Operation, mutateSubgraph } from "@typespec/compiler";
import { describe, it } from "vitest";
import { restResponseMutator } from "../src/typescript-rlc-sketch/helpers/rest-response-mutator.js";
import { getProgram } from "./test-host.js";

describe("e2e operation mutator", () => {
  it("should mutate operation if http", async () => {
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
        @get foo(): Widget;
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

    const { type } = mutateSubgraph(program, [restResponseMutator], operation);
    const mutatedOperation = type as Operation;

    console.log((mutatedOperation.returnType as any).name);
  });
});
