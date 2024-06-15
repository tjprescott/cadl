import { Model } from "@typespec/compiler";

export function hasRequiredProperties(model: Model): boolean {
  for (const prop of model.properties.values()) {
    if (!prop.optional) {
      return true;
    }
  }

  return false;
}
