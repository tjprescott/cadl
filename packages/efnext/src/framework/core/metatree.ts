import { RenderedTreeNode } from "./render.js";

const metaNodes = new Map<RenderedTreeNode, MetaNode>();

export interface MetaNode {
  node: RenderedTreeNode;
  parent?: MetaNode;
  contextId?: symbol;
  contextValue?: unknown;
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
