import * as Json from "../Json/types.ts";

/** Numbers should be integers. */
export type Edge = number | string;
export type Path = Edge[];
export type Tree = Json.Array | Json.Object;
export type Node = Json.Value;

export type Entry = [Path, Node];
export type Entries = Entry[];
export type PathMap = Map<Path, Node>;

export type Location = {
  root: Tree;
  node: Node;
  path: Path;
};
