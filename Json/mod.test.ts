import { assert } from "https://deno.land/std@0.148.0/testing/asserts.ts";

import * as Json from "./mod.ts";

const ARRAYS: Json.Array[] = [[], [[]], [[[], []], []]];
const OBJECTS: Json.Object[] = [{}, { A: 1 }];
const COLLECTIONS = [ARRAYS, OBJECTS].flat();

const STRINGS = ["", '"Hello"', `'"`];
const NUMBERS = [123, 0, 1e4];
const BOOLEANS = [true, false];
const PRIMITIVES = [BOOLEANS, null, NUMBERS, STRINGS].flat();

const VALUES = [PRIMITIVES, COLLECTIONS].flat();

const NON_VALUES = [
  new Map(),
  new Set(),
  () => {},
  class Foo {},
  Symbol.asyncIterator,
  undefined,
  100n,
  [[100n]],
  { [Symbol.asyncIterator]: "" },
];

const TYPE_MAP: Record<Json.TypeName, Json.Value[]> = {
  array: ARRAYS,
  boolean: BOOLEANS,
  null: [null],
  number: NUMBERS,
  object: OBJECTS,
  string: STRINGS,
};

Deno.test("Json", async ({ step: t }) => {
  // Intentionally not tested
  await t(".parse()", () => {});
  await t(".prettyPrint()", () => {});
  await t(".minify()", () => {});
  await t(".clone()", () => {});

  await t(".typeOf()", () => {
    Object.entries(TYPE_MAP).forEach(([typeName, values]) =>
      values.forEach((val) => assert(Json.typeOf(val) === typeName))
    );

    NON_VALUES.slice(0, NON_VALUES.length - 2).forEach((val) =>
      assert(Json.typeOf(val) === undefined)
    );
  });

  await t(".isPrimitive()", () => {
    PRIMITIVES.forEach((val) => assert(Json.isPrimitive(val)));
    COLLECTIONS.forEach((val) => assert(!Json.isPrimitive(val)));

    NON_VALUES.forEach((val) => assert(!Json.isPrimitive(val)));
  });

  await t(".isArray()", () => {
    ARRAYS.forEach((val) => assert(Json.isArray(val)));

    PRIMITIVES.forEach((val) => assert(!Json.isArray(val)));
    OBJECTS.forEach((val) => assert(!Json.isArray(val)));
    NON_VALUES.forEach((val) => assert(!Json.isArray(val)));
    NON_VALUES.forEach((val) => assert(!Json.isArray([val])));
  });

  await t(".isObject()", () => {
    OBJECTS.forEach((val) => assert(Json.isObject(val)));

    PRIMITIVES.forEach((val) => assert(!Json.isObject(val)));
    ARRAYS.forEach((val) => assert(!Json.isObject(val)));
    NON_VALUES.forEach((val) => assert(!Json.isObject(val)));
    NON_VALUES.forEach((val) => assert(!Json.isObject({ "": val })));
  });

  await t(".isValue()", () => {
    VALUES.forEach((val) => assert(Json.isValue(val)));

    NON_VALUES.forEach((val) => assert(!Json.isValue(val)));

    assert(!Json.isValue([() => {}]));
    assert(!Json.isValue([[undefined]]));
    assert(!Json.isValue([[[100n]]]));
    assert(!Json.isValue({ "": [{ "": Symbol.asyncIterator }] }));
    assert(!Json.isValue({ "": [{ [Symbol.asyncIterator]: "" }] }));
  });

  await t(".equals()", () => {
    VALUES.forEach((val) => assert(Json.equals(val, val)));
    assert(Json.equals(
      { "foo": [0, null, false], "bar": [1, true] },
      { "foo": [0, null, false], "bar": [1, true] },
    ));

    assert(!Json.equals("A", "B"));
    assert(!Json.equals(0, 1));
    assert(!Json.equals(true, false));
    assert(!Json.equals(false, true));
    assert(!Json.equals(null, false));
    assert(!Json.equals([], {}));
    assert(!Json.equals({}, []));
    assert(
      !Json.equals(
        { "foo": [0, null, false], "bar": [1, true] },
        { "bar": [0, null, false], "foo": [1, true] },
      ),
    );
  });
});
