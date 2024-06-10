import { EmitContext } from "@typespec/compiler";
import { describe, it } from "vitest";
import { printFormatted, render } from "../src/framework/core/render.js";
import { emitRlc } from "../src/typescript-rlc-sketch/index.js";
import { getProgram } from "./test-host.js";

describe("e2e typescript rlc emitter", () => {
  it("", async () => {
    const program = await getProgram(
      `
          import "@typespec/http";

          using TypeSpec.Http;
          @service({
            title: "Widget Service",
          })
          namespace DemoService;

          model Widget {
            @visibility("read", "update")
            @path
            id: string;

            weight: int32;
            color: "red" | "blue";
          }

          @error
          model Error {
            code: int32;
            message: string;
          }

          @route("/widgets")
          @tag("Widgets")
          interface Widgets {
            @get list(): Widget[] | Error;
            @get read(@path id: string): Widget | Error;
            @post create(...Widget, @query foo: string): Widget | Error;
            @patch update(...Widget): Widget | Error;
            @delete delete(@path id: string): void | Error;
            @route("{id}/analyze") @post analyze(@path id: string): string | Error;
          }
        `,
      { libraries: ["Http"] }
    );

    const emitContext: EmitContext = {
      program,
    } as EmitContext;

    const tree = emitRlc(emitContext);
    const result = await render(tree);
    console.log(await printFormatted(result, "typescript"));
  });
});
