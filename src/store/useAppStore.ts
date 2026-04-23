import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppState {
  isFirstTime: boolean;
  completeOnboarding: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isFirstTime: true, // Defaultnya true (user baru)
      completeOnboarding: () => set({ isFirstTime: false }),
    }),
    {
      name: "app-storage", // Nama key di storage
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export interface Bookmark {
  surahId: number;
  nomorAyat: number;
  surahName: string;
  ayahText?: string; // Optional ayah text
}

interface LastRead {
  surahId: number;
  surahName: string;
  nomorAyat: number;
  namaLatin: string;
}

export interface Collection {
  id: string;
  name: string;
  isPinned: boolean;
  items: Bookmark[];
  createdAt: number;
}

interface QuranState {
  bookmarks: Bookmark[]; // Standalone bookmarks (tidak dalam collection)
  collections: Collection[];
  lastRead: LastRead | null;

  searchHistory: string[];

  allSurahs: any[];
  isDataLoaded: boolean;
  setAllSurahs: (data: any[]) => void;

  // Search history methods
  addToHistory: (keyword: string) => void;

  // Bookmark methods
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (surahId: number, nomorAyat: number) => void;
  isBookmarked: (surahId: number, nomorAyat: number) => boolean;

  // Collection methods
  createCollection: (name: string) => string;
  deleteCollection: (collectionId: string) => void;
  pinCollection: (collectionId: string) => void;
  unpinCollection: (collectionId: string) => void;
  addAyatToCollection: (collectionId: string, bookmark: Bookmark) => void;
  removeAyatFromCollection: (
    collectionId: string,
    surahId: number,
    nomorAyat: number,
  ) => void;
  isAyatInCollection: (
    collectionId: string,
    surahId: number,
    nomorAyat: number,
  ) => boolean;

  // Other methods
  setLastRead: (lastRead: LastRead) => void;
}
export const useQuranStore = create<QuranState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      lastRead: null,
      collections: [],

      searchHistory: [],
      // Search history methods
      addToHistory: (keyword) =>
        set((state) => ({
          searchHistory: [
            keyword,
            ...state.searchHistory.filter((h) => h !== keyword),
          ].slice(0, 5),
        })),

      allSurahs: [],
      isDataLoaded: false,
      setAllSurahs: (data) => set({ allSurahs: data, isDataLoaded: true }),
      // Bookmark methods
      addBookmark: (newItem) =>
        set((state) => {
          // Check if already bookmarked
          if (
            state.bookmarks.some(
              (b) =>
                b.surahId === newItem.surahId &&
                b.nomorAyat === newItem.nomorAyat,
            )
          ) {
            return state;
          }
          return { bookmarks: [...state.bookmarks, newItem] };
        }),

      removeBookmark: (surahId, nomorAyat) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter(
            (b) => !(b.surahId === surahId && b.nomorAyat === nomorAyat),
          ),
        })),

      isBookmarked: (surahId, nomorAyat) => {
        return get().bookmarks.some(
          (b) => b.surahId === surahId && b.nomorAyat === nomorAyat,
        );
      },

      // Collection methods
      createCollection: (name) => {
        const newId = Math.random().toString(36).substr(2, 9);
        set((state) => ({
          collections: [
            ...state.collections,
            {
              id: newId,
              name,
              isPinned: false,
              items: [],
              createdAt: Date.now(),
            },
          ],
        }));
        return newId;
      },

      deleteCollection: (collectionId) =>
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== collectionId),
        })),

      pinCollection: (collectionId) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId ? { ...c, isPinned: true } : c,
          ),
        })),

      unpinCollection: (collectionId) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId ? { ...c, isPinned: false } : c,
          ),
        })),

      addAyatToCollection: (collectionId, bookmark) =>
        set((state) => ({
          collections: state.collections.map((c) => {
            if (c.id === collectionId) {
              const items = c.items || [];
              // Check if already in collection
              if (
                items.some(
                  (item) =>
                    item.surahId === bookmark.surahId &&
                    item.nomorAyat === bookmark.nomorAyat,
                )
              ) {
                return c;
              }
              return {
                ...c,
                items: [...items, bookmark],
              };
            }
            return c;
          }),
        })),

      removeAyatFromCollection: (collectionId, surahId, nomorAyat) =>
        set((state) => ({
          collections: state.collections.map((c) => {
            if (c.id === collectionId) {
              return {
                ...c,
                items: (c.items || []).filter(
                  (item) =>
                    !(item.surahId === surahId && item.nomorAyat === nomorAyat),
                ),
              };
            }
            return c;
          }),
        })),

      isAyatInCollection: (collectionId, surahId, nomorAyat) => {
        const collection = get().collections.find((c) => c.id === collectionId);
        return (
          (collection?.items || []).some(
            (item) => item.surahId === surahId && item.nomorAyat === nomorAyat,
          ) ?? false
        );
      },

      setLastRead: (lastRead) => set({ lastRead }),
    }),
    {
      name: "quran-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
