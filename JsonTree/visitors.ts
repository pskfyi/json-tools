import type * as JsonTree from "./types.ts";
import { isTree } from "./guards.ts";
import { _getChild } from "./_getChild.ts";
import { PrimitiveError } from "./errors.ts";
import { childCrawler, crawler, leafCrawler, walker } from "./iterables.ts";

/**
 * Crawls through a tree's children depth-first, invoking the callback
 * function at each location encountered.
 *
 * @returns the result of the callback function if it ever returns a non-undefined value.
 */
export function crawlChildren<T = undefined>(
  tree: JsonTree.Tree,
  callback: (location: JsonTree.Location) => T,
): T {
  for (const location of childCrawler(tree)) {
    const result = callback(location);
    if (result !== undefined) return result;
  }
  // merely appeases the compiler
  return undefined as unknown as T;
}

/**
 * Crawls through a tree's leaves depth-first, invoking the callback
 * function at each location encountered.
 *
 * @returns the result of the callback function if it ever returns a non-undefined value.
 */
export function crawlLeaves<T = undefined>(
  tree: JsonTree.Tree,
  callback: (location: JsonTree.Location) => T,
): T {
  for (const location of leafCrawler(tree)) {
    const result = callback(location);
    if (result !== undefined) return result;
  }
  // merely appeases the compiler
  return undefined as unknown as T;
}

/**
 * Crawls through a tree depth-first, invoking the callback function at
 * each location encountered.
 *
 * @returns the result of the callback function if it ever returns a non-undefined value.
 */
export function crawl<T = undefined>(
  tree: JsonTree.Tree,
  callback: (location: JsonTree.Location) => T,
): T {
  for (const location of crawler(tree)) {
    const result = callback(location);
    if (result !== undefined) return result;
  }
  // merely appeases the compiler
  return undefined as unknown as T;
}

/**
 * Walks a path through a tree, invoking the callback function at each
 * location encountered.
 *
 * @returns the result of the callback function if it ever returns a non-undefined value.
 */
export function walk<T = undefined>(
  tree: JsonTree.Tree,
  path: JsonTree.Path,
  callback: (location: JsonTree.Location) => T,
): T {
  for (const location of walker(tree, path)) {
    const result = callback(location);
    if (result !== undefined) return result;
  }
  // merely appeases the compiler
  return undefined as unknown as T;
}

/**
 * Invoke a callback function at a path within a tree.
 *
 * @returns the result of the callback function
 */
export function at<T = undefined>(
  tree: JsonTree.Tree,
  path: JsonTree.Path,
  callback: (location: JsonTree.Location) => T,
): T {
  let intermediateTree: JsonTree.Tree = tree;
  let node: JsonTree.Node = tree;

  for (const i in path) {
    const edge = path[i];

    node = _getChild(intermediateTree, edge);

    const isLast = Number(i) === (path.length - 1);
    if (isLast) break;

    if (!isTree(node)) {
      throw new PrimitiveError(node, edge);
    }

    intermediateTree = node;
  }

  return callback({ root: tree, path, node });
}
