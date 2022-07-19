# Json module

## Types

JSON language type definitions primarily inspired by the open source library
[`type-fest`](https://github.com/sindresorhus/type-fest).

```ts
import * as Json from "path/to/Json/types.ts";
// OR
import * as Json from "path/to/Json/mod.ts";

// Core types
const primitive: Json.Primitive = "ABC" || 123 || true || null;
const array: Json.Array = [value, value, value];
const object: Json.Object = { "string": value. "string2": value };
const value: Json.Value = array || object || primitive;
const type: Json.Type = value; // alias

// Utility types
const typeName: Json.TypeName =
  || "string" || "number" || "boolean"
  || "null"   || "object" || "array"
```

## Utilities

Helper functions for working with JSON data and serialization.

```ts
import * as Json from "path/to/Json/utilities.ts";
// OR
import * as Json from "path/to/Json/mod.ts";

// Core utilities
Json.clone(value);
Json.prettyPrint(value); // JSON.stringify(value, null, 2)
Json.minify(value); // stringify w/ no options
Json.parse(string); // parse w/ no options
Json.typeOf(anything); // returns a Json.TypeName or undefined
Json.equals(value1, value2); // deep equality per JSON Patch spec

// Type guards
Json.isValue(anything);
Json.isPrimitive(anything);
Json.isArray(anything);
Json.isObject(anything);
```
