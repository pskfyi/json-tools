// Core types
export type Primitive = string | number | boolean | null;
export type Array = Value[];
export type Object = { [Key in string]?: Value };
export type Value = Primitive | Array | Object;
export type Type = Value;

export type TypeName =
  | "string"
  | "number"
  | "boolean"
  | "null"
  | "object"
  | "array";
