export enum SyntaxKind {
  CSharpDocument,
  Class,
  ClassProperty,
  TypeReference,
  StringLiteral,
  NumericLiteral,
  BooleanLiteral,
  Attribute,
  AttributeFunc,
}

export type Node =
  | CSharpDocument
  | ClassNode
  | ClassPropertyNode
  | TypeReferenceNode
  | AttributeNode
  | AttributeFuncNode
  | Expression;

export type Expression = StringLiteralNode | NumericLiteralNode | BooleanLiteralNode;

export type StatementNode = ClassNode;

export interface NodeBase {}

export interface Attributable {
  attributes?: AttributeNode[];
}

export interface CSharpDocument extends NodeBase {
  kind: SyntaxKind.CSharpDocument;
  statements: StatementNode[];
}

export type ClassStatement = ClassNode | ClassPropertyNode;

export interface ClassNode extends NodeBase, Attributable {
  kind: SyntaxKind.Class;
  id: string;
  visibility?: "public" | "internal" | "protected" | "private";
  body?: ClassStatement[];
}

export interface TypeReferenceNode extends NodeBase {
  kind: SyntaxKind.TypeReference;
  id: string;
  nullable?: boolean;
}

export interface ClassPropertyNode extends NodeBase, Attributable {
  kind: SyntaxKind.ClassProperty;
  id: string;
  type: TypeReferenceNode;
  visibility?: "public" | "protected" | "private";
  get?: boolean;
  set?: boolean;

  default?: Expression;
}

export interface AttributeNode extends NodeBase {
  kind: SyntaxKind.Attribute;
  target?: string;
  funcs: AttributeFuncNode[];
}

export interface AttributeFuncNode extends NodeBase {
  kind: SyntaxKind.AttributeFunc;
  name: string;
  arguments?: Expression[];
}

export interface StringLiteralNode extends NodeBase {
  kind: SyntaxKind.StringLiteral;
  value: string;
}

export interface NumericLiteralNode extends NodeBase {
  kind: SyntaxKind.NumericLiteral;
  value: string;
}

export interface BooleanLiteralNode extends NodeBase {
  kind: SyntaxKind.BooleanLiteral;
  value: "true" | "false";
}
