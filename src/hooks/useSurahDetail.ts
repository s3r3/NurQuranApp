import { useQuery } from "@tanstack/react-query";
import { fetchEnglishTranslation, fetchSurahDetail } from "../api/quranApi";
import { quranDB } from "../services/quranDatabase";
import { Language, Ayah } from "../types/quran.types";

export const useSurahDetail = (surahId: number, language: Language) => {
  return useQuery({
    queryKey: ["surah-offline", surahId, language],

    queryFn: async () => {
      await quranDB.initialize();

      const surah = await quranDB.getSurahDetail(surahId);
      const hasOfflineAyahs = (surah?.ayat?.length ?? 0) > 0;

      if (!surah || !hasOfflineAyahs) {
        return fetchSurahDetail(surahId, language);
      }

      if (language === "en") {
        const englishTranslations = await fetchEnglishTranslation(surahId);

        return {
          ...surah,
          ayat: surah.ayat.map((ayah: Ayah) => ({
            ...ayah,
            teksInggris: englishTranslations[ayah.nomorAyat],
            textEnglish: englishTranslations[ayah.nomorAyat],
          })),
        };
      }

      return surah;
    },

    staleTime: language === "en" ? 1000 * 60 * 5 : Infinity,
    gcTime: Infinity,
    retry: 2,
  });
};
