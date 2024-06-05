import { FunctionComponent } from "#jsx/jsx-runtime";
import { RenderedTreeNode } from "./render.js";

const metaNodes = new Map<RenderedTreeNode, MetaNode>();

export interface MetaNode {
  node: RenderedTreeNode;
  type?: FunctionComponent;
  parent?: MetaNode;
  contextId?: symbol;
  contextValue?: unknown;
  sourceFile?: SourceFileMetadata;
}

export interface SourceFileMetadata {
  path: string;
  fileType: "typescript";
}

export function getMeta(node: RenderedTreeNode) {
  if (!metaNodes.has(node)) {
    const newMetaNode: MetaNode = {
      node,
    };
    metaNodes.set(node, newMetaNode);
    return newMetaNode;
  }

  return metaNodes.get(node)!;
}
