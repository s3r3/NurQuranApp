import { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { offlineDataService, quranDB } from "../services";
import NetInfo from "@react-native-community/netinfo";

export const useOfflineInitialization = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const { setQuranDBReady, setOfflineMode, setLastSyncTime } = useAppStore();

  useEffect(() => {
    const initializeOffline = async () => {
      try {
        setIsInitializing(true);
        console.log("🚀 Starting offline initialization...");

        // Initialize offline data service
        await offlineDataService.initialize();
        console.log("✅ Offline data service initialized");

        // Check offline status
        const status = await offlineDataService.getOfflineStatus();
        setQuranDBReady(status.quranReady);

        if (status.lastSyncTime) {
          setLastSyncTime(status.lastSyncTime);
        }

        console.log("📊 Offline Status:", {
          quranReady: status.quranReady,
          totalDataSize: `${(status.totalDataSize / 1024 / 1024).toFixed(2)}MB`,
        });

        // Check network connectivity
        const netState = await NetInfo.fetch();
        setIsConnected(netState.isConnected ?? false);
        setOfflineMode(!(netState.isConnected ?? false));

        console.log(
          `🌐 Network Status: ${netState.isConnected ? "Online" : "Offline"}`,
        );
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Unknown error occurred";
        console.error("❌ Offline initialization error:", errorMsg);
        setError(errorMsg);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeOffline();

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
      setOfflineMode(!(state.isConnected ?? false));

      if (state.isConnected) {
        console.log("🟢 Connected to internet");
      } else {
        console.log("🔴 Internet connection lost - Using offline mode");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [setQuranDBReady, setOfflineMode, setLastSyncTime]);

  return {
    isInitializing,
    error,
    isConnected,
  };
};

export const useOfflineQuran = () => {
  return {
    getAyah: async (surah: number, ayah: number) => {
      return await quranDB.getAyah(surah, ayah);
    },
    getAyahsBySurah: async (surah: number) => {
      return await quranDB.getAyahsBySurah(surah);
    },
    searchAyahs: async (query: string) => {
      return await quranDB.searchAyahs(query);
    },
    getAllSurahs: async () => {
      return await quranDB.getAllSurahs();
    },
  };
};
