import { useState, useCallback } from "react";

export const useCalendarNavigation = () => {
  const defaultYear = new Date().getFullYear();
  const today = new Date();

  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());

  const goToPreviousYear = useCallback(() => {
    setSelectedYear(prev => prev - 1);
  }, []);

  const goToNextYear = useCallback(() => {
    setSelectedYear(prev => prev + 1);
  }, []);

  const goToPreviousMonth = useCallback(() => {
    setSelectedMonth(prev => {
      if (prev > 0) return prev - 1;
      setSelectedYear(year => year - 1);
      return 11;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setSelectedMonth(prev => {
      if (prev < 11) return prev + 1;
      setSelectedYear(year => year + 1);
      return 0;
    });
  }, []);

  const goToMonth = useCallback((month: number) => {
    if (month >= 0 && month <= 11) {
      setSelectedMonth(month);
    }
  }, []);

  const goToToday = useCallback(() => {
    setSelectedYear(today.getFullYear());
    setSelectedMonth(today.getMonth());
  }, []);

  return {
    selectedYear,
    selectedMonth,
    goToPreviousYear,
    goToNextYear,
    goToPreviousMonth,
    goToNextMonth,
    goToMonth,
    goToToday,
  };
};
