import prettier, { Doc } from "prettier";

const { align, breakParent, group, hardline, ifBreak, indent, join, line, softline } =
  prettier.doc.builders;

export function printCommaList(list: Doc[]): Doc {
  return join([",", line], list);
}
