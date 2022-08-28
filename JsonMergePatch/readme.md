# JsonMergePatch

Homegrown JSON Merge Patch utilities based on
[the official spec](https://datatracker.ietf.org/doc/html/rfc7396).

```ts
import { JsonMergePatch } from "path/to/JsonTools/mod.ts";
// OR
import * as JsonMergePatch from "path/to/JsonMergePatch/mod.ts";
```

## Constants

The spec declares a [MIME type](https://en.wikipedia.org/wiki/Media_type) for
JSON Merge Patch documents, which is provided here for convenience:

```ts
JsonMergePatch.MEDIA_TYPE;
```

## Utilities

### `JsonMergePatch.apply(target, patch)`

The `target` and the `patch` are expected to be valid JSON values. If the
`patch` is not a JSON Object, it is returned. Otherwise the patch is applied to
the `target`, mutating it according to the official spec.

#### Examples

When the `target` or `patch` is not a JSON object, the `target` is not mutated
and the entire `patch` is returned.

```ts
const result = JsonMergePatch.apply({}, 7);
console.log(result); // 7
```

```ts
const result = JsonMergePatch.apply(7, {});
console.log(result); // {}
```

When both the `target` and the `patch` are JSON objects, the `patch` is deeply
merged into the `target`. Properties can be inserted and updated. This mutates
the `target`.

```ts
const target = { A: { B: { C: true } } };
const patch = { A: { B: { C: false, D: ["Hello"] } } }; // update C, insert D
const result = JsonMergePatch.apply(target, patch);

console.log(result); // { A: { B: { C: false, D: ["Hello"] } } }
console.log(target === result); // true, target was mutated
```

A `null` value has a special meaning. It indicates that the corresponding
property should be deleted. This mutates the `target`.

```ts
const target = { A: { B: { C: "Delete Me" } } };
const patch = { A: { B: null } }; // remove B
const result = JsonMergePatch.apply(target, patch);

console.log(result); // { A: {} }
console.log(target === result); // true, target was mutated
```

Full example with property insertion, deletion, and updating:

```ts
const target = { A: 7, B: { C: true } };
const patch = { A: 4, B: { C: null, D: ["Hello"] } };
const result = JsonMergePatch.apply(target, patch);

console.log(result); // { A: 7, B: { D: ["Hello"] } }
console.log(target === result); // true, target was mutated
```

### `JsonMergePatch.diff(before, after)`

Create a JSON Merge Patch which would mutate `before` into `after` if used with
`apply()`.

```ts
// Example
const before = { A: 7, B: { C: true } };
const after = { A: 7, B: { D: ["Hello"] } };
const patch = JsonMergePatch.diff(before, after);

console.log(patch); // { A: 4, B: { C: null, D: ["Hello"] } };
```

## Acknowledgements

Thanks to https://github.com/pierreinglebert/json-merge-patch for inspiring the
diff algorithm.
