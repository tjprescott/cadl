export enum SyntaxKind {
  CSharpDocument,
  Class,
  ClassProperty,
  TypeReference,
  StringLiteral,
  NumericLiteral,
}

export type Node = CSharpDocument | ClassNode | ClassPropertyNode | TypeReferenceNode | Expression;
export type Expression = StringLiteralNode | NumericLiteralNode;

export type StatementNode = ClassNode;

export interface CSharpDocument {
  kind: SyntaxKind.CSharpDocument;
  statements: StatementNode[];
}

export type ClassStatement = ClassNode | ClassPropertyNode;

export interface ClassNode {
  kind: SyntaxKind.Class;
  id: string;
  visibility?: "public" | "internal" | "protected" | "private";
  body?: ClassStatement[];
}

export interface TypeReferenceNode {
  kind: SyntaxKind.TypeReference;
  id: string;
  nullable?: boolean;
}

export interface ClassPropertyNode {
  kind: SyntaxKind.ClassProperty;
  id: string;
  type: TypeReferenceNode;
  visibility?: "public" | "protected" | "private";
  get?: boolean;
  set?: boolean;

  default?: Expression;
}

export interface StringLiteralNode {
  kind: SyntaxKind.StringLiteral;
  value: string;
}

export interface NumericLiteralNode {
  kind: SyntaxKind.NumericLiteral;
  value: string;
}
