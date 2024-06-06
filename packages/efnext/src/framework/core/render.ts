import { ComponentChild, ComponentChildren, FunctionComponent, SourceNode } from "#jsx/jsx-runtime";
import { setImmediate } from "node:timers/promises";
import { BuiltInParserName, format } from "prettier";
import { MetaNode, getMeta } from "./metatree.js";
import { getPrinter } from "./use-printer.js";
import { notifyResolved } from "./use-resolved.js";

export interface RenderContext {
  node?: RenderedTreeNode;
  meta?: MetaNode;
}

let renderContext: RenderContext = {
  node: undefined,
  meta: undefined,
};

export function getRenderContext() {
  return renderContext;
}

export type RenderedTreeNode = (string | RenderedTreeNode)[];

const intrinsicMap: Record<string, string> = {
  rb: "}",
  lb: "{",
  br: "\n",
};

export interface SourceFile {
  path: string;
  content: string;
}

export async function renderToSourceFiles(root: SourceNode): Promise<SourceFile[]> {
  const res = await render(root);
  const sourceFiles: SourceFile[] = [];

  // flat(1) because there is 1 nested node (for the emit context)
  for (const node of res.flat(1)) {
    if (!Array.isArray(node)) {
      // probably an error to include a string outside a source node.
      // consider emitting an error
      continue;
    }

    const meta = getMeta(node);
    console.log(meta); // This is the metanode for the sourceDirectory
    if (meta.sourceFile) {
      // When there are source directories we never get here. Are we missing flattening?
      console.log("Source file");
      sourceFiles.push({
        path: meta.sourceFile.path,
        content: await printFormatted(node, meta.sourceFile.fileType),
      });
    }
  }

  return sourceFiles;
}

export async function render(root: SourceNode): Promise<RenderedTreeNode> {
  // todo: check for forward progress.
  // I /think/ this should work to ensure render doesn't resolve until
  // all async work called from render finishes. But, it won't work
  // for any async work that is queued as a result of an resolution.

  const res = renderWorker(root);
  await setImmediate();
  await notifyResolved();

  return res;
}

export function renderWorker(root: SourceNode): RenderedTreeNode {
  if (isIntrinsicComponent(root)) {
    return [intrinsicMap[root.type]];
  }

  assertIsFunctionComponent(root);
  const node: RenderedTreeNode = [];
  const meta = getMeta(node);
  meta.parent = renderContext.meta;
  meta.type = root.type;
  const oldContext = renderContext;
  renderContext = {
    meta,
    node,
  };

  let children = root.type(root.props);
  if (children instanceof Promise) {
    children.then((children) => {
      handleChildren(node, children);
    });
  } else {
    handleChildren(node, children);
  }

  renderContext = oldContext;

  return node;
}

function handleChildren(node: RenderedTreeNode, children: ComponentChildren) {
  if (!Array.isArray(children)) {
    children = [children];
  }

  children = children.flat(Infinity);

  for (const child of children) {
    if (isSourceNode(child)) {
      const childRender = renderWorker(child);
      node.push(childRender);
    } else if (child instanceof Promise) {
      const index = node.push("{ pending }");
      child.then((v) => {
        node[index - 1] = v;
      });
    } else if (child === undefined || child === null || typeof child === "boolean") {
      continue;
    } else {
      node.push(String(child));
    }
  }
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

export async function printFormatted(
  root: RenderedTreeNode,
  filetype: BuiltInParserName
): Promise<string> {
  const raw = print(root);
  return format(raw, { parser: filetype });
}

export function print(root: RenderedTreeNode): string {
  const customPrinter = getPrinter(root);
  if (customPrinter) {
    return customPrinter(root);
  }

  return printChildren(root);
}

export function printChildren(root: RenderedTreeNode): string {
  let printed = "";
  for (const child of root) {
    if (typeof child === "string") {
      printed += child;
    } else {
      printed += print(child);
    }
  }

  return printed;
}
