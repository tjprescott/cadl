import { pascalCase, snakeCase } from "change-case";
import { createNamePolicy } from "../framework/core/name-policy.js";

// todo: provide in Python framework

type NameKinds = "classMember" | "class" | "function" | "parameter";

export const pythonNamePolicy = createNamePolicy<NameKinds>((type, kind) => {
  if (!("name" in type && typeof type.name === "string")) {
    return "unknown name";
  }
  switch (kind) {
    case "class":
      return pascalCase(type.name);
    case "classMember":
    case "function":
    case "parameter":
      return snakeCase(type.name);
    default:
      throw new Error(`Unknown kind ${kind}`);
  }
});
