import { ComponentChild } from "#jsx/jsx-runtime";

type RenderedTreeNode = (string | RenderedTreeNode)[];

/**
 * Recursively renders a component tree to a flattened array of strings and nested arrays.
 *
 * @param {ComponentChild} root - The root component or element to render.
 * @returns {RenderedTreeNode} - A flattened array representing the rendered component tree.
 *
 * The `renderTree` function takes a component tree represented by the `root` parameter and recursively
 * processes it to produce a flattened array of strings and nested arrays. The function handles various types
 * of nodes, including primitive types (string, number, boolean), arrays, intrinsic elements, and functional components.
 *
 * - If `root` is `null` or `undefined`, it returns an empty array.
 * - If `root` is a primitive type (string, number, or boolean), it converts it to a string and returns it as a single-element array.
 * - If `root` is an array, it recursively renders each element in the array and flattens the result.
 * - If `root` is an object with a `type` property, it handles it based on the type:
 *   - If the `type` is a string, it checks for intrinsic elements (`rb`, `lb`, `br`) and replaces them with `}`, `{`, and `\n` respectively.
 *     It then processes the children of the element recursively.
 *   - If the `type` is a function, it treats it as a functional component, calls the function with `props`, and recursively renders the result.
 * - If none of the above conditions are met, it returns an empty array as a fallback.
 *
 * Helper function `flattenArray` is used to flatten nested arrays into a single-level array.
 */
export function render(root: ComponentChild): RenderedTreeNode {
  // Base case: if the root is null or undefined, return an empty array.
  if (root === null || root === undefined) {
    return [];
  }

  // Handle primitive types (string, number, boolean).
  if (typeof root === "string" || typeof root === "number" || typeof root === "boolean") {
    return [String(root)];
  }

  // Handle arrays by recursively rendering each element and flattening the result.
  if (Array.isArray(root)) {
    return (root.map(render) as any).flat(Infinity);
  }

  // Handle objects with a `type` property.
  if (typeof root === "object" && root !== null && "type" in root) {
    // Handle intrinsic elements if the type is a string.
    if (typeof root.type === "string") {
      const intrinsicMap: Record<string, string> = {
        rb: "}",
        lb: "{",
        br: "\n",
      };

      const node: RenderedTreeNode = [];
      const mappedType = intrinsicMap[root.type] || root.type;
      node.push(mappedType);

      // Process children recursively if they exist.
      if (root.props.children) {
        const children = Array.isArray(root.props.children)
          ? root.props.children
          : [root.props.children];
        for (const child of children) {
          node.push(...render(child));
        }
      }
      return node;
    }

    // Handle functional components if the type is a function.
    if (typeof root.type === "function") {
      const rendered = root.type(root.props);
      if (Array.isArray(rendered)) {
        return (rendered.map(render) as any).flat(Infinity);
      }
      return render(rendered);
    }
  }

  // Fallback case: return an empty array if none of the conditions are met.
  return [];
}
