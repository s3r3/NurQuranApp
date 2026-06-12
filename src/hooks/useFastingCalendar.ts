import { useState, useEffect } from "react";
import { CalendarDay } from "../types/quran.types";
import { fastingCalendarCache } from "../services";
import { fetchCalendarMonth } from "../utils/calendarHelpers";

export const useFastingCalendar = (year: number) => {
  const [calendarData, setCalendarData] = useState<Record<number, CalendarDay[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingCache, setIsUsingCache] = useState(false);

  useEffect(() => {
    fetchCalendar();
  }, [year]);

  const fetchCalendar = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      setIsUsingCache(false);

      if (!forceRefresh) {
        const cached = await fastingCalendarCache.getCachedYear(year);

        if (cached) {
          setCalendarData(cached.months);
          setIsUsingCache(true);
          setLoading(false);
          return;
        }
      }

      const allMonths: Record<number, CalendarDay[]> = {};

      const promises = Array.from({ length: 12 }, async (_, monthIndex) => {
        try {
          const days = await fetchCalendarMonth(monthIndex, year);
          allMonths[monthIndex] = days;
        } catch (err) {
          console.error(`Error fetching month ${monthIndex + 1}:`, err);
        }
      });

      await Promise.all(promises);
      setCalendarData(allMonths);
      await fastingCalendarCache.cacheYear(year, allMonths);
    } catch (error) {
      console.error("Error fetching calendar:", error);

      const cached = await fastingCalendarCache.getCachedYear(year);

      if (cached) {
        setCalendarData(cached.months);
        setIsUsingCache(true);
        setError("Using offline calendar data");
        return;
      }

      setError("Failed to load calendar data");
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchCalendar(true);
  };

  return {
    calendarData,
    loading,
    error,
    isUsingCache,
    refetch,
  };
};
