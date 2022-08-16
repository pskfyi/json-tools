// deno-lint-ignore-file no-explicit-any
import {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.148.0/testing/asserts.ts";

import * as JsonTree from "./mod.ts";

Deno.test("JsonTree.get()", () => {
  assertEquals(JsonTree.get({}, []), {});
  assertEquals(JsonTree.get([""], [0]), "");
  assertEquals(JsonTree.get([[""]], [0, 0]), "");
  assertEquals(JsonTree.get([{ "": 1 }], [0, ""]), 1);

  assertThrows(() => JsonTree.get([""], [0, 0]));
  assertThrows(() => JsonTree.get([], [1]));
  assertThrows(() => JsonTree.get([""], ["0"]));
  assertThrows(() => JsonTree.get({ "0": 1 }, [0]));
});

Deno.test("JsonTree.isTree()", () => {
  assert(JsonTree.isTree({}));
  assert(JsonTree.isTree([]));
  assert(JsonTree.isTree({ "": [true, null, 7] }));

  assert(!JsonTree.isTree(""));
  assert(!JsonTree.isTree(123));
  assert(!JsonTree.isTree(true));
  assert(!JsonTree.isTree(null));
  assert(!JsonTree.isTree(new Map()));
  assert(!JsonTree.isTree(new Set()));
  assert(!JsonTree.isTree(() => {}));
  assert(!JsonTree.isTree(class Foo {}));
  assert(!JsonTree.isTree(Symbol.asyncIterator));
  assert(!JsonTree.isTree(undefined));
  assert(!JsonTree.isTree(100n));
  assert(!JsonTree.isTree({ "": [[100n]] }));
});

Deno.test("JsonTree.isEdge()", () => {
  assert(JsonTree.isEdge(""));
  assert(JsonTree.isEdge("Hello"));
  assert(JsonTree.isEdge(0));
  assert(JsonTree.isEdge(7));

  assert(!JsonTree.isEdge(3.14));
  assert(!JsonTree.isEdge(Infinity));
  assert(!JsonTree.isEdge(-Infinity));
  assert(!JsonTree.isEdge(NaN));
});

Deno.test("JsonTree.isPath()", () => {
  assert(JsonTree.isPath([]));
  assert(JsonTree.isPath(["", "Hello", 0, 7]));

  assert(!JsonTree.isPath(""));
  assert(!JsonTree.isPath("Hello"));
  assert(!JsonTree.isPath(0));
  assert(!JsonTree.isPath(7));

  assert(!JsonTree.isPath([3.14]));
  assert(!JsonTree.isPath([Infinity]));
  assert(!JsonTree.isPath([-Infinity]));
  assert(!JsonTree.isPath([NaN]));
});

Deno.test("JsonTree.edgeMatchesTree()", () => {
  assert(JsonTree.edgeMatchesTree([], 0));
  assert(JsonTree.edgeMatchesTree({}, ""));

  assert(!JsonTree.edgeMatchesTree([], ""));
  assert(!JsonTree.edgeMatchesTree({}, 0));
});

Deno.test("JsonTree.assertTree()", () => {
  JsonTree.assertTree({});
  JsonTree.assertTree([]);

  assertThrows(() => JsonTree.assertTree(""));
  assertThrows(() => JsonTree.assertTree(123));
  assertThrows(() => JsonTree.assertTree(true));
  assertThrows(() => JsonTree.assertTree(null));
  assertThrows(() => JsonTree.assertTree(new Map()));
  assertThrows(() => JsonTree.assertTree(new Set()));
  assertThrows(() => JsonTree.assertTree(() => {}));
  assertThrows(() => JsonTree.assertTree(class Foo {}));
  assertThrows(() => JsonTree.assertTree(Symbol.asyncIterator));
  assertThrows(() => JsonTree.assertTree(undefined));
  assertThrows(() => JsonTree.assertTree(100n));
});

Deno.test("JsonTree.assertEdge()", () => {
  JsonTree.assertEdge("");
  JsonTree.assertEdge("Hello");
  JsonTree.assertEdge(0);
  JsonTree.assertEdge(7);

  assertThrows(() => JsonTree.assertEdge(3.14));
  assertThrows(() => JsonTree.assertEdge(Infinity));
  assertThrows(() => JsonTree.assertEdge(-Infinity));
  assertThrows(() => JsonTree.assertEdge(NaN));
});

Deno.test("JsonTree.assertPath()", () => {
  JsonTree.assertPath([]);
  JsonTree.assertPath(["", "Hello", 0, 7]);

  assertThrows(() => JsonTree.assertPath(""));
  assertThrows(() => JsonTree.assertPath("Hello"));
  assertThrows(() => JsonTree.assertPath(0));
  assertThrows(() => JsonTree.assertPath(7));

  assertThrows(() => JsonTree.assertPath([3.14]));
  assertThrows(() => JsonTree.assertPath([Infinity]));
  assertThrows(() => JsonTree.assertPath([-Infinity]));
  assertThrows(() => JsonTree.assertPath([NaN]));
});

Deno.test("JsonTree.has()", () => {
  assert(JsonTree.has({}, []));
  assert(JsonTree.has([], []));
  assert(JsonTree.has([""], [0]));
  assert(JsonTree.has([[""]], [0, 0]));
  assert(JsonTree.has([{ "": 1 }], [0, ""]));
  assert(!JsonTree.has([""], [0, 0]));
  assert(!JsonTree.has([], [1]));
  assert(!JsonTree.has([""], ["0"]));
  assert(!JsonTree.has({ "0": 1 }, [0]));
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

Deno.test("JsonTree.entries()", () => {
  const tree: JsonTree.Tree = [{ "A": 6, "B": [] }, 2];

  assertEquals(
    JsonTree.entries(tree),
    [
      [[0, "A"], 6],
      [[0, "B"], []],
      [[1], 2],
    ],
  );
});

Deno.test("JsonTree.fromEntries()", () => {
  const entries: Array<[JsonTree.Path, JsonTree.Node]> = [
    [[0, "A"], 6],
    [[0, "B"], []],
    [[1], 2],
    [[2], {}],
  ];

  assertEquals(
    JsonTree.fromEntries(entries),
    [{ "A": 6, "B": [] }, 2, {}],
  );
});

Deno.test("JsonTree.map()", () => {
  const tree: JsonTree.Tree = [{ "A": 6, "B": [] }, 2];

  assertEquals(
    JsonTree.map(tree),
    new Map<JsonTree.Path, JsonTree.Node>([
      [[0, "A"], 6],
      [[0, "B"], []],
      [[1], 2],
    ]),
  );
});

Deno.test("JsonTree.fromMap()", () => {
  const map = new Map<JsonTree.Path, JsonTree.Node>([
    [[0, "A"], 6],
    [[0, "B"], []],
    [[1], 2],
    [[2], {}],
  ]);

  assertEquals(
    JsonTree.fromMap(map),
    [{ "A": 6, "B": [] }, 2, {}],
  );
});

Deno.test("JsonTree.parentPath()", () => {
  assertEquals(JsonTree.parentPath([]), undefined);
  assertEquals(JsonTree.parentPath([0]), []);
  assertEquals(JsonTree.parentPath(["", 1]), [""]);
  assertEquals(JsonTree.parentPath([1, 2, 3]), [1, 2]);
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

  // Overwrite
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

  // // Overwrite
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

Deno.test("JsonTree.test()", () => {
  assert(JsonTree.test({}, [], {}));
  assert(JsonTree.test([], [], []));
  assert(JsonTree.test([""], [0], ""));
  assert(JsonTree.test([[""]], [0, 0], ""));
  assert(JsonTree.test([{ "": 1 }], [0, ""], 1));
  assert(!JsonTree.test([""], [0, 0], ""));
  assert(!JsonTree.test([], [1], []));
  assert(!JsonTree.test([""], ["0"], ""));
  assert(!JsonTree.test({ "0": 1 }, [0], 1));
});

Deno.test("JsonTree.childCrawler()", () => {
  // tested via JsonTree.crawlChildren()
});

Deno.test("JsonTree.leafCrawler()", () => {
  // tested via JsonTree.crawlLeaves()
});

Deno.test("JsonTree.crawler()", () => {
  // tested via JsonTree.crawl()
});

Deno.test("JsonTree.walker()", () => {
  // tested via JsonTree.walk()
});

Deno.test("JsonTree.crawlChildren()", () => {
  const tree: JsonTree.Tree = [{ "A": 6, "B": 4 }, 2];
  const root = tree;
  const infoEntries: Array<[JsonTree.Path, JsonTree.Location]> = [];

  JsonTree.crawlChildren(tree, (location) => {
    infoEntries.push([location.path, location]);
  });

  assertEquals(
    infoEntries,
    [
      [[0], { root, path: [0], node: tree[0] }],
      [[0, "A"], { root, path: [0, "A"], node: 6 }],
      [[0, "B"], { root, path: [0, "B"], node: 4 }],
      [[1], { root, path: [1], node: 2 }],
    ],
  );

  assert(JsonTree.crawlChildren(tree, () => 7) === 7);
});

Deno.test("JsonTree.crawlLeaves()", () => {
  const tree: JsonTree.Tree = [{ "A": 6, "B": [] }, 2];
  const root = tree;
  const infoEntries: Array<[JsonTree.Path, JsonTree.Location]> = [];

  JsonTree.crawlLeaves(tree, (location) => {
    infoEntries.push([location.path, location]);
  });

  assertEquals(
    infoEntries,
    [
      [[0, "A"], { root, path: [0, "A"], node: 6 }],
      [[0, "B"], { root, path: [0, "B"], node: [] }],
      [[1], { root, path: [1], node: 2 }],
    ],
  );

  assert(JsonTree.crawlLeaves(tree, () => 7) === 7);
});

Deno.test("JsonTree.crawl()", () => {
  const tree: JsonTree.Tree = [{ "A": 6, "B": 4 }, 2];
  const root = tree;
  const infoEntries: Array<[JsonTree.Path, JsonTree.Location]> = [];

  JsonTree.crawl(tree, (location) => {
    infoEntries.push([location.path, location]);
  });

  assertEquals(
    infoEntries,
    [
      [[], { root, path: [], node: tree }],
      [[0], { root, path: [0], node: tree[0] }],
      [[0, "A"], { root, path: [0, "A"], node: 6 }],
      [[0, "B"], { root, path: [0, "B"], node: 4 }],
      [[1], { root, path: [1], node: 2 }],
    ],
  );

  assert(JsonTree.crawl(tree, () => 7) === 7);
});

Deno.test("JsonTree.walk()", () => {
  const tree: JsonTree.Tree = [{ "": 6 }, 0];
  const root = tree;
  const infoEntries: Array<[JsonTree.Path, JsonTree.Location]> = [];

  JsonTree.walk(tree, [0, ""], (location) => {
    infoEntries.push([location.path, location]);
  });

  assertEquals(
    infoEntries,
    [
      [[], { root, path: [], node: tree }],
      [[0], { root, path: [0], node: tree[0] }],
      [[0, ""], { root, path: [0, ""], node: 6 }],
    ],
  );

  assert(JsonTree.walk(tree, [0, ""], () => 7) === 7);

  assertThrows(() => JsonTree.walk([], [0], () => {}));
  assertThrows(() => JsonTree.walk(["A"], [0, 0], () => {}));
  assertThrows(() => JsonTree.walk([[]], [0, 0, 0], () => {}));
});

Deno.test("JsonTree.at()", () => {
  const tree: JsonTree.Tree = [{ "": 6 }];

  // No return value by default
  assert(JsonTree.at(tree, [], () => {}) === undefined);

  // If the visitor returns a value, .at() forwards it
  assert(JsonTree.at(tree, [], (i) => i.node) === tree);
  assert(JsonTree.at(tree, [0], (i) => i.node) === tree[0]);
  assert(JsonTree.at(tree, [0, ""], (i) => i.node) === 6);

  // Confirm Info.path === the input path
  const path = [0, ""];
  assertEquals(JsonTree.at(tree, path, (i) => i.path), path);

  // Confirm Info.tree === the input tree
  assert(JsonTree.at(tree, [], (i) => i.root) === tree);

  // Errors on bad paths
  assertThrows(() => JsonTree.at([], [0], () => {}));
  assertThrows(() => JsonTree.at(["A"], [0, 0], () => {}));
  assertThrows(() => JsonTree.at([[]], [0, 0, 0], () => {}));
});
