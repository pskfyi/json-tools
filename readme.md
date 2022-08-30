# JsonTools

A collection of JSON ecosystem utilities and homegrown additions.

## Usage

<!-- deno-fmt-ignore -->
```ts
import {
  Json,           // JSON type definitions and utilities.
  JsonTree,       // Homegrown utilities for JSON Arrays and Objects.
  JsonPointer,    // JSON Pointer spec implementation & utilities.
  JsonMergePatch, // JSON Merge Patch spec implementation & utilities.
  JsonPatch,      // JSON Patch spec implementation & utilities.
  // More coming soon
} from "path/to/json-tools";
```

See:

- [`Json`](./Json/readme.md)
- [`JsonTree`](./JsonTree/readme.md)
- [`JsonPointer`](./JsonPointer/readme.md)
- [`JsonMergePatch`](./JsonMergePatch/readme.md)
- [`JsonPatch`](./JsonPatch/readme.md)

## Development

With [Deno](https://deno.land/) installed:

```sh
deno test   # run unit tests
deno fmt    # format files
```

## Roadmap

- [x] Json
- [x] JsonTree (homegrown)
- [x] JsonPointer
- [x] JsonMergePatch
- [x] JsonPatch
- [ ] JSON Path
- [ ] JSON Schema [Uses JSON Pointer]

## Acknowledgements

Thanks to these repos for showing the way:

- [`json-ptr`](https://github.com/flitbit/json-ptr/)
- [`json-merge-patch`](https://github.com/pierreinglebert/json-merge-patch)
