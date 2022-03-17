export enum SyntaxKind {
  CSharpDocument,
  Class,
}

export type Node = CSharpDocument | ClassNode;
export type StatementNode = ClassNode;

export interface CSharpDocument {
  kind: SyntaxKind.CSharpDocument;

  statements: StatementNode[];
}

export interface ClassNode {
  kind: SyntaxKind.Class;
}
