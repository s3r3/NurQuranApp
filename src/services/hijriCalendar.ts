/**
 * Hijri Calendar Conversion Service
 * Converts between Gregorian and Islamic (Hijri) calendars
 * Algorithm: https://en.wikipedia.org/wiki/Islamic_calendar#Arithmetic_calendar
 */

interface HijriDate {
  year: number;
  month: number;
  day: number;
}

class HijriCalendarService {
  /**
   * Convert Gregorian date to Julian Day Number
   */
  private gregorianToJulianDay(date: Date): number {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let a = Math.floor((14 - month) / 12);
    let y = year + 4800 - a;
    let m = month + 12 * a - 3;

    const jdn = Math.floor(
      day +
        (153 * m + 2) / 5 +
        365 * y +
        Math.floor(y / 4) -
        Math.floor(y / 100) +
        Math.floor(y / 400) -
        32045,
    );

    return jdn;
  }

  /**
   * Convert Julian Day Number to Hijri date
   */
  private julianDayToHijri(jd: number): HijriDate {
    const n = jd - 1948440 + 0.5;
    const q = Math.floor(n / 10631);
    const r = Math.floor(n % 10631);
    const a = Math.floor((r + 1) / 325.2425);
    const w = Math.floor(325.2425 * a);
    const q1 = Math.floor((r - w) / 30.44);
    const q2 = Math.floor(((r - w) % 30.44) / 29.5);

    const year = 30 * q + 30 * a + q1;
    const month = q2 + 1;
    const day = Math.floor((r - w) % 29.5) + 1;

    return { year, month, day };
  }

  /**
   * Convert Gregorian date to Hijri
   */
  gregorianToHijri(gregorianDate: Date): HijriDate {
    const jd = this.gregorianToJulianDay(gregorianDate);
    return this.julianDayToHijri(jd);
  }

  /**
   * Convert Hijri date to Gregorian
   */
  hijriToGregorian(
    hijriYear: number,
    hijriMonth: number,
    hijriDay: number,
  ): Date {
    const n =
      hijriDay +
      Math.ceil(29.5001 * (hijriMonth - 1)) +
      (hijriYear - 1) * 354 +
      Math.floor((3 + 11 * hijriYear) / 30) +
      1948440 -
      385;

    const a = Math.floor((n + 32044) / 146097);
    const b = Math.floor(((n + 32044) % 146097) / 36524);
    const c = Math.floor(((((n + 32044) % 146097) % 36524) + 1) / 365.2425);
    const d = Math.floor(
      (365.2425 * (a * 146097 + b * 36524 + c * 365.2425 + 0.5)) / 1,
    );
    const e = Math.floor((n - d) / 30.6);
    const day = n - d - Math.floor(30.6 * e) + 1;
    const month = e < 14 ? e - 1 : e - 13;
    const year =
      month > 2
        ? a * 400 + b * 100 + c * 4 - 4800
        : a * 400 + b * 100 + c * 4 - 4801;

    return new Date(year, month - 1, day);
  }

  /**
   * Get Hijri date for today
   */
  getTodayHijri(): HijriDate {
    return this.gregorianToHijri(new Date());
  }

  /**
   * Get Hijri month name in Indonesian
   */
  getHijriMonthName(month: number, locale: "id" | "en" = "id"): string {
    const hijriMonths = {
      id: [
        "Muharram",
        "Safar",
        "Rabi al-Awwal",
        "Rabi al-Thani",
        "Jumada al-Awwal",
        "Jumada al-Thani",
        "Rajab",
        "Sha'ban",
        "Ramadan",
        "Shawwal",
        "Dhul-Qi'dah",
        "Dhul-Hijjah",
      ],
      en: [
        "Muharram",
        "Safar",
        "Rabi al-Awwal",
        "Rabi al-Thani",
        "Jumada al-Awwal",
        "Jumada al-Thani",
        "Rajab",
        "Sha'ban",
        "Ramadan",
        "Shawwal",
        "Dhul-Qi'dah",
        "Dhul-Hijjah",
      ],
    };

    return hijriMonths[locale][month - 1] || `Month ${month}`;
  }

  /**
   * Check if two dates are on the same Hijri day
   */
  isSameHijriDay(date1: Date, date2: Date): boolean {
    const hijri1 = this.gregorianToHijri(date1);
    const hijri2 = this.gregorianToHijri(date2);

    return (
      hijri1.year === hijri2.year &&
      hijri1.month === hijri2.month &&
      hijri1.day === hijri2.day
    );
  }

  /**
   * Get Hijri date range for a given Gregorian month
   */
  getHijriDateRange(
    gregorianYear: number,
    gregorianMonth: number,
  ): { start: HijriDate; end: HijriDate } {
    const firstDay = new Date(gregorianYear, gregorianMonth, 1);
    const lastDay = new Date(gregorianYear, gregorianMonth + 1, 0);

    return {
      start: this.gregorianToHijri(firstDay),
      end: this.gregorianToHijri(lastDay),
    };
  }
}

export const hijriCalendar = new HijriCalendarService();
