import type * as JsonTree from "./types.ts";
import { crawlLeaves } from "./visitors.ts";

/** Translates a tree into a map from Paths to leaf Nodes. */
export function map(tree: JsonTree.Tree): Map<JsonTree.Path, JsonTree.Node> {
  const pathMap = new Map<JsonTree.Path, JsonTree.Node>();

  crawlLeaves(tree, ({ path, node }) => {
    pathMap.set(path, node);
  });

  return pathMap;
}

// TODO: fromMap()
