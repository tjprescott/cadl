import prettier, { AstPath, Doc, Options, Printer } from "prettier";
import {
  ArgumentDeclarationNode,
  Attributable,
  AttributeFuncNode,
  AttributeNode,
  BooleanLiteralNode,
  ClassNode,
  ClassPropertyNode,
  Comment,
  CSharpDocument,
  FieldNode,
  MethodNode,
  NamespaceNode,
  Node,
  NumericLiteralNode,
  StringLiteralNode,
  StructNode,
  SyntaxKind,
  TypeReferenceNode,
  UsingNode,
} from "../csharp-syntax.js";
import { printCommaList } from "./helper.js";

const { align, breakParent, group, hardline, ifBreak, indent, join, line, softline } =
  prettier.doc.builders;

const { isNextLineEmpty } = prettier.util;

type PrettierChildPrint = (path: AstPath<Node>, index?: number) => Doc;

export const csharpPrinter: Printer<Node> = {
  print: printCSharp,
  printComment,
  canAttachComment,
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
    case SyntaxKind.Namespace:
      return printNamespace(path as AstPath<NamespaceNode>, options, print);
    case SyntaxKind.Using:
      return printUsing(path as AstPath<UsingNode>, options, print);
    case SyntaxKind.Class:
      return printClass(path as AstPath<ClassNode>, options, print);
    case SyntaxKind.Struct:
      return printStruct(path as AstPath<StructNode>, options, print);
    case SyntaxKind.Field:
      return printField(path as AstPath<FieldNode>, options, print);
    case SyntaxKind.ClassProperty:
      return printClassProperty(path as AstPath<ClassPropertyNode>, options, print);
    case SyntaxKind.Method:
      return printMethod(path as AstPath<MethodNode>, options, print);
    case SyntaxKind.ArgumentDeclaration:
      return printArgumentDeclaration(path as AstPath<ArgumentDeclarationNode>, options, print);
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
  const node = path.getValue();
  const headerComments = node.headerComments
    ? [printDanglingComments(path, options, { sameIndent: true, key: "headerComments" }), hardline]
    : "";
  return [
    headerComments,
    printUsings(path, options, print),
    printStatementSequence(path, options, print, "statements"),
  ];
}

