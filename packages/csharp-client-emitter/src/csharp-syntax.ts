export enum SyntaxKind {
  CSharpDocument,
  Namespace,
  Using,
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
  | NamespaceNode
  | UsingNode
  | ClassNode
  | ClassPropertyNode
  | TypeReferenceNode
  | AttributeNode
  | AttributeFuncNode
  | Expression;

export type Expression = StringLiteralNode | NumericLiteralNode | BooleanLiteralNode;

export type StatementNode = NamespaceNode | ClassNode;

export interface NodeBase {}

export interface Attributable {
  attributes?: AttributeNode[];
}

export interface CSharpDocument extends NodeBase {
  kind: SyntaxKind.CSharpDocument;
  statements: StatementNode[];
  usings?: UsingNode[];
}

export type ClassStatement = ClassNode | ClassPropertyNode;

export interface NamespaceNode extends NodeBase {
  kind: SyntaxKind.Namespace;
  id: string;
  statements?: StatementNode[];
  usings?: UsingNode[];
}

export interface UsingNode extends NodeBase {
  kind: SyntaxKind.Using;
  name: string;
}

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
