import { mapWithSep } from "./utils.js";

export interface BaseClassesModel {
  values: string[] | undefined;
}

export function BaseClasses({ values }: BaseClassesModel) {
  if (!values) {
    return undefined;
  }
  // TODO: We need to ensure these base classes are either declared or imported.
  return `(${mapWithSep(
    values,
    (baseClass) => {
      return baseClass;
    },
    ", "
  )})`;
}
