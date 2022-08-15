import type * as JsonTree from "./types.ts";
import { isTree } from "./guards.ts";
import { PrimitiveError } from "./errors.ts";
import { _getChild } from "./_getChild.ts";

/** Construct an iterator that crawls through a tree's children depth-first. */
export function childCrawler(
  tree: JsonTree.Tree,
): Iterable<JsonTree.Location> {
  return {
    *[Symbol.iterator]() {
      const edges = Array.isArray(tree)
        ? tree.map((_v, i) => i)
        : Object.keys(tree);

      for (const edge of edges) {
        const node = _getChild(tree, edge);

        yield { root: tree, node, path: [edge] };

        if (isTree(node)) {
          for (const location of childCrawler(node)) {
            yield {
              root: tree,
              node: location.node,
              path: [edge, ...location.path],
            };
          }
        }
      }
    },
  };
}

/** Construct an iterator that crawls through a tree's leaves depth-first. */
export function leafCrawler(
  tree: JsonTree.Tree,
): Iterable<JsonTree.Location> {
  return {
    *[Symbol.iterator]() {
      const edges = Array.isArray(tree)
        ? tree.map((_v, i) => i)
        : Object.keys(tree);

      if (!edges.length) {
        yield { root: tree, node: tree, path: [] };
      }

      for (const edge of edges) {
        const node = _getChild(tree, edge);
        const nodeIsTree = isTree(node);

        if (nodeIsTree) {
          for (const location of leafCrawler(node)) {
            yield {
              root: tree,
              node: location.node,
              path: [edge, ...location.path],
            };
          }
        } else {
          yield { root: tree, node, path: [edge] };
        }
      }
    },
  };
}

/** Construct an iterator that crawls through a tree depth-first. */
export function crawler(
  tree: JsonTree.Tree,
): Iterable<JsonTree.Location> {
  return {
    *[Symbol.iterator]() {
      yield { root: tree, node: tree, path: [] };

      for (const location of childCrawler(tree)) {
        yield location;
      }
    },
  };
}

/** Construct an iterator that walks a path through a tree. */
export function walker(
  tree: JsonTree.Tree,
  pathToWalk: JsonTree.Path,
): Iterable<JsonTree.Location> {
  return {
    *[Symbol.iterator]() {
      let path: JsonTree.Path = [];
      let intermediateTree: JsonTree.Tree = tree;
      let node: JsonTree.Node = tree;

      yield { root: tree, node, path };

      for (const edge of pathToWalk) {
        node = _getChild(intermediateTree, edge);

        path = [...path, edge];

        yield { root: tree, node, path };

        const isLast = pathToWalk.length === path.length;

        if (isLast) break;

        if (!isTree(node)) {
          throw new PrimitiveError(node, edge);
        }

        intermediateTree = node;
      }
    },
  };
}
