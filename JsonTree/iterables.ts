import type * as JsonTree from "./types.ts";
import { isTree } from "./guards.ts";
import { PrimitiveError } from "./errors.ts";
import { _getChild } from "./_getChild.ts";

/** Construct an iterator that crawls through a tree's children depth-first. */
export function childCrawler(
  root: JsonTree.Tree,
): Iterable<JsonTree.Location> {
  return {
    *[Symbol.iterator]() {
      const edges = Array.isArray(root)
        ? root.map((_v, i) => i)
        : Object.keys(root);

      for (const edge of edges) {
        const node = _getChild(root, edge);

        yield { root, node, path: [edge] };

        if (isTree(node)) {
          for (const location of childCrawler(node)) {
            yield {
              root,
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
  root: JsonTree.Tree,
): Iterable<JsonTree.Location> {
  return {
    *[Symbol.iterator]() {
      const edges = Array.isArray(root)
        ? root.map((_v, i) => i)
        : Object.keys(root);

      if (!edges.length) {
        yield { root, node: root, path: [] };
      }

      for (const edge of edges) {
        const node = _getChild(root, edge);
        const nodeIsTree = isTree(node);

        if (nodeIsTree) {
          for (const location of leafCrawler(node)) {
            yield {
              root,
              node: location.node,
              path: [edge, ...location.path],
            };
          }
        } else {
          yield { root, node, path: [edge] };
        }
      }
    },
  };
}

/** Construct an iterator that crawls through a tree depth-first. */
export function crawler(
  root: JsonTree.Tree,
): Iterable<JsonTree.Location> {
  return {
    *[Symbol.iterator]() {
      yield { root, node: root, path: [] };

      for (const location of childCrawler(root)) {
        yield location;
      }
    },
  };
}

/** Construct an iterator that walks a path through a tree. */
export function walker(
  root: JsonTree.Tree,
  pathToWalk: JsonTree.Path,
): Iterable<JsonTree.Location> {
  return {
    *[Symbol.iterator]() {
      yield { root, node: root, path: [] };

      let intermediateTree: JsonTree.Tree = root;
      let path: JsonTree.Path = [];
      let node: JsonTree.Node;

      for (const edge of pathToWalk) {
        node = _getChild(intermediateTree, edge);
        path = [...path, edge];

        yield { root, node, path };

        const isLast = pathToWalk.length === path.length;
        if (isLast) break;

        if (!isTree(node)) throw new PrimitiveError(node, edge);
        intermediateTree = node;
      }
    },
  };
}
