import AsyncStorage from "@react-native-async-storage/async-storage";
import { CalendarDay } from "../types/quran.types";

type CachedFastingCalendar = {
  year: number;
  months: Record<number, CalendarDay[]>;
  timestamp: number;
};

const FASTING_CALENDAR_CACHE_KEY = "fasting_calendar_cache";

class FastingCalendarCacheService {
  private getYearKey(year: number) {
    return `${FASTING_CALENDAR_CACHE_KEY}_${year}`;
  }

  async cacheYear(
    year: number,
    months: Record<number, CalendarDay[]>,
  ): Promise<void> {
    const cacheData: CachedFastingCalendar = {
      year,
      months,
      timestamp: Date.now(),
    };

    await AsyncStorage.setItem(
      this.getYearKey(year),
      JSON.stringify(cacheData),
    );
  }

  async getCachedYear(
    year: number,
  ): Promise<CachedFastingCalendar | null> {
    const cached = await AsyncStorage.getItem(this.getYearKey(year));

    if (!cached) {
      return null;
    }

    try {
      const data = JSON.parse(cached) as CachedFastingCalendar;

      return data.year === year ? data : null;
    } catch (error) {
      console.error("Error parsing fasting calendar cache:", error);
      return null;
    }
  }

  async clearCache(year?: number): Promise<void> {
    if (year) {
      await AsyncStorage.removeItem(this.getYearKey(year));
      return;
    }

    const keys = await AsyncStorage.getAllKeys();
    const fastingKeys = keys.filter((key) =>
      key.startsWith(FASTING_CALENDAR_CACHE_KEY),
    );

    if (fastingKeys.length > 0) {
      await AsyncStorage.multiRemove(fastingKeys);
    }
  }
}

export const fastingCalendarCache = new FastingCalendarCacheService();
