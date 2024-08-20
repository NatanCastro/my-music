export enum Type {
  File,
  Folder,
}

export type File = {
  name: string;
  type: Type.File;
};
export type Folder = {
  name: string;
  type: Type.Folder;
  children: Node[];
};

export type Node = File | Folder;

export type Root = {
  path: string;
  children: Node[];
};
