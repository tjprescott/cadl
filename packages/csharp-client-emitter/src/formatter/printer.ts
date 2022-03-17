import prettier, { AstPath, Doc, Options, Printer } from "prettier";
import { ClassNode, CSharpDocument, Node, SyntaxKind } from "../csharp-syntax.js";

const { align, breakParent, group, hardline, ifBreak, indent, join, line, softline } =
  prettier.doc.builders;

const { isNextLineEmpty } = prettier.util;

type PrettierChildPrint = (path: AstPath<Node>, index?: number) => Doc;

export const csharpPrinter: Printer<Node> = {
  print: printCSharp,
};

export function printCSharp(
  // Path to the AST node to print
  path: AstPath<Node>,
  options: Options,
  print: PrettierChildPrint
): Doc {
  const node = printNode(path, options, print);
  return [node];
}

function printNode(path: AstPath<Node>, options: Options, print: PrettierChildPrint): Doc {
  // Path to the AST node to print
  const node: Node = path.getValue();

  switch (node.kind) {
    case SyntaxKind.CSharpDocument:
      return printCSharpDocument(path as AstPath<CSharpDocument>, options, print);
    case SyntaxKind.Class:
      return printClassNode(path as AstPath<ClassNode>, options, print);
    default:
      throw new Error(`Cannot print node type: ${(node as any).kind}`);
  }
}

function printCSharpDocument(
  path: AstPath<CSharpDocument>,
  options: Options,
  print: PrettierChildPrint
) {
  return printStatementSequence(path, options, print, "statements");
}

export function printStatementSequence<T extends Node>(
  path: AstPath<T>,
  options: Options,
  print: PrettierChildPrint,
  property: keyof T
) {
  const parts: Doc[] = [];
  const node = path.getValue();
  const statementCount = (node[property] as any).length;
  path.each((statementPath, index) => {
    const printed = print(statementPath);
    parts.push(printed);

    if (index === statementCount - 1) {
      parts.push(hardline);
    }
  }, property);

  return parts;
}

function printClassNode(path: AstPath<ClassNode>, options: Options, print: PrettierChildPrint) {
  const node = path.getValue();
  return ["class"];
}
