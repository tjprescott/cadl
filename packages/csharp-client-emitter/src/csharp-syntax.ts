export enum SyntaxKind {
  Attribute,
  AttributeFunc,
  ArgumentDeclaration,
  BooleanLiteral,
  Class,
  ClassProperty,
  Comment,
  CSharpDocument,
  Field,
  Method,
  Namespace,
  NumericLiteral,
  StringLiteral,
  Struct,
  TypeReference,
  Using,
  Raw,
}

export type Node =
  | ArgumentDeclarationNode
  | AttributeFuncNode
  | AttributeNode
  | ClassNode
  | ClassPropertyNode
  | CSharpDocument
  | Expression
  | FieldNode
  | MethodNode
  | NamespaceNode
  | StructNode
  | TypeReferenceNode
  | UsingNode
  | RawNode;

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

export type ClassMember = ClassNode | ClassPropertyNode | FieldNode | MethodNode;
export interface ClassNode extends NodeBase, Attributable {
  kind: SyntaxKind.Class;
  id: string;
  visibility?: "public" | "internal" | "protected" | "private";
  members?: ClassMember[];
}

export type StructMember = FieldNode | MethodNode;
export interface StructNode extends NodeBase, Attributable {
  kind: SyntaxKind.Struct;
  id: string;
  visibility?: "public" | "internal" | "protected" | "private";
  members?: StructMember[];
}

export interface TypeReferenceNode extends NodeBase {
  kind: SyntaxKind.TypeReference;
  id: string;
  nullable?: boolean;
}

export interface FieldNode extends NodeBase {
  kind: SyntaxKind.Field;
  type: TypeReferenceNode;
  declarations: Array<{ id: string; value?: Expression }>;
  static?: boolean;
  readonly?: boolean;
  visibility?: "public" | "protected" | "private";
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

export interface MethodNode extends NodeBase, Attributable {
  kind: SyntaxKind.Method;
  id: string;
  body: RawNode[];
  returnType?: TypeReferenceNode;
  visibility?: "public" | "protected" | "private";
  override?: boolean;
  virtual?: boolean;
  abstract?: boolean;
  arguments?: ArgumentDeclarationNode[];
}

export interface ArgumentDeclarationNode {
  kind: SyntaxKind.ArgumentDeclaration;
  id: string;
  type: TypeReferenceNode;
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

/**
 * Node to have text displayed as is.
 */
export interface RawNode extends NodeBase {
  kind: SyntaxKind.Raw;
  value: string;
}
