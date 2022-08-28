import { assertEquals } from "https://deno.land/std@0.148.0/testing/asserts.ts";
import * as JsonMergePatch from "./mod.ts";

const before = () => ({
  title: "Goodbye!",
  author: { givenName: "John", familyName: "Doe" },
  tags: ["example", "sample"],
  content: "This will be unchanged",
});

const patch = () => ({
  title: "Hello!",
  phoneNumber: "+01-123-456-7890",
  author: { familyName: null },
  tags: ["example"],
});

const after = () => ({
  title: "Hello!",
  author: { givenName: "John" },
  tags: ["example"],
  content: "This will be unchanged",
  phoneNumber: "+01-123-456-7890",
});

Deno.test("JsonMergePatch.apply", async ({ step: t }) => {
  await t("matches the spec", () => {
    assertEquals(JsonMergePatch.apply(before(), patch()), after());
  });
  await t("mutates the target", () => {
    const target = {};
    const patch = { title: "Hello!" };
    JsonMergePatch.apply(target, patch);

    assertEquals(target, patch);
  });
});

Deno.test("JsonMergePatch", async ({ step: t }) => {
  await t("diff", () => {
    assertEquals(JsonMergePatch.diff(before(), after()), patch());
  });
});
