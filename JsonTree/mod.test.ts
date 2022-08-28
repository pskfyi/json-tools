// deno-lint-ignore-file no-explicit-any
import {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.148.0/testing/asserts.ts";

import * as JsonTree from "./mod.ts";

/*
  Type Guards
*/
const VALID_TREES = [{}, [], { "": [true, null, 7] }];
const INVALID_TREES = [
  "",
  123,
  true,
  null,
  new Map(),
  new Set(),
  () => {},
  class Foo {},
  Symbol.asyncIterator,
  undefined,
  100n,
  { "": [[100n]] },
];

const VALID_EDGES = ["", "Hello", 0, 7];
const INVALID_EDGES = [-5, 3.14, Infinity, -Infinity, NaN];

Deno.test("JsonTree.isTree()", () => {
  VALID_TREES.forEach((t) => assert(JsonTree.isTree(t)));
  INVALID_TREES.forEach((t) => assert(!JsonTree.isTree(t)));
});

Deno.test("JsonTree.assertTree()", () => {
  VALID_TREES.forEach((t) => JsonTree.assertTree(t));
  INVALID_TREES.forEach((t) => assertThrows(() => JsonTree.assertTree(t)));
});

Deno.test("JsonTree.isEdge()", () => {
  VALID_EDGES.forEach((e) => assert(JsonTree.isEdge(e)));
  INVALID_EDGES.forEach((e) => assert(!JsonTree.isEdge(e)));
});

Deno.test("JsonTree.assertEdge()", () => {
  VALID_EDGES.forEach((e) => JsonTree.assertEdge(e));
  INVALID_EDGES.forEach((e) => assertThrows(() => JsonTree.assertEdge(e)));
});

Deno.test("JsonTree.isPath()", () => {
  assert(JsonTree.isPath([]));
  assert(JsonTree.isPath(VALID_EDGES));
  INVALID_EDGES.forEach((e) => !JsonTree.isPath([e]));
});

Deno.test("JsonTree.assertPath()", () => {
  JsonTree.assertPath([]);
  JsonTree.assertPath(VALID_EDGES);
  INVALID_EDGES.forEach((e) => assertThrows(() => JsonTree.assertPath([e])));
});

/*
  Edge Utilities
*/
Deno.test("JsonTree.edgeMatchesTree()", () => {
  assert(JsonTree.edgeMatchesTree([], 0));
  assert(JsonTree.edgeMatchesTree({}, ""));

  assert(!JsonTree.edgeMatchesTree([], ""));
  assert(!JsonTree.edgeMatchesTree({}, 0));
});

/*
  Path Utilities: General
*/
Deno.test("JsonTree.parentPath()", () => {
  assertEquals(JsonTree.parentPath([]), undefined);
  assertEquals(JsonTree.parentPath([0]), []);
  assertEquals(JsonTree.parentPath(["", 1]), [""]);
  assertEquals(JsonTree.parentPath([1, 2, 3]), [1, 2]);
});

const VALID_TESTS: Array<[JsonTree.Tree, JsonTree.Path, JsonTree.Node]> = [
  [{}, [], {}],
  [[], [], []],
  [[""], [0], ""],
  [[[""]], [0, 0], ""],
  [[{ "": 1 }], [0, ""], 1],
];
const INVALID_TESTS: Array<[JsonTree.Tree, JsonTree.Path, JsonTree.Node]> = [
  [[null], [0], false],
  [[""], [0, 0], ""],
  [[], [1], []],
  [[""], ["0"], ""],
  [{ "0": 1 }, [0], 1],
];
const INVALID_PATHS = INVALID_TESTS.slice(1);

Deno.test("JsonTree.has()", () => {
  VALID_TESTS.forEach(([t, p]) => assert(JsonTree.has(t, p)));
  INVALID_PATHS.forEach(([t, p]) => assert(!JsonTree.has(t, p)));
});

Deno.test("JsonTree.test()", () => {
  VALID_TESTS.forEach(([t, p, n]) => assert(JsonTree.test(t, p, n)));
  INVALID_TESTS.forEach(([t, p, n]) => assert(!JsonTree.test(t, p, n)));
  assert(!JsonTree.test([null], [0], false));
});

/*
  Path Utilities: CRUD Operations
*/
Deno.test("JsonTree.get()", () => {
  VALID_TESTS.forEach(([t, p, n]) => assertEquals(JsonTree.get(t, p), n));
  INVALID_PATHS.forEach(([t, p]) => assertThrows(() => JsonTree.get(t, p)));
});

Deno.test("JsonTree.insert()", () => {
  // Ensure that it mutates the input
  const input = {};
  assert(JsonTree.insert(input, [""], 7) === input);

  // Insert
  assertEquals(JsonTree.insert({}, [""], 7), { "": 7 });
  assertEquals(JsonTree.insert([], [0], 7), [7]);
  assertEquals(JsonTree.insert([], [2], 7), [null, null, 7]);
  assertEquals(JsonTree.insert({ "": [] }, ["", 0], 7), { "": [7] });
  assertEquals(JsonTree.insert({ "": [] }, ["", 1], 7), { "": [null, 7] });

  // Overwrite
  assertThrows(() => JsonTree.insert([6], [0], 7));
  assertThrows(() => JsonTree.insert({ "": [] }, [""], 7));
  assertThrows(() => JsonTree.insert({ "": [6] }, ["", 0], 7));

  assertThrows(() => JsonTree.insert({}, [], 7));
  assertThrows(() => JsonTree.insert({}, [0], 7));
  assertThrows(() => JsonTree.insert([], [""], 7));
  assertThrows(() => JsonTree.insert([[]], [0, ""], 7));

  // Creates Intermediate Nodes
  assertEquals(JsonTree.insert([], [0, 0], 7), [[7]]);
  assertEquals(JsonTree.insert([], [0, 0, 0], 7), [[[7]]]);
  assertEquals(JsonTree.insert([], [0, "", 0], 7), [{ "": [7] } as any]);
});

Deno.test("JsonTree.remove()", () => {
  // Ensure that it mutates the input
  const input = { "": 7 };
  JsonTree.remove(input, [""]);
  assert(input === input);

  // Insert
  assertEquals(JsonTree.remove({ "": 7 }, [""]), 7);
  assertEquals(JsonTree.remove([7], [0]), 7);
  assertEquals(JsonTree.remove([5, 6, { "": 7 }], [2]), { "": 7 });
  assertEquals(JsonTree.remove({ "": [7] }, ["", 0]), 7);
  assertEquals(JsonTree.remove({ "": [6, 7] }, ["", 1]), 7);

  assertThrows(() => JsonTree.remove([], []));
  assertThrows(() => JsonTree.remove([], [0]));
  assertThrows(() => JsonTree.remove({}, [""]));
  assertThrows(() => JsonTree.remove({ "": 0 }, [0]));
  assertThrows(() => JsonTree.remove([7], [""]));
  assertThrows(() => JsonTree.remove([{}], [0, 0]));
  assertThrows(() => JsonTree.remove([[]], [0, ""]));
});

Deno.test("JsonTree.set()", () => {
  // Ensure that it mutates the input
  const input = {};
  assert(JsonTree.set(input, [""], 7) === input);

  // Insert
  assertEquals(JsonTree.set({}, [""], 7), { "": 7 });
  assertEquals(JsonTree.set([], [0], 7), [7]);
  assertEquals(JsonTree.set([], [2], 7), [null, null, 7]);
  assertEquals(JsonTree.set({ "": [] }, ["", 0], 7), { "": [7] });
  assertEquals(JsonTree.set({ "": [] }, ["", 1], 7), { "": [null, 7] });

  // Overwrite
  assertEquals(JsonTree.set([6], [0], 7), [7]);
  assertEquals(JsonTree.set({ "": [] }, [""], 7), { "": 7 } as any);
  assertEquals(JsonTree.set({ "": [6] }, ["", 0], 7), { "": [7] } as any);

  assertThrows(() => JsonTree.set({}, [], 7));
  assertThrows(() => JsonTree.set({}, [0], 7));
  assertThrows(() => JsonTree.set([], [""], 7));
  assertThrows(() => JsonTree.set([[]], [0, ""], 7));

  // Creates Intermediate Nodes
  assertEquals(JsonTree.set([], [0, 0], 7), [[7]]);
  assertEquals(JsonTree.set([], [0, 0, 0], 7), [[[7]]]);
  assertEquals(JsonTree.set([], [0, "", 0], 7), [{ "": [7] } as any]);
});

/*
  Tree Utilities: General
*/
const TREE: JsonTree.Tree = [{ "A": 6, "B": [] }, 2, {}];
const ENTRIES: Array<[JsonTree.Path, JsonTree.Node]> = [
  [[0, "A"], 6],
  [[0, "B"], []],
  [[1], 2],
  [[2], {}],
];
const MAP = new Map(ENTRIES);

Deno.test("JsonTree.entries()", () =>
  assertEquals(JsonTree.entries(TREE), ENTRIES));

Deno.test("JsonTree.fromEntries()", () =>
  assertEquals(JsonTree.fromEntries(ENTRIES), TREE));

Deno.test("JsonTree.map()", () => assertEquals(JsonTree.map(TREE), MAP));
Deno.test("JsonTree.map()", () => assertEquals(JsonTree.fromMap(MAP), TREE));

/*
  Tree Utilities: Iterables

  These are tested through the Visitors which implement them.
*/
Deno.test("JsonTree.childCrawler()", () => {});
Deno.test("JsonTree.leafCrawler()", () => {});
Deno.test("JsonTree.crawler()", () => {});
Deno.test("JsonTree.walker()", () => {});
Deno.test("JsonTree.childWalker()", () => {});

/*
  Tree Utilities: Visitors
*/
Deno.test("JsonTree.crawlChildren()", () => {
  const root: JsonTree.Tree = [{ "A": 6, "B": 4 }, 2];
  const locations: Array<JsonTree.Location> = [];

  JsonTree.crawlChildren(root, (location) => {
    locations.push(location);
  });

  assertEquals(
    locations,
    [
      { root, path: [0], node: root[0] },
      { root, path: [0, "A"], node: 6 },
      { root, path: [0, "B"], node: 4 },
      { root, path: [1], node: 2 },
    ],
  );

  // If the visitor returns a value, .crawlChildren() forwards it
  assert(JsonTree.crawlChildren(root, () => 7) === 7);
});

Deno.test("JsonTree.crawlLeaves()", () => {
  const root: JsonTree.Tree = [{ "A": 6, "B": [] }, 2];
  const locations: Array<JsonTree.Location> = [];

  JsonTree.crawlLeaves(root, (location) => {
    locations.push(location);
  });

  assertEquals(
    locations,
    [
      { root, path: [0, "A"], node: 6 },
      { root, path: [0, "B"], node: [] },
      { root, path: [1], node: 2 },
    ],
  );

  // If the visitor returns a value, .crawlLeaves() forwards it
  assert(JsonTree.crawlLeaves(root, () => 7) === 7);
});

Deno.test("JsonTree.crawl()", () => {
  const root: JsonTree.Tree = [{ "A": 6, "B": 4 }, 2];
  const locations: Array<JsonTree.Location> = [];

  JsonTree.crawl(root, (location) => {
    locations.push(location);
  });

  assertEquals(
    locations,
    [
      { root, path: [], node: root },
      { root, path: [0], node: root[0] },
      { root, path: [0, "A"], node: 6 },
      { root, path: [0, "B"], node: 4 },
      { root, path: [1], node: 2 },
    ],
  );

  // If the visitor returns a value, .crawl() forwards it
  assert(JsonTree.crawl(root, () => 7) === 7);
});

Deno.test("JsonTree.walk()", () => {
  const root: JsonTree.Tree = [{ "": 6 }, 0];
  const rootLocation = { root, path: [], node: root };

  // Walking the root path only encounters the root location
  JsonTree.walk(root, [], (location) => assertEquals(location, rootLocation));

  // Walking a child path encounters the expected locations
  const locations: Array<JsonTree.Location> = [];

  JsonTree.walk(root, [0, ""], (location) => {
    locations.push(location);
  });

  assertEquals(
    locations,
    [
      rootLocation,
      { root, path: [0], node: root[0] },
      { root, path: [0, ""], node: 6 },
    ],
  );

  // If the visitor returns a value, .walk() forwards it
  assert(JsonTree.walk(root, [0, ""], () => 7) === 7);

  // Errors on bad paths
  assertThrows(() => JsonTree.walk([], [0], () => {}));
  assertThrows(() => JsonTree.walk(["A"], [0, 0], () => {}));
  assertThrows(() => JsonTree.walk([[]], [0, 0, 0], () => {}));
});

Deno.test("JsonTree.walkChildren()", () => {
  // Walking a child path encounters the expected locations
  const root: JsonTree.Tree = [{ "": 6 }, 0];
  const locations: Array<JsonTree.Location> = [];

  JsonTree.walkChildren(root, [0, ""], (location) => {
    locations.push(location);
  });

  assertEquals(
    locations,
    [
      { root, path: [0], node: root[0] },
      { root, path: [0, ""], node: 6 },
    ],
  );

  // If the visitor returns a value, .walkChildren() forwards it
  assert(JsonTree.walkChildren(root, [0, ""], () => 7) === 7);

  // Errors on bad paths
  assertThrows(() => JsonTree.walkChildren([], [0], () => {}));
  assertThrows(() => JsonTree.walkChildren(["A"], [0, 0], () => {}));
  assertThrows(() => JsonTree.walkChildren([[]], [0, 0, 0], () => {}));
});

Deno.test("JsonTree.at()", () => {
  const tree: JsonTree.Tree = [{ "": 6 }];

  // No return value by default
  assert(JsonTree.at(tree, [], () => {}) === undefined);

  // If the visitor returns a value, .at() forwards it
  assert(JsonTree.at(tree, [], (i) => i.node) === tree);
  assert(JsonTree.at(tree, [0], (i) => i.node) === tree[0]);
  assert(JsonTree.at(tree, [0, ""], (i) => i.node) === 6);

  // Confirm Location.path === the input path
  const path = [0, ""];
  assertEquals(JsonTree.at(tree, path, (loc) => loc.path), path);

  // Confirm Location.tree === the input tree
  assert(JsonTree.at(tree, [], (loc) => loc.root) === tree);

  // Errors on bad paths
  assertThrows(() => JsonTree.at([], [0], () => {}));
  assertThrows(() => JsonTree.at(["A"], [0, 0], () => {}));
  assertThrows(() => JsonTree.at([[]], [0, 0, 0], () => {}));
});
