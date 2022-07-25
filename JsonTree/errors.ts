import { PrettyError } from "../Json/errors.ts";
import type * as Json from "../Json/types.ts";
import type * as JsonTree from "./types.ts";

export class EdgeTypeError extends PrettyError {
  constructor(
    tree: JsonTree.Tree,
    edge: JsonTree.Edge,
  ) {
    super(
      `Type of edge doesn't match tree type. Use numbers with arrays and strings with objects.`,
      { edge, tree },
    );
  }
}

export class EdgeNotFoundError extends PrettyError {
  constructor(
    tree: JsonTree.Tree,
    edge: JsonTree.Edge,
  ) {
    super(`Edge not found in tree`, { edge, tree });
  }
}

export class PrimitiveError extends PrettyError {
  constructor(
    value: Json.Value,
    edge: JsonTree.Edge,
  ) {
    super(
      `Cannot read a property of a primitive value.`,
      { edge, value },
    );
  }
}
