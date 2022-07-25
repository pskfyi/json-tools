import type * as JsonTree from "./types.ts";
import { crawl } from "./visitors.ts";

/** Translates a tree into a collection of Path/Node pairs. */
export function entries(tree: JsonTree.Tree): JsonTree.Entries {
  const entries: JsonTree.Entries = [];

  crawl(tree, ({ path, node }) => {
    entries.push([path, node]);
  });

  return entries;
}
