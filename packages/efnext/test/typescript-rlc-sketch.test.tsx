import { EmitContext } from "@typespec/compiler";
import { describe, it } from "vitest";
import { render } from "../src/framework/core/render.js";
import { emitRlc } from "../src/typescript-rlc-sketch/index.js";
import { assertEqual } from "./component-utils.js";
import { getProgram } from "./test-host.js";

describe("e2e typescript rlc emitter", () => {
  it("should render rlc structure", async () => {
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
          interface Widgets {
            @get list(): string[];
          }
        `,
      { libraries: ["Http"] }
    );

    const emitContext: EmitContext = {
      program,
    } as EmitContext;

    const tree = emitRlc(emitContext);
    const result = await render(tree);

    await assertEqual(
      result,
      `
      interface Client {
        (path: "/widgets"): {
          get(options?: {}): string[];
        };
      }`
    );
  });

  it("should render path parameters", async () => {
    const program = await getProgram(
      `
          import "@typespec/http";

          using TypeSpec.Http;
          @service({
            title: "Widget Service",
          })
          namespace DemoService;

          @route("/widgets/{id}")
          @tag("Widgets")
          interface Widgets {
            @get list(@path id: string): string[];
          }
        `,
      { libraries: ["Http"] }
    );

    const emitContext: EmitContext = {
      program,
    } as EmitContext;

    const tree = emitRlc(emitContext);
    const result = await render(tree);

    await assertEqual(
      result,
      `
      interface Client {
        (path: "/widgets/{id}", id: string): {
          get(options?: {}): string[];
        };
      }`
    );
  });

  it("should render body parameters", async () => {
    const program = await getProgram(
      `
          import "@typespec/http";

          using TypeSpec.Http;
          @service({
            title: "Widget Service",
          })
          namespace DemoService;

          model Widget {
            name: string;
          }

          @route("/widgets")
          @tag("Widgets")
          interface Widgets {
            @get list(...Widget): string[];
          }
        `,
      { libraries: ["Http"] }
    );

    const emitContext: EmitContext = {
      program,
    } as EmitContext;

    const tree = emitRlc(emitContext);
    const result = await render(tree);

    await assertEqual(
      result,
      `
      interface Client {
        (path: "/widgets"): {
          get(options: {body: {name: string}}): string[];
        };
      }

     interface Widget {
      name: string;
     }  
      `
    );
  });

  it("should render body parameter as optional", async () => {
    const program = await getProgram(
      `
          import "@typespec/http";

          using TypeSpec.Http;
          @service({
            title: "Widget Service",
          })
          namespace DemoService;

          model Widget {
            name?: string;
          }

          @route("/widgets")
          @tag("Widgets")
          interface Widgets {
            @get list(...Widget): string[];
          }
        `,
      { libraries: ["Http"] }
    );

    const emitContext: EmitContext = {
      program,
    } as EmitContext;

    const tree = emitRlc(emitContext);
    const result = await render(tree);

    await assertEqual(
      result,
      `
      interface Client {
        (path: "/widgets"): {
          get(options?: {body?: {name?: string}}): string[];
        };
      }
        
     interface Widget {
      name?: string;
     }  
      `
    );
  });

  it("should render query parameters", async () => {
    const program = await getProgram(
      `
          import "@typespec/http";

          using TypeSpec.Http;
          @service({
            title: "Widget Service",
          })
          namespace DemoService;

          model Widget {
            name: string;
          }

          @route("/widgets")
          @tag("Widgets")
          interface Widgets {
            @get list(...Widget, @query requestId: string): string[];
          }
        `,
      { libraries: ["Http"] }
    );

    const emitContext: EmitContext = {
      program,
    } as EmitContext;

    const tree = emitRlc(emitContext);
    const result = await render(tree);

    await assertEqual(
      result,
      `
      interface Client {
        (path: "/widgets"): {
          get(options: {
            body: {name: string}, 
            query: {requestId: string}
          }): string[];
        };
      }

     interface Widget {
      name: string;
     }  
      `
    );
  });

  it("should render header parameters", async () => {
    const program = await getProgram(
      `
          import "@typespec/http";

          using TypeSpec.Http;
          @service({
            title: "Widget Service",
          })
          namespace DemoService;

          model Widget {
            name: string;
          }

          @route("/widgets")
          @tag("Widgets")
          interface Widgets {
            @get list(...Widget, @header requestId?: string): string[];
          }
        `,
      { libraries: ["Http"] }
    );

    const emitContext: EmitContext = {
      program,
    } as EmitContext;

    const tree = emitRlc(emitContext);
    const result = await render(tree);

    await assertEqual(
      result,
      `
      interface Client {
        (path: "/widgets"): {
          get(options: {
            body: {name: string}, 
            headers?: {requestId?: string}
          }): string[];
        };
      }

     interface Widget {
      name: string;
     }  
      `
    );
  });

  it("options should be optional when no required parameters", async () => {
    const program = await getProgram(
      `
          import "@typespec/http";

          using TypeSpec.Http;
          @service({
            title: "Widget Service",
          })
          namespace DemoService;

          model Widget {
            name?: string;
          }

          @route("/widgets")
          @tag("Widgets")
          interface Widgets {
            @get list(...Widget, @header requestId?: string): string[];
          }
        `,
      { libraries: ["Http"] }
    );

    const emitContext: EmitContext = {
      program,
    } as EmitContext;

    const tree = emitRlc(emitContext);
    const result = await render(tree);

    await assertEqual(
      result,
      `
      interface Client {
        (path: "/widgets"): {
          get(options?: {
            body?: {name?: string}, 
            headers?: {requestId?: string}
          }): string[];
        };
      }

     interface Widget {
      name?: string;
     }  
      `
    );
  });

  it("options should be required when there is at least one required parameter", async () => {
    const program = await getProgram(
      `
          import "@typespec/http";

          using TypeSpec.Http;
          @service({
            title: "Widget Service",
          })
          namespace DemoService;

          model Widget {
            name?: string;
          }

          @route("/widgets")
          @tag("Widgets")
          interface Widgets {
            @get list(...Widget, @header requestId: string): string[];
          }
        `,
      { libraries: ["Http"] }
    );

    const emitContext: EmitContext = {
      program,
    } as EmitContext;

    const tree = emitRlc(emitContext);
    const result = await render(tree);

    await assertEqual(
      result,
      `
      interface Client {
        (path: "/widgets"): {
          get(options: {
            body?: {name?: string}, 
            headers: {requestId: string}
          }): string[];
        };
      }

     interface Widget {
      name?: string;
     }  
      `
    );
  });
});
