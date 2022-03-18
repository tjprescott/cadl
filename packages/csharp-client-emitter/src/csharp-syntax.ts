export enum SyntaxKind {
  Attribute,
  AttributeFunc,
  BooleanLiteral,
  Class,
  Struct,
  ClassProperty,
  Field,
  Comment,
  CSharpDocument,
  Namespace,
  NumericLiteral,
  StringLiteral,
  TypeReference,
  Using,
}

export type Node =
  | CSharpDocument
  | NamespaceNode
  | UsingNode
  | ClassNode
  | StructNode
  | ClassPropertyNode
  | TypeReferenceNode
  | AttributeNode
  | AttributeFuncNode
  | FieldNode
  | Expression;

export type Expression = StringLiteralNode | NumericLiteralNode | BooleanLiteralNode;

export type StatementNode = NamespaceNode | ClassNode | StructNode;

export interface NodeBase {
  comments?: Comment[];
}

export interface Attributable {
  attributes?: AttributeNode[];
}

export interface Comment extends NodeBase {
  kind: SyntaxKind.Comment;
  leading: boolean;
  trailing: boolean;
  value: string;
}

export interface CSharpDocument {
  kind: SyntaxKind.CSharpDocument;
  headerComments?: Comment[];
  statements: StatementNode[];
  usings?: UsingNode[];
}

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

export type ClassStatement = ClassNode | ClassPropertyNode | FieldNode;
export interface ClassNode extends NodeBase, Attributable {
  kind: SyntaxKind.Class;
  id: string;
  visibility?: "public" | "internal" | "protected" | "private";
  body?: ClassStatement[];
}

export type StructStatement = FieldNode;
export interface StructNode extends NodeBase, Attributable {
  kind: SyntaxKind.Struct;
  id: string;
  visibility?: "public" | "internal" | "protected" | "private";
  body?: StructStatement[];
}

export interface TypeReferenceNode extends NodeBase {
  kind: SyntaxKind.TypeReference;
  id: string;
  nullable?: boolean;
}

export interface FieldNode extends NodeBase {
  kind: SyntaxKind.Field;
  id: string;
  type: TypeReferenceNode;
  visibility?: "public" | "protected" | "private";
  default?: Expression;
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
