import {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.148.0/testing/asserts.ts";
import * as JsonTree from "../JsonTree/types.ts";
import * as JsonPointer from "./mod.ts";

// Test cases inferred from https://datatracker.ietf.org/doc/html/rfc6901

const ESCAPE_EXAMPLES: Array<[string, JsonPointer.Token]> = [
  ["", ""],
  ["foo", "foo"],
  ["~", "~0"],
  ["/", "~1"],
  ["~/", "~0~1"],
  ["/~", "~1~0"],
];
const VALID_TOKENS = ESCAPE_EXAMPLES.map(([_, token]) => token);
const INVALID_TOKENS = ESCAPE_EXAMPLES.slice(2).map(([str]) => str);

const POINTER_EXAMPLES: Array<[JsonPointer.Pointer, JsonTree.Path]> = [
  ["", []],
  ["/", [""]],
  ["/ ", [" "]],
  ["//", ["", ""]],
  ["/foo", ["foo"]],
  ["/7", [7]],
  ["/07", ["07"]],
  ["/~0", ["~"]],
  ["/~1", ["/"]],
  ["/~01", ["~1"]],
  ["/foo/bar", ["foo", "bar"]],
  ["/foo/7", ["foo", 7]],
  ["/foo/07", ["foo", "07"]],
  ["/6/bar", [6, "bar"]],
  ["/6/7", [6, 7]],
  ["/A/B/C", ["A", "B", "C"]],
  ["/foo/7/bar", ["foo", 7, "bar"]],
  ["/fo~1oo/ba~0rr", ["fo/oo", "ba~rr"]],
];

const VALID_POINTERS = POINTER_EXAMPLES.map(([pointer]) => pointer);
const INVALID_POINTERS: string[] = ["foo", "7", "~0", "~1", "/~", "/~2", "/~5"];

const TOKEN_EXAMPLES: Array<[JsonPointer.Token, JsonTree.Edge]> = [
  ["0", 0],
  ["7", 7],
  ["07", "07"],
  ["77", 77],
];

Deno.test("JsonPointer", async ({ step: t }) => {
  await t(".isToken()", () => {
    VALID_TOKENS.forEach((token) => assert(JsonPointer.isToken(token)));
    INVALID_TOKENS.forEach((str) => assert(!JsonPointer.isToken(str)));
  });

  await t(".assertToken()", () => {
    VALID_TOKENS.forEach((token) => JsonPointer.assertToken(token));
    INVALID_TOKENS.forEach((str) =>
      assertThrows(() => JsonPointer.assertToken(str))
    );
  });

  await t(".isPointer()", () => {
    VALID_POINTERS.forEach((ptr) => assert(JsonPointer.isPointer(ptr)));
    INVALID_POINTERS.forEach((str) => assert(!JsonPointer.isPointer(str)));
  });

  await t(".assertPointer()", () => {
    VALID_POINTERS.forEach((ptr) => JsonPointer.assertPointer(ptr));
    INVALID_POINTERS.forEach((str) =>
      assertThrows(() => JsonPointer.assertPointer(str))
    );
  });

  await t(".escape()", () => {
    ESCAPE_EXAMPLES.forEach(([str, token]) =>
      assertEquals(JsonPointer.escape(str), token)
    );
  });

  await t(".isEscaped()", () => {
    VALID_TOKENS.forEach((token) => assert(JsonPointer.isEscaped(token)));
  });

  await t(".unescape()", () => {
    ESCAPE_EXAMPLES.forEach(([str, token]) =>
      assertEquals(JsonPointer.unescape(token), str)
    );
  });

  await t(".isUnescaped()", () => {
    INVALID_TOKENS.forEach((str) => assert(JsonPointer.isUnescaped(str)));
  });

  await t(".encodeToken()", () => {
    TOKEN_EXAMPLES.forEach(([token, edge]) =>
      assertEquals(JsonPointer.encodeToken(edge), token)
    );
    ESCAPE_EXAMPLES.forEach(([str, token]) =>
      assertEquals(JsonPointer.encodeToken(str), token)
    );
  });

  await t(".decodeToken()", () => {
    TOKEN_EXAMPLES.forEach(([token, edge]) =>
      assertEquals(JsonPointer.decodeToken(token), edge)
    );
    ESCAPE_EXAMPLES.forEach(([str, token]) =>
      assertEquals(JsonPointer.decodeToken(token), str)
    );
  });

  await t(".encode()", () => {
    POINTER_EXAMPLES.forEach(([pointer, path]) =>
      assertEquals(JsonPointer.encode(path), pointer)
    );
  });

  await t(".decode()", () => {
    POINTER_EXAMPLES.forEach(([pointer, path]) =>
      assertEquals(JsonPointer.decode(pointer), path)
    );
    INVALID_POINTERS.forEach((str) =>
      assertThrows(() => JsonPointer.decode(str))
    );
  });

  await t(".parsePointer()", () => {
    POINTER_EXAMPLES.forEach(([pointer, path]) =>
      assertEquals(JsonPointer.parsePointer(pointer), path)
    );
  });

  await t(".parent()", () => {
    assertEquals(JsonPointer.parent(""), undefined);
    assertEquals(JsonPointer.parent("/"), "");
    assertEquals(JsonPointer.parent("//"), "/");
    assertEquals(JsonPointer.parent("/foo"), "");
    assertEquals(JsonPointer.parent("/foo/bar"), "/foo");
    assertEquals(JsonPointer.parent("/foo/bar/baz"), "/foo/bar");
  });
});
