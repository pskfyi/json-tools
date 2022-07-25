import type * as JsonTree from "./types.ts";
import { at } from "./visitors.ts";
import { parentPath } from "./parentPath.ts";
import { assertTree } from "./guards.ts";
import { EdgeTypeError } from "./errors.ts";

function _setChild(
  tree: JsonTree.Tree,
  edge: JsonTree.Edge,
  node: JsonTree.Node,
): JsonTree.Tree {
  const edgeType = typeof edge as "string" | "number";
  const treeIsArray = Array.isArray(tree);

  if (treeIsArray && edgeType === "number") {
    const i = edge as number;
    const diff = i - tree.length;

    if (diff > 0) {
      tree.push(...Array(diff).fill(null));
    }

    tree[i] = node;
  } else if (!treeIsArray && edgeType === "string") {
    tree[edge] = node;
  } else {
    throw new EdgeTypeError(tree, edge);
  }

  return tree;
}

/**
 * Insert or overwrite a descendant in the tree if able. Creates intermediary
 * arrays and objects as needed.
 *
 * If setting the value would create empty entries in an array, those entries
 * are set to null instead.
 *
 * Throws in the following cases:
 * - The path is invalid within the tree
 * - The path points to the root of the tree
 *
 * @returns the mutated input, for convenience
 */
export function set<T extends JsonTree.Tree>(
  tree: T,
  path: JsonTree.Path,
  node: JsonTree.Node,
): T {
  const _parentPath = parentPath(path);

  if (_parentPath === undefined) {
    throw new Error("JsonTree.set() cannot replace the entire tree.");
  }

  at(tree, _parentPath, (location) => {
    const tree = location.node;
    assertTree(tree);

    const edge = path[path.length - 1];
    _setChild(tree, edge, node);
  });

  return tree;
}
