import { useAppStore } from "../store/useAppStore";

export const useHomeData = () => {
  const {
    lastRead,
    allSurahs,
    isDataLoaded,
    isQuranDownloading,
    quranDownloadProgress,
    quranDownloadError,
  } = useAppStore();
  const hasSurahs = allSurahs.length > 0;

  return {
    surahs: allSurahs,

    isLoading: !isDataLoaded || (isQuranDownloading && !hasSurahs),

    isError: !!quranDownloadError && !hasSurahs,

    error: quranDownloadError ? new Error(quranDownloadError) : null,

    refetch: async () => {},

    isQuranDownloading,

    quranDownloadProgress,

    hasLastRead: !!lastRead,

    lastReadData: lastRead,
  };
};
