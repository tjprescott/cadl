import assert, { strictEqual } from "node:assert";
import { describe, it } from "vitest";
import { setTimeout } from "node:timers/promises"
import { render } from "../src/framework/core/render.js";
import { createContext, useContext } from "../src/framework/core/context.js";

describe("context api", () => {
  it("can get context from a parent node", () => {
    const TestContext = createContext();

    function Test() {
      return <TestContext.Provider value="true">
        <Test2 />
      </TestContext.Provider>
    }

    function Test2() {
      const value = useContext(TestContext);
      return value;
    }

    const tree = render(<Test />);
    console.log(tree);
  })
})
