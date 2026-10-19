export type ItemKind = "link" | "note";

export interface SavedItem {
  id: string;
  kind: ItemKind;
  title: string;
  url: string;
  description: string;
  collectionId: string | null;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  createdAt: string;
}

export interface ItemInput {
  kind: ItemKind;
  title: string;
  url: string;
  description: string;
  collectionId: string | null;
}

export interface VaultData {
  version: 1;
  items: SavedItem[];
  collections: Collection[];
}
