import AsyncStorage from "@react-native-async-storage/async-storage";
import { PrayerTimes } from "../types/quran.types";

interface CachedPrayerData {
  times: PrayerTimes;
  location: string;
  latitude: number;
  longitude: number;
  dateKey: string;
  timestamp: number;
  expiresAt: number;
}

const PRAYER_CACHE_KEY = "prayer_times_cache";

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const getNextDayTimestamp = () => {
  const nextDay = new Date();
  nextDay.setHours(24, 0, 0, 0);

  return nextDay.getTime();
};

class PrayerCacheService {
  private getCacheKey(location: string, dateKey = getTodayKey()) {
    return `${PRAYER_CACHE_KEY}_${location}_${dateKey}`;
  }

  async cachePrayerTimes(
    times: PrayerTimes,
    location: string,
    latitude: number,
    longitude: number,
  ): Promise<void> {
    try {
      const dateKey = getTodayKey();
      const cacheData: CachedPrayerData = {
        times,
        location,
        latitude,
        longitude,
        dateKey,
        timestamp: Date.now(),
        expiresAt: getNextDayTimestamp(),
      };

      await AsyncStorage.setItem(
        this.getCacheKey(location, dateKey),
        JSON.stringify(cacheData),
      );

      console.log(`✅ Prayer times cached for ${location}`);
    } catch (error) {
      console.error("Error caching prayer times:", error);
    }
  }

  async getCachedPrayerTimes(
    location: string,
  ): Promise<CachedPrayerData | null> {
    try {
      const todayKey = this.getCacheKey(location);
      let cached = await AsyncStorage.getItem(todayKey);

      if (!cached) {
        const legacyCached = await AsyncStorage.getItem(
          `${PRAYER_CACHE_KEY}_${location}`,
        );
        cached = legacyCached || (await this.getLatestCacheForLocation(location));
      }

      if (!cached) {
        return null;
      }

      const data = JSON.parse(cached) as CachedPrayerData;

      const now = Date.now();
      if (now > data.expiresAt) {
        console.warn(`⚠️ Prayer cache expired for ${location}`);
        return data; // Return expired data as fallback
      }

      return data;
    } catch (error) {
      console.error("Error retrieving cached prayer times:", error);
      return null;
    }
  }

  async isCacheValid(location: string): Promise<boolean> {
    try {
      const cached = await this.getCachedPrayerTimes(location);
      if (!cached) return false;

      return Date.now() <= cached.expiresAt;
    } catch (error) {
      console.error("Error checking cache validity:", error);
      return false;
    }
  }

  async clearPrayerCache(location?: string): Promise<void> {
    try {
      if (location) {
        const keys = await AsyncStorage.getAllKeys();
        const locationKeys = keys.filter((key) =>
          key.startsWith(`${PRAYER_CACHE_KEY}_${location}`),
        );
        await AsyncStorage.multiRemove(locationKeys);
      } else {
        // Clear all prayer caches
        const keys = await AsyncStorage.getAllKeys();
        const prayerKeys = keys.filter((key) =>
          key.startsWith(PRAYER_CACHE_KEY),
        );
        await AsyncStorage.multiRemove(prayerKeys);
      }

      console.log("✅ Prayer cache cleared");
    } catch (error) {
      console.error("Error clearing prayer cache:", error);
    }
  }

  async getCacheExpiration(location: string): Promise<Date | null> {
    try {
      const cached = await this.getCachedPrayerTimes(location);
      return cached ? new Date(cached.expiresAt) : null;
    } catch (error) {
      console.error("Error getting cache expiration:", error);
      return null;
    }
  }

  private async getLatestCacheForLocation(
    location: string,
  ): Promise<string | null> {
    const keys = await AsyncStorage.getAllKeys();
    const locationKeys = keys.filter((key) =>
      key.startsWith(`${PRAYER_CACHE_KEY}_${location}_`),
    );

    if (locationKeys.length === 0) {
      return null;
    }

    const cachedItems = await AsyncStorage.multiGet(locationKeys);
    const latest = cachedItems
      .map(([, value]) => {
        if (!value) return null;

        try {
          return JSON.parse(value) as CachedPrayerData;
        } catch {
          return null;
        }
      })
      .filter((item): item is CachedPrayerData => item !== null)
      .sort((a, b) => b.timestamp - a.timestamp)[0];

    return latest ? JSON.stringify(latest) : null;
  }
}

export const prayerCache = new PrayerCacheService();
