# Json

Core JSON typedefs and utilities.

```ts
import { Json } from "path/to/JsonTools/mod.ts";
// OR
import * as Json from "path/to/Json/mod.ts";
```

## Types

JSON language type definitions primarily inspired by the open source library
[`type-fest`](https://github.com/sindresorhus/type-fest).

<!-- deno-fmt-ignore -->
```ts
Json.Primitive  // string | number | boolean | null;
Json.Array      // Json.Value[];
Json.Object     // Partial<Record<string, Json.Value>>
Json.Value      // Json.Primitive | Json.Object | Json.Array
Json.Type       // Json.Value (alias)

// used by Json.typeOf() and Json.shallowTypeOf()
Json.TypeName   // "string" | "number" | "boolean"
                // | "null" | "object" | "array"
```

## Utilities

Helper functions for working with JSON data and serialization.

<!-- deno-fmt-ignore -->
```ts
Json.clone(value);
Json.prettyPrint(value);      // just JSON.stringify(value, null, 2)
Json.minify(value);           // just JSON.stringify(value)
Json.parse(string);           // just JSON.parse(string)

Json.typeOf(anything);        // Json.TypeName | undefined
Json.shallowTypeOf(anything); // doesn't check array/obj children

Json.equals(value1, value2);  // deep equality per JSON Patch spec

// Type guards
Json.isValue(anything);
Json.isPrimitive(anything);
Json.isArray(anything);
Json.isObject(anything);
Json.isObjectShallow(anything); // confirms it's not null, Array, Map, Set, etc.
```
