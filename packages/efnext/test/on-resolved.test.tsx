import { describe, it } from "vitest";
import { RenderedTreeNode, render } from "../src/framework/core/render.js";
import { EmitOutput } from "../src/framework/components/emit-output.js";
import { SourceFile } from "../src/framework/components/source-file.js";
import { Function } from "../src/typescript/function.js";
import { Reference } from "../src/typescript/reference.js";
import { format } from "prettier";
import { getProgram } from "./test-host.js";
import { TypeDeclaration } from "../src/typescript/type-declaration.js";
import { setTimeout, setImmediate } from "node:timers/promises"
import { useResolved } from "../src/framework/core/use-resolved.js";
import assert from "node:assert/strict"

describe("on-resolved", () => {
  it("works", async () => {
    function Test() {
      const OnResolved = useResolved(() => <>
        hi
      </>);
      return <OnResolved />
    }

    const res = await render(<Test />);
    assert.deepEqual(res, [[["hi"]]]);
  });
});