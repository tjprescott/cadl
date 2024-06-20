import { ComponentChild } from "#jsx/jsx-runtime";

export interface BlackFormatterModel {
  children?: ComponentChild[];
}

/** Apply the Python formatter `black` to the child components. */
export function BlackFormatter({ children }: BlackFormatterModel) {
  // TODO: Implement!
  return children;
}
