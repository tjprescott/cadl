import { code } from "../framework/core/index.js";
import { mapWithSep } from "./utils.js";

export interface DecoratorsModel {
  /** The TypeSpec type this understands */
  values: string[] | undefined;
}

export function Decorators({ values }: DecoratorsModel) {
  if (!values) {
    return undefined;
  }
  // TODO: We need to ensure these decorators are either declared or imported (most likely imported).
  return code`${mapWithSep(
    values,
    (dec) => {
      if (dec.startsWith("@")) {
        return dec;
      } else {
        return `@${dec}`;
      }
    },
    "\n"
  )}`;
}
