import { clone } from "../Json/utilities.ts";
import { decode } from "../JsonPointer/encode.ts";
import { get as getPath } from "../JsonTree/get.ts";
import { isTree } from "../JsonTree/guards.ts";
import type { Json, JsonPointer } from "../mod.ts";
import { add } from "./add.ts";

/** @returns the mutated document, and the value that resided at the destination before the operation, wrapped in an Array */
export function copy(
  document: Json.Value,
  destination: JsonPointer.Pointer,
  source: JsonPointer.Pointer,
): [newDoc: Json.Value, replacedVal: Json.Value | undefined] {
  isTree(document);

  const value = isTree(document)
    ? clone(getPath(document, decode(source)))
    : document;
  const [d2, replaced] = add(document, destination, value);

  return [d2, replaced];
}
