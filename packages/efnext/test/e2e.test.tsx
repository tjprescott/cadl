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
async function print(root: RenderedTreeNode) {
  const raw = (root as any).flat(Infinity).join("");

  try {
    console.log(await format(raw, { parser: "typescript"}));
  } catch (e) {
    console.error("Formatting error", e);
    console.log(raw);
  }
}

describe("e2e", () => {
  it("example", async () => {
    let res = await render(
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

  it("interfaces", async () => {
    const program = await getProgram(`
      model Foo { x: true }
      model Bar { x: Foo, y: { a: 1 } }
    `);

    const [Foo] = program.resolveTypeReference("Foo");
    const [Bar] = program.resolveTypeReference("Bar");

    let res = await render(
      <EmitOutput>
        <SourceFile path="test.ts">
          <TypeDeclaration type={Foo!} />
          <TypeDeclaration type={Bar!} />
        </SourceFile>
      </EmitOutput>
    )

    await print(res);
  });
  it("interfaces in reverse order", async () => {
    const program = await getProgram(`
      model Foo { x: true }
      model Bar { x: Foo, y: { a: 1 } }
    `);

    const [Foo] = program.resolveTypeReference("Foo");
    const [Bar] = program.resolveTypeReference("Bar");

    let res = await render(
      <EmitOutput>
        <SourceFile path="test.ts">
          <TypeDeclaration type={Bar!} />
          <TypeDeclaration type={Foo!} />
        </SourceFile>
      </EmitOutput>
    )

    await print(res);
  });

  it("works with circular references", async () => {
    const program = await getProgram(`
      model Foo { x: Bar }
      model Bar { x: Foo }
    `);

    const [Foo] = program.resolveTypeReference("Foo");
    const [Bar] = program.resolveTypeReference("Bar");

    let res = await render(
      <EmitOutput>
        <SourceFile path="test.ts">
          <TypeDeclaration type={Bar!} />
          <TypeDeclaration type={Foo!} />
        </SourceFile>
      </EmitOutput>
    )

    await print(res);
  })

  it("works with cross-source-file references", async () => {
    const program = await getProgram(`
    model Foo { x: Bar }
    model Bar { x: Foo }
  `);

  const [Foo] = program.resolveTypeReference("Foo");
  const [Bar] = program.resolveTypeReference("Bar");

  let res = await render(
    <EmitOutput>
      <SourceFile path="test1.ts">
        <TypeDeclaration type={Bar!} />
      </SourceFile>
      <SourceFile path="test2.ts">
        <TypeDeclaration type={Foo!} />
      </SourceFile>
    </EmitOutput>
  )

  await print(res);
  });
})