import { Json, JsonPointer, JsonTree } from "../mod.ts";
import { decode } from "../JsonPointer/encode.ts";
import { remove as removePath } from "../JsonTree/remove.ts";

/** @returns the mutated document, and the value that resided at the destination before the operation, wrapped in an Array */
export function remove(
  document: Json.Value,
  pointer: JsonPointer.Pointer,
): [newDoc: Json.Value | undefined, replacedVal: Json.Value] {
  if (pointer.length === 0) return [undefined, document];

  const removed = removePath(document as JsonTree.Tree, decode(pointer));

  return [document, removed];
}
