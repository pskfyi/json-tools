import type * as JsonTree from "./types.ts";
import { crawlLeaves } from "./visitors.ts";

/** Translates a tree into a collection of Path & leaf Node pairs. */
export function entries(
  tree: JsonTree.Tree,
): Array<[JsonTree.Path, JsonTree.Node]> {
  const entries: Array<[JsonTree.Path, JsonTree.Node]> = [];

  crawlLeaves(tree, ({ path, node }) => {
    entries.push([path, node]);
  });

  return entries;
}

// TODO: fromEntries()
