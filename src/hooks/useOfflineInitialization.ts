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

        await quranDB.initialize();

        setQuranDBReady(true);

        const netState = await NetInfo.fetch();

        setIsConnected(netState.isConnected ?? false);

        setOfflineMode(!(netState.isConnected ?? false));
      } catch (err) {
        console.error(err);
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
