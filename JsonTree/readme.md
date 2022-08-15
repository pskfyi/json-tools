# JsonTree

This module introduces 3 interrelated concepts, and assorted types and utilities
for applying them:

- A `Json.Array` or `Json.Object` is a
  [tree](https://en.wikipedia.org/wiki/Glossary_of_graph_theory#tree), a type of
  graph.

- The [edges](https://en.wikipedia.org/wiki/Glossary_of_graph_theory#edge) of
  this graph are represented by array indices (integers) and object keys
  (strings).

- The [path](https://en.wikipedia.org/wiki/Glossary_of_graph_theory#path) to a
  [node](https://en.wikipedia.org/wiki/Glossary_of_graph_theory#node) within the
  tree can be represented as a sequence of integers and strings.

These concepts are applied to provide functionality similar to JSON
Pointer-based operations.

## Types

<!-- deno-fmt-ignore -->
```ts
JsonTree.Tree;      // Json.Array | Json.Object
JsonTree.Node;      // Json.Value
JsonTree.Edge;      // string | number (should be an integer)
JsonTree.Path;      // Edge[]

JsonTree.Location;  // { root: Tree, path: Path, node: Node }
```

## Utilities

### Type Guards

Return a `boolean` indicating whether the input is the required type.

See:
https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates

```ts
JsonTree.isTree(input);
JsonTree.isEdge(input);
JsonTree.isPath(input);
```

#### Type Assertions

Same as the above type guards, except they throw when the input is not the
required type.

See:
https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions

```ts
JsonTree.assertTree(input);
JsonTree.assertEdge(input);
JsonTree.assertPath(input);
```

### Edge Utilities

```ts
JsonTree.edgeMatchesTree(tree, edge); // ex. array & integer -> true
```

### Path Utilities

```ts
JsonTree.parentPath(path); // ex. [1,2,3] => [1,2]

JsonTree.has(tree, path);
JsonTree.test(tree, path, node); // uses Json.equals

JsonTree.get(tree, path);
JsonTree.set(tree, path, node);
JsonTree.insert(tree, path, node);
JsonTree.remove(tree, path);
```

### Tree Utilities

These utilities decompose a tree into a simpler data structure.

<!-- deno-fmt-ignore -->
```ts
JsonTree.map(tree);     // Map<Path, Json.Value>
JsonTree.entries(tree); // Array<[Path, Json.Value]>
```

#### Iterables

An
[iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#iterables)
is a JS construct which can be looped over via a `for...of` loop. The library
provides multiple functions which produce iterables for trees. Each iteration
loop returns a `Location` object with 3 properties:

- **Location.root** - the input `Tree`
- **Location.path** - the node's `Path` within the `Tree`
- **Location.node** - the `Node` at that `Path` within the `Tree`

##### `JsonTree.crawler(tree)`

Creates an iterable for the entire tree, depth-first.

<!-- deno-fmt-ignore -->
```ts
const tree = { "x": 1, "y": [null] };

for (const location of JsonTree.crawler(tree)) { /*
  1st loop -> location.path = []        location.node = tree
  2nd loop -> location.path = ["x"]     location.node = 1
  3rd loop -> location.path = ["y"]     location.node = [null]
  4th loop -> location.path = ["y", 0]  location.node = null
*/ }
```

##### `JsonTree.childCrawler(tree)`

Same as above, except the first loop is omitted.

##### `JsonTree.walker(tree, path)`

Creates an iterable for the specified path within the tree.

<!-- deno-fmt-ignore -->
```ts
const tree = { "x": 1, "y": [null] };
const pathToWalk = ["y", 0];

for (const location of JsonTree.walker(tree, pathToWalk)) { /*
  1st loop -> location.path = []        location.node = tree
  2nd loop -> location.path = ["y"]     location.node = [null]
  3rd loop -> location.path = ["y", 0]  location.node = null
*/ }
```

#### Visitor Functions

These wrap the [iterables](#iterables) above to implement the
[visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern), invoking a
callback function at each `Location` encountered. If the callback ever returns a
non-`undefined` value, the visitor function stops iterating and returns that
value.

```ts
JsonTree.crawlChildren(tree, callback);
JsonTree.crawl(tree, callback);
JsonTree.walk(tree, path, callback);
JsonTree.at(tree, path, callback); // call at the end of the path
```
