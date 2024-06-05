import { Namespace } from "@typespec/compiler";
import { format } from "prettier";
import { describe, it } from "vitest";
import { EmitOutput } from "../src/framework/components/emit-output.js";
import { SourceFile } from "../src/framework/components/source-file.js";
import { RenderedTreeNode, render } from "../src/framework/core/render.js";
import { InterfaceDeclaration } from "../src/typescript/interface-declaration.js";
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

describe("Typescript Interface", () => {
  describe("Interface bound to Typespec Types", () => {
    describe("Bound to Model", () => {
      it("creates an interface", async () => {
        const program = await getProgram(`
        namespace DemoService;
    
        model Widget{
          id: string;
          weight: int32;
          color: "blue" | "red";
        }
        `);

        const [namespace] = program.resolveTypeReference("DemoService");
        const models = Array.from((namespace as Namespace).models.values());

        let res = await render(
          <EmitOutput>
            <SourceFile path="test2.ts">
              <InterfaceDeclaration type={models[0]} />
            </SourceFile>
          </EmitOutput>
        );

        await print(res);
      });

      it("can override interface name", async () => {
        const program = await getProgram(`
        namespace DemoService;
    
        model Widget{
          id: string;
          weight: int32;
          color: "blue" | "red";
        }
        `);

        const [namespace] = program.resolveTypeReference("DemoService");
        const models = Array.from((namespace as Namespace).models.values());

        let res = await render(
          <EmitOutput>
            <SourceFile path="test2.ts">
              <InterfaceDeclaration name="MyOperations" type={models[0]} />
            </SourceFile>
          </EmitOutput>
        );

        await print(res);
      });

      it("can add a members to the interface", async () => {
        const program = await getProgram(`
        namespace DemoService;
    
        model Widget{
          id: string;
          weight: int32;
          color: "blue" | "red";
        }
        `);

        const [namespace] = program.resolveTypeReference("DemoService");
        const models = Array.from((namespace as Namespace).models.values());

        let res = await render(
          <EmitOutput>
            <SourceFile path="test2.ts">
              <InterfaceDeclaration name="MyOperations" type={models[0]}>
                customProperty: string; <br />
                customMethod(): void;
              </InterfaceDeclaration>
            </SourceFile>
          </EmitOutput>
        );

        await print(res);
      });

      it("interface name can be customized", async () => {
        const program = await getProgram(`
        namespace DemoService;
    
        model Widget{
          id: string;
          weight: int32;
          color: "blue" | "red";
        }
        `);

        const [namespace] = program.resolveTypeReference("DemoService");
        const models = Array.from((namespace as Namespace).models.values());

        let res = await render(
          <EmitOutput>
            <SourceFile path="test2.ts">
              <InterfaceDeclaration name="MyModel" type={models[0]} />
            </SourceFile>
          </EmitOutput>
        );

        await print(res);
      });

      it("interface with extends", async () => {
        const program = await getProgram(`
        namespace DemoService;
    
        model Widget{
          id: string;
          weight: int32;
          color: "blue" | "red";
        }
        
        model ErrorWidget extends Widget {
          code: int32;
          message: string;
        }
        `);

        const [namespace] = program.resolveTypeReference("DemoService");
        const models = Array.from((namespace as Namespace).models.values());

        let res = await render(
          <EmitOutput>
            <SourceFile path="test3.ts">
              {models.map((model) => (
                <InterfaceDeclaration type={model} />
              ))}
            </SourceFile>
          </EmitOutput>
        );

        await print(res);
      });
    });

    describe("Bound to Interface", () => {
      it("creates an interface", async () => {
        const program = await getProgram(`
        namespace DemoService;
    
        interface WidgetOperations {
          op getName(id: string): string;
        }
        `);

        const [namespace] = program.resolveTypeReference("DemoService");
        const interfaces = Array.from((namespace as Namespace).interfaces.values());

        let res = await render(
          <EmitOutput>
            <SourceFile path="test5.ts">
              <InterfaceDeclaration type={interfaces[0]} />
            </SourceFile>
          </EmitOutput>
        );

        await print(res);
      });

      it("creates an interface with Model references", async () => {
        const program = await getProgram(`
        namespace DemoService;
    
        interface WidgetOperations {
          op getName(id: string): Widget;
        }

        model Widget {
          id: string;
          weight: int32;
          color: "blue" | "red";
        }
        `);

        const [namespace] = program.resolveTypeReference("DemoService");
        const interfaces = Array.from((namespace as Namespace).interfaces.values());
        const models = Array.from((namespace as Namespace).models.values());

        let res = await render(
          <EmitOutput>
            <SourceFile path="test5.ts">
              <InterfaceDeclaration type={interfaces[0]} />
              {models.map((model) => (
                <InterfaceDeclaration type={model} />
              ))}
            </SourceFile>
          </EmitOutput>
        );

        await print(res);
      });

      it("creates an interface that extends another", async () => {
        const program = await getProgram(`
        namespace DemoService;
    
        interface WidgetOperations {
          op getName(id: string): Widget;
        }

        interface WidgetOperationsExtended extends WidgetOperations{
          op delete(id: string): void;
        }

        model Widget {
          id: string;
          weight: int32;
          color: "blue" | "red";
        }
        `);

        const [namespace] = program.resolveTypeReference("DemoService");
        const interfaces = Array.from((namespace as Namespace).interfaces.values());
        const models = Array.from((namespace as Namespace).models.values());

        let res = await render(
          <EmitOutput>
            <SourceFile path="test5.ts">
              <InterfaceDeclaration type={interfaces[1]} />
              {models.map((model) => (
                <InterfaceDeclaration type={model} />
              ))}
            </SourceFile>
          </EmitOutput>
        );

        await print(res);
      });
    });
  });
});
