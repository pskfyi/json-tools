import { Json, JsonPointer, JsonTree } from "../mod.ts";
import { decode } from "../JsonPointer/encode.ts";
import { get as getPath } from "../JsonTree/get.ts";
import { PrettyError } from "../Json/errors.ts";
import { equals } from "../Json/utilities.ts";

/** @returns the input document wrapped in an Array, for parity with other operations */
export function test(
  document: Json.Value,
  pointer: JsonPointer.Pointer,
  value: Json.Value,
): [newDoc: Json.Value] {
  const path = decode(pointer);
  const source = getPath(document as JsonTree.Tree, path);
  const valid = equals(value, source);

  if (!valid) {
    throw new PrettyError(
      `JSON Patch test operation failed.`,
      { expected: value, received: source },
    );
  }

  return [document];
}
