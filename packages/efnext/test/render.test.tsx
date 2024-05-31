import assert, { strictEqual } from "node:assert";
import { describe, it } from "vitest";

import { render } from "../src/framework/core/render.js";

describe("render", () => {
  describe("component return types", () => {
    describe("primitive values", () => {
      it("can return nothing, which is ignored", () => {
        function Test() {}
        const rt = render(<Test />);
        assert.deepStrictEqual(rt, []);
      });

      it("can return a string", () => {
        function Test() {
          return "hi";
        }
        const rt = render(<Test />);
        assert.deepStrictEqual(rt, ["hi"]);
      });

      it("can return a number, which is stringified", () => {
        function Test() {
          return 1;
        }
        const rt = render(<Test />);
        assert.deepStrictEqual(rt, ["1"]);
      });

      // NB: I think this should be ignored.
      it("can return false, which is ignored", () => {
        function Test() {
          return false;
        }
        const rt = render(<Test />);
        assert.deepStrictEqual(rt, []);
      });

      it("can return true, which is ignored", () => {
        function Test() {
          return true;
        }
        const rt = render(<Test />);
        assert.deepStrictEqual(rt, []);
      });
    });
    //describe("array values", () => {});
    describe("components", () => {
      it("can return a single component", () => {
        function Outer() {
          return <Inner />;
        }

        function Inner() {
          return "hi";
        }

        const rt = render(<Outer />);
        assert.deepStrictEqual(rt, [["hi"]]);
      });

      it("can return a fragment, which doesn't add a node", () => {
        function Test() {
          return <><><><br /></></></>
        }

        console.log(render(<Test />));
      })

      it("can return multiple component in a fragment", () => {
        function Test() {
          return (
            <>
              <br />
              <br />
            </>
          );
        }

        const rt = render(<Test />);
        assert.deepStrictEqual(rt, [["\n"], ["\n"]]);
      });

      it("renders non-SourceNode children properly", () => {
        function Test() {
          return <>
            hello
            <Foo>
              <Bar />
              <Bar />
            </Foo>
          </>
        }

        function Foo({children}: any) {
          return children;
        }

        function Bar() {
          return "bar";
        }

        const rt = render(<Test />);
        assert.deepStrictEqual(rt, ["hello", [["bar"], ["bar"]]]);
      })

      it("renders SourceNode children properly", () => {
        function Test() {
          return <>
            hello
            <Foo>
              <Bar />
              <Bar />
            </Foo>
          </>
        }

        function Foo({children}: any) {
          return <><lb />{children}<rb/></>;
        }

        function Bar() {
          return <br />;
        }

        const rt = render(<Test />);
        console.log(JSON.stringify(rt, null, 4));
      })

    });
  });
});
