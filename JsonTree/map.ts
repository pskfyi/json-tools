import type * as JsonTree from "./types.ts";
import { crawl } from "./visitors.ts";

/** Translates a tree into a map from Paths to Nodes. */
export function map(tree: JsonTree.Tree): Map<JsonTree.Path, JsonTree.Node> {
  const pathMap = new Map<JsonTree.Path, JsonTree.Node>();

  crawl(tree, ({ path, node }) => {
    pathMap.set(path, node);
  });

  return pathMap;
}
