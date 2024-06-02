import { describe, it } from "vitest";
import { RenderedTreeNode, render } from "../src/framework/core/render.js";
import { EmitOutput } from "../src/framework/components/emit-output.js";
import { SourceFile } from "../src/framework/components/source-file.js";
import { Function } from "../src/typescript/function.js";
import { Reference } from "../src/typescript/reference.js";
import { format } from "prettier";

async function print(root: RenderedTreeNode) {
  console.log(await format((root as any).flat(Infinity).join(""), { parser: "typescript"}));
}
describe("e2e", () => {
  it("example", async () => {
    let res = render(
      <EmitOutput>
        <SourceFile path="test.ts">
          <Function name="test">
          </Function>

          <Function name="test2">
            const x = <Reference refkey="test" />;
          </Function>
        </SourceFile>
      </EmitOutput>
    )

    await print(res);
  });
})