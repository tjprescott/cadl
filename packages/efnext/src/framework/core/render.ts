import { ComponentChildren, SourceNode } from "#jsx/jsx-runtime";

type RenderedTreeNode = (string | RenderedTreeNode)[];

// if this guy sees a promise somewhere in props, it can wait for resolution
// then replace that index of the array with that text.
export function render(root: SourceNode): RenderedTreeNode {
  const node: RenderedTreeNode = [];

  if (typeof root.type === "string") {
    // todo: handle intrinsic elements.
    node.push(root.type);
    return node;
  }

  // for debugging, if you like
  // node.push(root.type.name);

  const rendered = root.type(root.props);

  let children: ComponentChildren;

  if (typeof rendered === "object" && rendered !== null && "type" in rendered) {
    children = rendered.props.children;
  } else if (Array.isArray(rendered)) {
    // react allows children to be nested arbitrarily deeply in arrays, so I guess
    // flatten? I dunno, this seems super suspicious.
    children = rendered.flat(Infinity);
  } else {
    children = rendered;
  }

  if (!children) {
    return [];
  }

  children = Array.isArray(children) ? children : [children];

  for (const child of children) {
    if (typeof child === "object" && child !== null && "type" in child) {
      node.push(render(child));
    } else {
      node.push(String(child));
    }
  }

  return node;
}
