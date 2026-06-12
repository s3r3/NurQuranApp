import { useState, useCallback } from "react";
import { prayerCache } from "../services";
import { PrayerTimes } from "../types/quran.types";

export const usePrayerOffline = () => {
  const [cachedData, setCachedData] = useState<PrayerTimes | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [cacheExpiry, setCacheExpiry] = useState<Date | null>(null);

  const cachePrayerData = useCallback(
    async (
      times: PrayerTimes,
      location: string,
      latitude: number,
      longitude: number,
    ) => {
      try {
        await prayerCache.cachePrayerTimes(
          times,
          location,
          latitude,
          longitude,
        );
        setCachedData(times);
        setIsCached(true);
        console.log("✅ Prayer times cached");
      } catch (error) {
        console.error("Error caching prayer times:", error);
      }
    },
    [],
  );

  const getCachedPrayerData = useCallback(async (location: string) => {
    try {
      const cached = await prayerCache.getCachedPrayerTimes(location);
      if (cached) {
        setCachedData(cached.times);
        setIsCached(true);

        const expiry = await prayerCache.getCacheExpiration(location);
        setCacheExpiry(expiry);

        const isValid = await prayerCache.isCacheValid(location);
        if (!isValid) {
          console.warn("⚠️ Prayer cache is expired, but using it as fallback");
        }

        return {
          times: cached.times,
          isExpired: !isValid,
          expiresAt: expiry,
        };
      }

      return null;
    } catch (error) {
      console.error("Error retrieving cached prayer times:", error);
      return null;
    }
  }, []);

  const clearCache = useCallback(async (location?: string) => {
    try {
      await prayerCache.clearPrayerCache(location);
      setCachedData(null);
      setIsCached(false);
      setCacheExpiry(null);
      console.log("✅ Prayer cache cleared");
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }, []);

  return {
    cachePrayerData,
    getCachedPrayerData,
    clearCache,
    cachedData,
    isCached,
    cacheExpiry,
  };
};
