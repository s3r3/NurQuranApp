import { useState, useCallback } from "react";
import { useAppStore } from "../store/useAppStore";
import { usePrayerLocation } from "./usePrayerLocation";
import { usePrayerOffline } from "./usePrayerOffline";
import { API_CONFIG } from "../constants/prayer.constants";
import { PrayerTimesResponse } from "../types/quran.types";

export const usePrayerTimes = () => {
  const { setPrayerData, setLocation } = useAppStore();
  const { getCurrentLocation } = usePrayerLocation();
  const { cachePrayerData, getCachedPrayerData } = usePrayerOffline();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingCache, setIsUsingCache] = useState(false);

  const fetchPrayerTimes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsUsingCache(false);

    try {
      const locationData = await getCurrentLocation();

      if (!locationData) {
        setPrayerData(null, "Location Access Denied");
        return;
      }

      setLocation(locationData.latitude, locationData.longitude);

      const url =
        `${API_CONFIG.ALADHAN_BASE_URL}` +
        `?latitude=${locationData.latitude}` +
        `&longitude=${locationData.longitude}` +
        `&method=${API_CONFIG.DEFAULT_METHOD}`;

      const controller = new AbortController();

      const timeoutId = setTimeout(() => {
        controller.abort();
      }, API_CONFIG.TIMEOUT);

      try {
        const response = await fetch(url, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const json: PrayerTimesResponse = await response.json();

        if (json.code === 200 && json.data) {
          // Cache the new data
          await cachePrayerData(
            json.data.timings,
            locationData.name,
            locationData.latitude,
            locationData.longitude,
          );

          setPrayerData(json.data.timings, locationData.name);
        } else {
          throw new Error("Invalid response from API");
        }
      } catch (err) {
        clearTimeout(timeoutId);

        if (err instanceof Error && err.name === "AbortError") {
          throw new Error("Request timeout. Please try again.");
        }

        throw err;
      }
    } catch (error) {
      console.error("Failed to load prayer schedule:", error);

      // Try to load from cache as fallback
      try {
        const locationData = await getCurrentLocation();
        if (locationData) {
          const cached = await getCachedPrayerData(locationData.name);
          if (cached) {
            console.log("📱 Using cached prayer times");
            setPrayerData(cached.times, locationData.name);
            setIsUsingCache(true);

            const message = cached.isExpired
              ? "Showing cached prayer times (expired)"
              : "Using offline prayer times";
            setError(message);
            return;
          }
        }
      } catch (cacheError) {
        console.error("Failed to load cached prayer times:", cacheError);
      }

      const message =
        error instanceof Error ? error.message : "Failed to load prayer times";

      setError(message);
      setPrayerData(null, "Error loading data");
    } finally {
      setIsLoading(false);
    }
  }, [
    getCurrentLocation,
    setPrayerData,
    setLocation,
    cachePrayerData,
    getCachedPrayerData,
  ]);

  return {
    fetchPrayerTimes,
    isLoading,
    error,
    isUsingCache,
  };
};
