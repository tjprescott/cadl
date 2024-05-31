import { describe, it } from "vitest";
import { emit } from "./test-host.js";

describe("hello", () => {
  it("emit output.txt with content hello world", async () => {
    await emit(`op test(): void;`);
  });
});
