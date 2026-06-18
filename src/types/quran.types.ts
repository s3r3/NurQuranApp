export type Ayah = {
  numberInSurah: number;
  text: string;
  textIndonesian: string;
  textEnglish?: string;
  number: number;
  surah?: {
    englishName: string;
    number: number;
  };
  audioUrl?: string;
  nomorAyat: number;
  teksArab: string;
  teksIndonesia: string;
  teksInggris?: string;
  audio: AudioSources;
};

export type JuzData = {
  ayahs: Ayah[];
};

export type Language = "id" | "en";

export type AyatActionProps = {
  ayatNumber: number;
  isBookmarked: boolean;
  isPlaying: boolean;
  onShare: () => void;
  onPlay: () => void;
  onBookmark: () => void;
  onBookmarkLongPress?: () => void;
};
// Add new types for Surah
export type AudioSources = {
  [key: string]: string;
};

export type AyatJuzItemsProps = {
  item: Ayah;
  juzId: number;
  language: "id" | "en";
  isBookmarked: boolean;
  isPlaying: boolean;
  onShare: () => void;
  onPlay: () => void;
  onBookmark: () => void;
  onBookmarkLongPress?: () => void;
};

export type Surah = {
  nomor?: number;
  namaLatin: string;
  arti: string;
  tempatTurun: string;
  jumlahAyat: number;
  nama: string;
  deskripsi?: string;
  audioFull?: AudioSources;
  ayat: Ayah[];
};
export type AyahItemCollection = {
  surahId: number;
  nomorAyat: number;
  surahName: string;
  ayahText: string;
};

export type Collection = {
  id: string;
  name: string;
  isPinned: boolean;
  items?: AyahItemCollection[];
};

export type CollectionDetailRouteParams = {
  collectionId: string;
  collectionName: string;
};

export type BookmarkItem = {
  surahId: number;
  nomorAyat: number;
  surahName: string;
  ayahText?: string;
};

export type CollectionBookmark = {
  id: string;
  name: string;
  isPinned: boolean;
  items?: any[];
};

export type CreateCollectionOptions = {
  name: string;
};

export type CollectionActionType = "pin" | "unpin" | "delete";

export type NotificationType = "fasting" | "event";

export type SurahHome = {
  nomor: number;
  nama: string;
  namaLatin: string;
  arti: string;
  jumlahAyat: number;
  tempatTurun: string;
  deskripsi?: string;
  audioFull?: AudioSources;
};

export type LastRead = {
  source?: "surah" | "juz";
  surahId: number;
  surahName: string;
  nomorAyat: number;
  namaLatin: string;
  juzId?: number;
};

export type HomeTab = "Surah" | "Para";

export type TabConfig = {
  id: HomeTab;
  label: string;
  icon?: string;
};

export type PrayerName = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

export const PRAYER_NAMES: PrayerName[] = [
  "Fajr",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
];

export type PrayerTimes = Record<PrayerName, string>;

export type PrayerTimings = {
  [key: string]: string;
};

//interfaces
export interface AyatSurahItemProps {
  item: {
    nomorAyat: number;
    teksArab: string;
    teksIndonesia: string;
    teksInggris?: string;
  };
  index: number;
  language: "id" | "en";
  isBookmarked: boolean;
  isPlaying: boolean;
  isLoadingAudio: boolean;
  onShare: () => void;
  onPlay: () => void;
  onBookmark: () => void;
  onBookmarkLongPress: () => void;
}
export interface CalendarDay {
  date: string;
  day: number;
  month: number;
  year: number;
  hijriDay: string;
  hijriMonth: string;
  hijriMonthNumber: number;
  hijriYear: string;
  dayOfWeek: number;
}

export interface IslamicEvent {
  label: string;
  description: string;
  hijriDate: string;
}

export interface FastingEvent {
  label: string;
  color: string;
  description: string;
}

export interface SelectedEvent {
  islamicEvent: IslamicEvent | null;
  fastingEvent: FastingEvent | null;
  gregorianDate: string;
}

export interface UpcomingNotification {
  type: "fasting" | "event";
  title: string;
  body: string;
  date: Date;
  identifier: string;
}

export interface PrayerLocation {
  latitude: number;
  longitude: number;
  name: string;
}

export interface PrayerInfo {
  name: PrayerName;
  time: Date;
  isCurrent: boolean;
  isLast: boolean;
}

export interface PrayerTimesResponse {
  code: number;
  data: {
    timings: PrayerTimings;
    date: {
      readable: string;
      timestamp: string;
    };
    meta: {
      latitude: number;
      longitude: number;
      timezone: string;
      method: {
        id: number;
        name: string;
      };
    };
  };
}

export interface Quran {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
}

export interface AyahData {
  nomorSurah: number;
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
}
