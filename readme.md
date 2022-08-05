# JsonTools

A collection of JSON ecosystem utilities and homegrown additions.

## Usage

<!-- deno-fmt-ignore -->
```ts
import {
  Json,     // JSON type definitions and utilities.
  JsonTree, // Homegrown utilities for JSON Arrays and Objects.
  // More coming soon
} from "path/to/json-tools";
```

See:

- [`Json`](./Json/readme.md)
- [`JsonTree`](./JsonTree/readme.md)

## Development

With [Deno](https://deno.land/) installed:

```sh
deno test   # run unit tests
deno fmt    # format files
```

## Roadmap

- [x] Json
- [x] JsonTree (homegrown)
- [ ] JsonPointer
- [ ] JSONPatch [Uses JSON Pointer]
- [ ] JSON Path
- [ ] JSON Merge Patch
- [ ] JSON Schema [Uses JSON Pointer]

<!-- ## Acknowledgements

Thanks to these repos for showing the way:

- [`json-ptr`](https://github.com/flitbit/json-ptr/)
- [`json-merge-patch`](https://github.com/pierreinglebert/json-merge-patch) -->
