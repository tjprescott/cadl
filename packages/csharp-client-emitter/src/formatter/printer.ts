import prettier, { AstPath, Doc, Options, Printer } from "prettier";
import {
  Attributable,
  AttributeFuncNode,
  AttributeNode,
  BooleanLiteralNode,
  ClassNode,
  ClassPropertyNode,
  CSharpDocument,
  Node,
  NumericLiteralNode,
  StringLiteralNode,
  SyntaxKind,
  TypeReferenceNode,
} from "../csharp-syntax.js";
import { printCommaList } from "./helper.js";

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
    case SyntaxKind.TypeReference:
      return printTypeReference(path as AstPath<TypeReferenceNode>, options, print);
    case SyntaxKind.Class:
      return printClass(path as AstPath<ClassNode>, options, print);
    case SyntaxKind.ClassProperty:
      return printClassProperty(path as AstPath<ClassPropertyNode>, options, print);
    case SyntaxKind.Attribute:
      return printAttribute(path as AstPath<AttributeNode>, options, print);
    case SyntaxKind.AttributeFunc:
      return printAttributeFunc(path as AstPath<AttributeFuncNode>, options, print);
    case SyntaxKind.StringLiteral:
      return printStringLiteral(path as AstPath<StringLiteralNode>, options, print);
    case SyntaxKind.NumericLiteral:
      return printNumericLiteral(path as AstPath<NumericLiteralNode>, options, print);
    case SyntaxKind.BooleanLiteral:
      return printBooleanLiteral(path as AstPath<BooleanLiteralNode>, options, print);
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

    if (index !== statementCount - 1) {
      parts.push(hardline);
    }
  }, property);

  return parts;
}

function printTypeReference(
  path: AstPath<TypeReferenceNode>,
  options: Options,
  print: PrettierChildPrint
): Doc {
  const node = path.getValue();

  return [node.id, node.nullable ? "?" : ""];
}

function printClass(path: AstPath<ClassNode>, options: Options, print: PrettierChildPrint) {
  const node = path.getValue();
  const attributes = printAttributeList(path, options, print);
  const visibility = node.visibility ? `${node.visibility} ` : "";
  const body = indent([hardline, printStatementSequence(path, options, print, "body")]);
  return [attributes, visibility, "class ", node.id, hardline, "{", body, hardline, "}"];
}

function printClassProperty(
  path: AstPath<ClassPropertyNode>,
  options: Options,
  print: PrettierChildPrint
) {
  const node = path.getValue();
  const type = path.call(print, "type");
  const attributes = printAttributeList(path, options, print);

  const visibility = node.visibility ? `${node.visibility} ` : "";
  const get = node.get ? "get; " : "";
  const set = node.set ? "set; " : "";
  const defaultValue = node.default ? [" = ", path.call(print, "default"), ";"] : "";
  return [attributes, visibility, type, " ", node.id, " {", " ", get, set, "}", defaultValue];
}

function printAttributeList(
  path: AstPath<Node & Attributable>,
  options: Options,
  print: PrettierChildPrint
): Doc {
  const node = path.getValue();
  if (node.attributes === undefined) {
    return "";
  }
  return path.map((x) => [print(x), hardline], "attributes");
}

function printAttribute(path: AstPath<AttributeNode>, options: Options, print: PrettierChildPrint) {
  const node = path.getValue();

  const target = node.target ? `${node.target} : ` : "";
  const content = path.map(print, "funcs");
  return group(["[", indent([softline, target, content]), softline, "]"]);
}

function printAttributeFunc(
  path: AstPath<AttributeFuncNode>,
  options: Options,
  print: PrettierChildPrint
) {
  const node = path.getValue();

  const docs: Doc[] = [node.name];

  if (node.arguments && node.arguments.length > 0) {
    docs.push("(");
    docs.push(indent([softline, printCommaList(path.map(print, "arguments"))]));
    docs.push(")");
  }
  return group(docs);
}

function printStringLiteral(
  path: AstPath<StringLiteralNode>,
  options: Options,
  print: PrettierChildPrint
) {
  const node = path.getValue();
  return `"${node.value}"`;
}

function printNumericLiteral(
  path: AstPath<NumericLiteralNode>,
  options: Options,
  print: PrettierChildPrint
) {
  const node = path.getValue();
  return node.value;
}

function printBooleanLiteral(
  path: AstPath<BooleanLiteralNode>,
  options: Options,
  print: PrettierChildPrint
) {
  const node = path.getValue();
  return node.value;
}
