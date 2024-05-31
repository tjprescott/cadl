import { ComponentChild, Fragment, FunctionComponent, SourceNode } from "#jsx/jsx-runtime";

type RenderedTreeNode = (string | RenderedTreeNode)[];

const intrinsicMap: Record<string, string> = {
  rb: "}",
  lb: "{",
  br: "\n",
};

export function render(root: SourceNode): RenderedTreeNode {
  if (isIntrinsicComponent(root)) {
    return [intrinsicMap[root.type]];
  }

  assertIsFunctionComponent(root);
  const node: RenderedTreeNode = [root.type.name];
  let children = root.type(root.props);

  if (!Array.isArray(children)) {
    children = [children];
  }

  children = children.flat(Infinity);

  for (const [index, child] of children.entries()) {
    if (isSourceNode(child)) {
      const childRender = render(child);
      if (child.type === Fragment) {
        node.push(...childRender);
      } else {
        node.push(childRender);
      }
    } else if (child === undefined || child === null || typeof child === "boolean") {
      continue;
    } else {
      node.push(String(child));
    }
  }

  return node;
}

function isIntrinsicComponent(node: SourceNode): node is SourceNode & { type: string } {
  return typeof node.type === "string";
}

function assertIsFunctionComponent(
  node: SourceNode
): asserts node is SourceNode & { type: FunctionComponent } {
  if (typeof node.type !== "function") {
    throw new Error("Expected function component");
  }
}

function isSourceNode(element: ComponentChild): element is SourceNode {
  return typeof element === "object" && element !== null && Object.hasOwn(element, "type");
}
