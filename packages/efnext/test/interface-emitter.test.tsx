import { Namespace } from "@typespec/compiler";
import { format } from "prettier";
import { describe, it } from "vitest";
import { EmitOutput } from "../src/framework/components/emit-output.js";
import { SourceFile } from "../src/framework/components/source-file.js";
import { RenderedTreeNode, render } from "../src/framework/core/render.js";
import { InterfaceDeclaration } from "../src/typescript/interface-declaration.js";
import { TypeDeclaration } from "../src/typescript/type-declaration.js";
import { getProgram } from "./test-host.js";
async function print(root: RenderedTreeNode) {
  const raw = (root as any).flat(Infinity).join("");

  try {
    console.log(await format(raw, { parser: "typescript" }));
  } catch (e) {
    console.error("Formatting error", e);
    console.log(raw);
  }
}

describe("e2e", () => {
  it("interfaces", async () => {
    const program = await getProgram(`
    namespace DemoService;

    model Widget {
      id: string;
      weight: int32;
      color: Color;
    }
    
    model Error {
      code: int32;
      message: string;
    }
    
    interface Widgets {
      list(): Widget[] | Error;
      read(id: string): Widget | Error;
      create(...Widget): Widget | Error;
      update(...Widget): Widget | Error;
      delete(id: string): void | Error;
      analyze(id: string): string | Error;
    }

    union Color {
      Red: "red";
      Blue: "blue";
    }
  `);

    const [namespace] = program.resolveTypeReference("DemoService");
    const interfaces = Array.from((namespace as Namespace).interfaces.values());
    const models = Array.from((namespace as Namespace).models.values());
    const unions = Array.from((namespace as Namespace).unions.values());
    const typeDeclarations = [...models, ...unions];

    let res = await render(
      <EmitOutput>
        <SourceFile path="test1.ts">
          {interfaces.map((iface) => (
            <InterfaceDeclaration type={iface} />
          ))}
          {typeDeclarations.map((type) => (
            <TypeDeclaration type={type} />
          ))}
        </SourceFile>
      </EmitOutput>
    );

    await print(res);
  });
});
