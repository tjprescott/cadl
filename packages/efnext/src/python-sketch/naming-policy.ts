import { snakeCase } from "change-case";
import { createNamePolicy } from "../framework/core/name-policy.js";
export const namePolicy = createNamePolicy((type) => {
  return "name" in type && typeof type.name === "string" ? snakeCase(type.name) : "unknown name";
});
