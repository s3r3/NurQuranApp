import AsyncStorage from "@react-native-async-storage/async-storage";
import { PrayerTimes } from "../types/quran.types";

interface CachedPrayerData {
  times: PrayerTimes;
  location: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  expiresAt: number;
}

const PRAYER_CACHE_KEY = "prayer_times_cache";
const PRAYER_CACHE_EXPIRY_DAYS = 30;

class PrayerCacheService {
  async cachePrayerTimes(
    times: PrayerTimes,
    location: string,
    latitude: number,
    longitude: number,
  ): Promise<void> {
    try {
      const cacheData: CachedPrayerData = {
        times,
        location,
        latitude,
        longitude,
        timestamp: Date.now(),
        expiresAt: Date.now() + PRAYER_CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
      };

      await AsyncStorage.setItem(
        `${PRAYER_CACHE_KEY}_${location}`,
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
      const cached = await AsyncStorage.getItem(
        `${PRAYER_CACHE_KEY}_${location}`,
      );

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
        await AsyncStorage.removeItem(`${PRAYER_CACHE_KEY}_${location}`);
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
}

export const prayerCache = new PrayerCacheService();