export function printStatementSequence<T extends Node>(
  path: AstPath<T>,
  options: Options,
  print: PrettierChildPrint,
  property: keyof T,
  blankLinkInBetween = true
) {
  const parts: Doc[] = [];
  const node = path.getValue();
  const statementCount = (node[property] as any).length;
  path.each((statementPath, index) => {
    const printed = print(statementPath);
    parts.push(printed);

    if (index !== statementCount - 1) {
      parts.push(hardline);
      if (blankLinkInBetween) {
        parts.push(hardline);
      }
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
  const body = indent([hardline, printStatementSequence(path, options, print, "members")]);
  return [attributes, visibility, "class ", node.id, hardline, "{", body, hardline, "}"];
}

function printStruct(path: AstPath<StructNode>, options: Options, print: PrettierChildPrint): Doc {
  const node = path.getValue();
  const attributes = printAttributeList(path, options, print);
  const visibility = node.visibility ? `${node.visibility} ` : "";
  const body = indent([hardline, printStatementSequence(path, options, print, "members")]);
  return [attributes, visibility, "struct ", node.id, hardline, "{", body, hardline, "}"];
}

function printField(path: AstPath<FieldNode>, options: Options, print: PrettierChildPrint): Doc {
  const node = path.getValue();
  const type = path.call(print, "type");
  const modifiers = [
    node.visibility ? `${node.visibility} ` : "",
    node.static ? "static " : "",
    node.readonly ? "readonly " : "",
  ];
  const declarations = join(
    ", ",
    path.map((path: any) => {
      const x = path.getValue();
      const defaultValue = x.value ? [" = ", path.call(print, "value")] : "";
      return [x.id, defaultValue];
    }, "declarations")
  );
  return [...modifiers, type, " ", group(declarations), ";"];
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

function printNamespace(
  path: AstPath<NamespaceNode>,
  options: Options,
  print: PrettierChildPrint
): Doc {
  const node = path.getValue();
  if (node.statements === undefined) {
    return `namespace ${node.id};`;
  }

  return [
    `namespace ${node.id}`,
    hardline,
    "{",
    indent([
      hardline,
      printUsings(path, options, print),
      printStatementSequence(path, options, print, "statements"),
    ]),
    hardline,
    "}",
  ];
}

function printUsings(
  path: AstPath<Node & { usings?: UsingNode[] }>,
  options: Options,
  print: PrettierChildPrint
): Doc {
  const node = path.getValue();
  if (node.usings === undefined) {
    return "";
  }
  return [printStatementSequence(path, options, print, "usings", false), hardline, hardline];
}

function printUsing(path: AstPath<UsingNode>, options: Options, print: PrettierChildPrint): Doc {
  const node = path.getValue();

  return ["using ", node.name, ";"];
}

export function canAttachComment(node: Node): boolean {
  const kind = node.kind as SyntaxKind;
  return Boolean(kind && kind !== SyntaxKind.Comment);
}

function printComment(commentPath: AstPath<Node | Comment>, options: Options): Doc {
  const comment = commentPath.getValue();
  if (comment.kind !== SyntaxKind.Comment) {
    throw new Error(`Node ${SyntaxKind[comment.kind]} is not a comment.`);
  }
  (comment as any).printed = true;
  if (comment.value.startsWith("///")) {
    return printXmlComment(comment.value);
  } else if (comment.value.startsWith("//")) {
    return comment.value.trimRight();
  } else {
    return printBlockComment(comment.value);
  }
}

function printBlockComment(rawComment: string) {
  if (isIndentableBlockComment(rawComment)) {
    const printed = printIndentableBlockComment(rawComment);
    return printed;
  }

  return ["/*", rawComment, "*/"];
}

function isIndentableBlockComment(rawComment: string): boolean {
  // If the comment has multiple lines and every line starts with a star
  // we can fix the indentation of each line. The stars in the `/*` and
  // `*/` delimiters are not included in the comment value, so add them
  // back first.
  const lines = `*${rawComment}*`.split("\n");
  return lines.length > 1 && lines.every((line) => line.trim()[0] === "*");
}

function printIndentableBlockComment(rawComment: string): Doc {
  const lines = rawComment.split("\n");

  return [
    "/*",
    join(
      hardline,
      lines.map((line, index) =>
        index === 0
          ? line.trimEnd()
          : " " + (index < lines.length - 1 ? line.trim() : line.trimStart())
      )
    ),
    "*/",
  ];
}

function printXmlComment(rawComment: string) {
  const lines = rawComment.split("\n");

  return [
    join(
      hardline,
      lines.map((line, index) =>
        index === 0 ? line.trimEnd() : index < lines.length - 1 ? line.trim() : line.trimStart()
      )
    ),
  ];
}

function printDanglingComments(
  path: AstPath<any>,
  options: Options,
  { sameIndent, key }: { sameIndent: boolean; key?: string }
) {
  const node = path.getValue();
  const parts: prettier.Doc[] = [];
  key ??= "comments";
  if (!node || !node[key]) {
    return "";
  }
  path.each((commentPath) => {
    const comment = commentPath.getValue();
    if (!comment.leading && !comment.trailing) {
      parts.push(printComment(path, options));
    }
  }, key);

  if (parts.length === 0) {
    return "";
  }

  if (sameIndent) {
    return [join(hardline, parts), hardline];
  }
  return [indent([hardline, join(hardline, parts)]), hardline];
}

function printModifiers<T extends { visibility?: string }>(node: T, modifiers: (keyof T)[]): Doc {
  return [
    node.visibility ? `${node.visibility} ` : "",
    ...modifiers.map((x) => {
      return node[x] ? `${x} ` : "";
    }),
  ];
}

function printMethod(path: AstPath<MethodNode>, options: Options, print: PrettierChildPrint): Doc {
  const node = path.getValue();
  const returnType = node.returnType ? [path.call(print, "returnType"), " "] : "";
  const modifiers = printModifiers(node, ["abstract", "virtual", "override"]);
  const args = join(", ", path.map(print, "arguments"));
  return [modifiers, returnType, node.id, "(", args, ")", hardline, "{", hardline, "}"];
}

function printArgumentDeclaration(
  path: AstPath<ArgumentDeclarationNode>,
  options: Options,
  print: PrettierChildPrint
): Doc {
  const node = path.getValue();
  const defaultValue = node.default ? [" = ", path.call(print, "default")] : "";
  return [path.call(print, "returnType"), " ", defaultValue];
}
