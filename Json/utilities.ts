import type * as Json from "./types.ts";

// Core
export function parse(string: string): Json.Value {
  return JSON.parse(string);
}

export function prettyPrint(value: Json.Value): string {
  return JSON.stringify(value, null, 2);
}

export function minify(value: Json.Value): string {
  return JSON.stringify(value);
}

export function clone<T extends Json.Value>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

/**
 * @returns a human readable type name, or undefined if the input is not JSON
 * serializable
 */
export function typeOf(input: unknown): Json.TypeName | undefined {
  const type = typeof input;

  if (
    type === "bigint" ||
    type === "function" ||
    type === "symbol" ||
    type === "undefined"
  ) {
    return undefined;
  }

  return type === "object"
    ? input === null ? "null" : Array.isArray(input) ? "array" : type
    : type;
}

// Type guards
export function isValue(input: unknown): input is Json.Value {
  return typeOf(input) !== undefined;
}

export function isPrimitive(input: unknown): input is Json.Primitive {
  const type = typeof input;
  return type === "string" || type === "boolean" || type === "number" ||
    input === null;
}

export function isArray(input: unknown): input is Json.Array {
  return Array.isArray(input);
}

export function isObject(input: unknown): input is Json.Object {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

/**
 * Deep equality by value, as defined in the RFC for JSON Patch's 'test'
 * operation: https://datatracker.ietf.org/doc/html/rfc6902#section-4.6
 */
export function equals(first: Json.Value, second: Json.Value): boolean {
  const firstType = typeOf(first);
  const secondType = typeOf(second);

  if (firstType !== secondType) {
    return false;
  }

  if (firstType === "array") {
    const _first = first as Json.Array;
    const _second = second as Json.Array;

    return (
      _first.every((item, index) => equals(item, _second[index])) &&
      _first.length === _second.length
    );
  }

  if (firstType === "object") {
    const _first = first as Json.Object;
    const _second = second as Json.Object;
    const firstKeys = Object.keys(_first);

    return (
      firstKeys.every(
        (key) =>
          key in _second &&
          equals(_first[key] as Json.Value, _second[key] as Json.Value),
      ) && firstKeys.length === Object.keys(_second).length
    );
  }

  return first === second;
}
