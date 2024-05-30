import assert from "node:assert";
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

      it("can return false, which is ignored", () => {
        function Test() {
          return false;
        }
        const rt = render(<Test />);
        assert.deepStrictEqual(rt, []);
      });

      it("can return true, which is stringified", () => {
        function Test() {
          return false;
        }
        const rt = render(<Test />);
        assert.deepStrictEqual(rt, ["true"]);
      });
    });
    //describe("array values", () => {});
    describe.only("components", () => {
      function Outer() {
        return <Inner />;
      }

      function Inner() {
        return "hi";
      }

      const rt = render(<Outer />);
      console.log(rt);
      assert(true);
    });
  });
});
