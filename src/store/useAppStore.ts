import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ================= TYPES ================= */

export interface Bookmark {
  surahId: number;
  nomorAyat: number;
  surahName: string;
  ayahText?: string;
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

/* ================= STORE ================= */

interface AppStore {
  // ===== ONBOARDING =====
  isFirstTime: boolean;
  completeOnboarding: () => void;

  // ===== OFFLINE MODE =====
  isOfflineMode: boolean;
  quranDBReady: boolean;
  lastSyncTime: number | null;

  setOfflineMode: (enabled: boolean) => void;
  setQuranDBReady: (ready: boolean) => void;
  setLastSyncTime: (time: number) => void;

  // ===== QURAN =====
  bookmarks: Bookmark[];
  collections: Collection[];
  lastRead: LastRead | null;
  searchHistory: string[];

  allSurahs: any[];
  isDataLoaded: boolean;

  setAllSurahs: (data: any[]) => void;
  addToHistory: (keyword: string) => void;

  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (surahId: number, nomorAyat: number) => void;
  isBookmarked: (surahId: number, nomorAyat: number) => boolean;

  createCollection: (name: string) => string;
  deleteCollection: (id: string) => void;
  pinCollection: (id: string) => void;
  unpinCollection: (id: string) => void;
  // ===== LOCATION (GLOBAL) =====
  location: {
    latitude: number;
    longitude: number;
  } | null;

  setLocation: (lat: number, lon: number) => void;

  addAyatToCollection: (id: string, bookmark: Bookmark) => void;
  removeAyatFromCollection: (
    id: string,
    surahId: number,
    nomorAyat: number,
  ) => void;

  isAyatInCollection: (
    id: string,
    surahId: number,
    nomorAyat: number,
  ) => boolean;

  setLastRead: (lastRead: LastRead) => void;

  // ===== PRAYER =====
  prayerTimes: any;
  locationName: string;
  isReminderActive: boolean;
  isPreNotificationActive: boolean;

  setPrayerData: (times: any, city: string) => void;
  toggleReminder: () => void;
  togglePreNotification: () => void;
}

/* ================= IMPLEMENTATION ================= */

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      /* ===== ONBOARDING ===== */
      isFirstTime: true,
      completeOnboarding: () => set({ isFirstTime: false }),

      /* ===== OFFLINE MODE ===== */
      isOfflineMode: true, // Default to offline mode
      quranDBReady: false,
      lastSyncTime: null,

      setOfflineMode: (enabled) => set({ isOfflineMode: enabled }),
      setQuranDBReady: (ready) => set({ quranDBReady: ready }),
      setLastSyncTime: (time) => set({ lastSyncTime: time }),

      /* ===== QURAN ===== */
      bookmarks: [],
      collections: [],
      lastRead: null,
      searchHistory: [],
      allSurahs: [],
      isDataLoaded: false,

      /* ===== LOCATION ===== */
      location: null,

      setLocation: (lat, lon) =>
        set({
          location: {
            latitude: lat,
            longitude: lon,
          },
        }),

      setAllSurahs: (data) => set({ allSurahs: data, isDataLoaded: true }),

      addToHistory: (keyword) =>
        set((state) => ({
          searchHistory: [
            keyword,
            ...state.searchHistory.filter((h) => h !== keyword),
          ].slice(0, 5),
        })),

      addBookmark: (newItem) =>
        set((state) => {
          if (
            state.bookmarks.some(
              (b) =>
                b.surahId === newItem.surahId &&
                b.nomorAyat === newItem.nomorAyat,
            )
          )
            return state;

          return { bookmarks: [...state.bookmarks, newItem] };
        }),

      removeBookmark: (surahId, nomorAyat) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter(
            (b) => !(b.surahId === surahId && b.nomorAyat === nomorAyat),
          ),
        })),

      isBookmarked: (surahId, nomorAyat) =>
        get().bookmarks.some(
          (b) => b.surahId === surahId && b.nomorAyat === nomorAyat,
        ),

      createCollection: (name) => {
        const id = Math.random().toString(36).slice(2);
        set((state) => ({
          collections: [
            ...state.collections,
            {
              id,
              name,
              isPinned: false,
              items: [],
              createdAt: Date.now(),
            },
          ],
        }));
        return id;
      },

      deleteCollection: (id) =>
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== id),
        })),

      pinCollection: (id) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === id ? { ...c, isPinned: true } : c,
          ),
        })),

      unpinCollection: (id) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === id ? { ...c, isPinned: false } : c,
          ),
        })),

      addAyatToCollection: (id, bookmark) =>
        set((state) => ({
          collections: state.collections.map((c) => {
            if (c.id !== id) return c;

            if (
              c.items.some(
                (i) =>
                  i.surahId === bookmark.surahId &&
                  i.nomorAyat === bookmark.nomorAyat,
              )
            )
              return c;

            return { ...c, items: [...c.items, bookmark] };
          }),
        })),

      removeAyatFromCollection: (id, surahId, nomorAyat) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === id
              ? {
                  ...c,
                  items: c.items.filter(
                    (i) =>
                      !(i.surahId === surahId && i.nomorAyat === nomorAyat),
                  ),
                }
              : c,
          ),
        })),

      isAyatInCollection: (id, surahId, nomorAyat) => {
        const c = get().collections.find((c) => c.id === id);
        return (
          c?.items.some(
            (i) => i.surahId === surahId && i.nomorAyat === nomorAyat,
          ) ?? false
        );
      },

      setLastRead: (lastRead) => set({ lastRead }),

      /* ===== PRAYER ===== */
      prayerTimes: null,
      locationName: "Detecting Location...",
      isReminderActive: true,
      isPreNotificationActive: false,

      setPrayerData: (times, city) =>
        set({ prayerTimes: times, locationName: city }),

      toggleReminder: () =>
        set((state) => ({
          isReminderActive: !state.isReminderActive,
        })),

      togglePreNotification: () =>
        set((state) => ({
          isPreNotificationActive: !state.isPreNotificationActive,
        })),
    }),
    {
      name: "app-storage", // 🔥 satu storage saja
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
