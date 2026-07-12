import { useAppStore } from "../store/useAppStore";
import { fetchAllSurahs } from "../api/quranApi";
import { quranDB } from "../services/quranDatabase";

let backgroundImportStarted = false;

export const preloadQuranData = async () => {
  try {
    await quranDB.initialize();

    const {
      setAllSurahs,
      setQuranDBReady,
      setQuranDownloadState,
    } = useAppStore.getState();

    // Cek apakah Quran sudah pernah selesai di-download
    const imported =
      await quranDB.isQuranImported();

    // Load data yang sudah ada di SQLite
    const localSurahs =
      await quranDB.getAllSurahs();

    if (imported && localSurahs.length > 0) {
      setAllSurahs(localSurahs);
      setQuranDBReady(true);
      setQuranDownloadState({
        isDownloading: false,
        progress: 100,
        error: null,
      });
    } else if (!imported) {
      try {
        const onlineSurahs = await fetchAllSurahs();
        setAllSurahs(onlineSurahs);
      } catch (error) {
        console.warn(
          "⚠️ Failed loading online surah list while offline data downloads",
          error
        );
      }
    }

    if (!imported && !backgroundImportStarted) {
      backgroundImportStarted = true;
      setQuranDownloadState({
        isDownloading: true,
        progress: 0,
        error: null,
      });

      // JANGAN AWAIT
      quranDB
        .importQuranFromAPI(({ completed, total }) => {
          const progress =
            total > 0 ? Math.round((completed / total) * 100) : 0;

          setQuranDownloadState({
            isDownloading: true,
            progress,
            error: null,
          });
        })
        .then(async () => {
          const updated =
            await quranDB.getAllSurahs();

          setAllSurahs(updated);
          setQuranDBReady(true);
          setQuranDownloadState({
            isDownloading: false,
            progress: 100,
            error: null,
          });
        })
        .catch((error) => {
          setQuranDownloadState({
            isDownloading: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to download Quran data",
          });
          console.error(
            "❌ Background import failed",
            error
          );
        })
        .finally(() => {
          backgroundImportStarted = false;
        });
    }
  } catch (error) {
    useAppStore.getState().setQuranDownloadState({
      isDownloading: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to prepare Quran data",
    });
    console.error(
      "❌ preloadQuranData failed",
      error
    );
  }
};
