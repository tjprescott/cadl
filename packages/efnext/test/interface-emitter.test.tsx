import { describe, it } from "vitest";
import { render } from "../src/framework/core/render.js";
import { assertEqual } from "./component-utils.js";
import { getProgram } from "./test-host.js";
import { emitTypescriptInterfaces } from "./typescript-interface-emitter.js";

describe("e2e typescript interface emitter", () => {
  it("emits models", async () => {
    const program = await getProgram(`
          model A {
            x: {
              y: string;
            },
          }
        `);

    const result = await render(emitTypescriptInterfaces(program));

    await assertEqual(
      result,
      `interface A {
          x: { y: string }
        }`
    );
  });

  // TODO: Support model templates
  it.skip("emits model templates", async () => {
    const contents = await getProgram(`
      model Template<T> {
        x: T
      }

      model Test1 is Template<string>;
      model Test2 {
        prop: Template<int32>;
      }
    `);

    const result = await render(emitTypescriptInterfaces(contents));

    await assertEqual(
      result,
      `interface Test1 {}
      `
    );
  });

  it("emits literal types", async () => {
    const contents = await getProgram(`
      model A {
        x: true,
        y: "hi",
        z: 12
      }
    `);

    const result = await render(emitTypescriptInterfaces(contents));
    await assertEqual(
      result,
      `interface A {
        x: true,
        y: "hi",
        z: 12
      
    }`
    );
  });

  it("emits unknown", async () => {
    const contents = await getProgram(`
      model A {
        x: unknown
      }
    `);

    const result = await render(emitTypescriptInterfaces(contents));

    await assertEqual(
      result,
      `interface A {
        x: unknown
    }`
    );
  });

  // Support templates
  it.skip("emits array literals", async () => {
    const contents = await getProgram(`
      model MyArray2 is Array<string>;

      model HasArray {
        x: MyArray2;
        y: string[];
        z: (string | int32)[]
      }
    `);

    const result = await render(emitTypescriptInterfaces(contents));
    await assertEqual(
      result,
      `
    interface MyArray2 extends Array<string> {}
    interface HasArray {
      x: MyArray2;
      y: string[];
      z: (string | number)[];
      }`
    );
  });

  // TODO: Support model templates
  it.skip("emits arrays of unknown", async () => {
    const contents = await getProgram(`
      model MyArray2 is Array<unknown>;
    `);

    const result = await render(emitTypescriptInterfaces(contents));
    await assertEqual(result, `interface MyArray2 extends Array<unknown> {}`);
    // assert.match(contents, /MyArray2 extends Array<unknown>/);
  });

  it("emits operations", async () => {
    const contents = await getProgram(`
      model SomeModel {
        x: string;
      }
      op read(x: string, y: int32, z: { inline: true }, q?: SomeModel): string;
    `);

    const result = await render(emitTypescriptInterfaces(contents));
    await assertEqual(
      result,
      `interface SomeModel {
        x: string
      }
      function read(x: string, y: number, z: { inline: true }, q?: SomeModel): string{}`
    );
  });

  // TODO: Support template parameters
  it.skip("emits interfaces", async () => {
    const contents = await getProgram(`
      model Foo {
        prop: string;
      }
      op Callback(x: string): string;

      interface Things {
        op read(x: string): string;
        op write(y: Foo): Foo;
        op callCb(cb: Callback): string;
      }

      interface Template<T> {
        op read(): T;
        op write(): T;
      }

      interface TemplateThings extends Template<string> {}
    `);

    const result = await render(emitTypescriptInterfaces(contents));

    await assertEqual(
      result,
      `interface Foo {
        prop: string
      }
      function Callback(x: string): string{}
      interface Things {
        read(x: string): string
        write(y: Foo): Foo
        callCb(cb: Callback): string
      }
      interface Template<T> {
        read(): T
        write(): T
      }
      interface TemplateThings extends Template<string> {}`
    );
  });

  //TODO: Support enums
  it.skip("emits enums", async () => {
    const contents = await getProgram(`
      enum StringEnum {
        x; y: "hello";
      }

      enum NumberEnum {
        x: 1;
        y: 2;
        z: 3;
      }
    `);

    const result = await render(emitTypescriptInterfaces(contents));

    await assertEqual(
      result,
      `enum StringEnum {
        x,
        y = "hello"
      }
      enum NumberEnum {
        x = 1,
        y = 2,
        z = 3
      }`
    );
  });

  // TODO: Support template parameter
  it.skip("emits unions", async () => {
    const contents = await getProgram(`
      model SomeModel {
        a: 1 | 2 | SomeModel;
        b: TU<string>;
      };

      union U {
        x: 1,
        y: "hello",
        z: SomeModel
      }

      union TU<T> {
        x: T;
        y: null;
      }
    `);

    const result = await render(emitTypescriptInterfaces(contents));

    await assertEqual(
      result,
      `interface SomeModel {
        a: 1 | 2 | SomeModel;
        b: TU<string>;
      }
      type U = 1 | "hello" | SomeModel
      type TU<T> = T | null`
    );
  });

  // TODO: Support tuples
  it.skip("emits tuple types", async () => {
    const contents = await getProgram(`
      model Foo {
        x: [string, int32];
      }
    `);

    const result = await render(emitTypescriptInterfaces(contents));
    await assertEqual(
      result,
      `interface Foo {
        x: [string, number]
      }`
    );
  });

  // TODO: Support enum and enumMembers
  it.skip("emits enum member references", async () => {
    const contents = await getProgram(`
      enum MyEnum {
        a: "hi";
        b: "bye";
      }
      
      model EnumReference {
        prop: MyEnum.a;
        prop2: MyEnum.b;
      }
    `);

    const result = await render(emitTypescriptInterfaces(contents));
    await assertEqual(
      result,
      `enum MyEnum {
        a = "hi",
        b = "bye"
      }
      interface EnumReference {
        prop: MyEnum.a;
        prop2: MyEnum.b;
      }`
    );
  });

  // TODO: Support scalars
  it.skip("emits scalars", async () => {
    const contents = await getProgram(
      `
      scalar X extends string;
      scalar Y extends numeric;
    `
    );

    const result = await render(emitTypescriptInterfaces(contents));
    await assertEqual(
      result,
      `type X = string;
      type Y = number;`
    );
  });

  it("emits objects", async () => {
    const program = await getProgram(
      `
      model Foo {
        bar: Bar
      }
      model Bar {
        x: Foo;
        y: {
          x: Foo
        };
      };
      `
    );

    const result = await render(emitTypescriptInterfaces(program));
    await assertEqual(
      result,
      `interface Foo {
        bar: Bar
      }
      interface Bar {
        x: Foo;
        y: { x: Foo }
      }`
    );
  });
});
