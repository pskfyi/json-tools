import { assert } from "https://deno.land/std@0.148.0/testing/asserts.ts";

import * as Json from "./mod.ts";

Deno.test("Json", async ({ step: t }) => {
  // Intentionally not tested
  await t(".parse()", () => {});
  await t(".prettyPrint()", () => {});
  await t(".minify()", () => {});
  await t(".clone()", () => {});

  await t(".typeOf()", () => {
    assert(Json.typeOf("") === "string");
    assert(Json.typeOf(123) === "number");
    assert(Json.typeOf(true) === "boolean");
    assert(Json.typeOf(null) === "null");
    assert(Json.typeOf({}) === "object");
    assert(Json.typeOf([]) === "array");
    assert(Json.typeOf(() => {}) === undefined);
    assert(Json.typeOf(Symbol.asyncIterator) === undefined);
    assert(Json.typeOf(undefined) === undefined);
    assert(Json.typeOf(100n) === undefined);
  });

  await t(".isPrimitive()", () => {
    assert(Json.isPrimitive(""));
    assert(Json.isPrimitive(123));
    assert(Json.isPrimitive(true));
    assert(Json.isPrimitive(null));

    assert(!Json.isPrimitive({}));
    assert(!Json.isPrimitive([]));
    assert(!Json.isPrimitive(() => {}));
    assert(!Json.isPrimitive(Symbol.asyncIterator));
    assert(!Json.isPrimitive(undefined));
    assert(!Json.isPrimitive(100n));
  });

  await t(".isArray()", () => {
    assert(Json.isArray([]));

    assert(!Json.isArray(""));
    assert(!Json.isArray(123));
    assert(!Json.isArray(true));
    assert(!Json.isArray(null));
    assert(!Json.isArray({}));
    assert(!Json.isArray(new Map()));
    assert(!Json.isArray(new Set()));
    assert(!Json.isArray(() => {}));
    assert(!Json.isArray(class Foo {}));
    assert(!Json.isArray(Symbol.asyncIterator));
    assert(!Json.isArray(undefined));
    assert(!Json.isArray(100n));

    assert(!Json.isArray([() => {}]));
    assert(!Json.isArray([[undefined]]));
    assert(!Json.isArray([[[100n]]]));
    assert(!Json.isArray([[[[Symbol.asyncIterator]]]]));
  });

  await t(".isObject()", () => {
    assert(Json.isObject({}));
    assert(Json.isObject({ "": [1, null, true] }));

    assert(!Json.isObject(""));
    assert(!Json.isObject(123));
    assert(!Json.isObject(true));
    assert(!Json.isObject(null));
    assert(!Json.isObject([]));
    assert(!Json.isObject(new Map()));
    assert(!Json.isObject(new Set()));
    assert(!Json.isObject(() => {}));
    assert(!Json.isObject(class Foo {}));
    assert(!Json.isObject(Symbol.asyncIterator));
    assert(!Json.isObject(undefined));
    assert(!Json.isObject(100n));

    assert(!Json.isObject({ "": () => {} }));
    assert(!Json.isObject({ "": [undefined] }));
    assert(!Json.isObject({ "": [[100n]] }));
    assert(!Json.isObject({ "": [{ "": Symbol.asyncIterator }] }));
    assert(!Json.isObject({ "": [{ [Symbol.asyncIterator]: "" }] }));
  });

  await t(".isValue()", () => {
    assert(Json.isValue(""));
    assert(Json.isValue(123));
    assert(Json.isValue(true));
    assert(Json.isValue(null));
    assert(Json.isValue({}));
    assert(Json.isValue([]));

    assert(!Json.isValue(() => {}));
    assert(!Json.isValue(Symbol.asyncIterator));
    assert(!Json.isValue(undefined));
    assert(!Json.isValue(100n));

    assert(!Json.isValue([() => {}]));
    assert(!Json.isValue([[undefined]]));
    assert(!Json.isValue([[[100n]]]));
    assert(!Json.isValue({ "": [{ "": Symbol.asyncIterator }] }));
    assert(!Json.isValue({ "": [{ [Symbol.asyncIterator]: "" }] }));
  });

  await t(".equals()", () => {
    assert(Json.equals("A", "A"));
    assert(Json.equals(1, 1));
    assert(Json.equals(true, true));
    assert(Json.equals(false, false));
    assert(Json.equals(null, null));
    assert(Json.equals([], []));
    assert(Json.equals({}, {}));
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
