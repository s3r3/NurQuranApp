import { BookmarkItem, CollectionBookmark } from "../types/quran.types";

export const getBookmarkKey = (item: BookmarkItem): string => {
  return `${item.surahId}-${item.nomorAyat}`;
};

export const getCollectionKey = (collection: CollectionBookmark): string => {
  return collection.id;
};

export const sortCollectionsByPin = (collections: CollectionBookmark[]): {
  pinned: CollectionBookmark[];
  unpinned: CollectionBookmark[];
} => {
  return {
    pinned: collections.filter((c) => c.isPinned),
    unpinned: collections.filter((c) => !c.isPinned),
  };
};

export const hasContent = (bookmarks: BookmarkItem[], collections: CollectionBookmark[]): boolean => {
  return bookmarks.length > 0 || collections.length > 0;
};