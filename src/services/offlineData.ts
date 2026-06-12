import AsyncStorage from "@react-native-async-storage/async-storage";
import { quranDB } from "./quranDatabase";

interface OfflineStatus {
  quranReady: boolean;
  prayerCached: boolean;
  lastSyncTime: number | null;
  totalDataSize: number;
}

class OfflineDataService {
  private isInitializing = false;
  private initPromise: Promise<void> | null = null;

  async initialize(): Promise<void> {
    if (this.isInitializing) {
      return this.initPromise || Promise.resolve();
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.isInitializing = true;
    this.initPromise = this._initialize();

    try {
      await this.initPromise;
    } finally {
      this.isInitializing = false;
    }
  }

  private async _initialize(): Promise<void> {
    try {
      console.log("🔄 Initializing offline data service...");

      // Database init cepat
      await quranDB.initialize();

      await this.saveInitializationTime();

      console.log("✅ Offline data service initialized");
    } catch (error) {
      console.error("❌ Failed to initialize offline data service:", error);
      throw error;
    }
  }

  private async saveInitializationTime(): Promise<void> {
    try {
      await AsyncStorage.setItem("offline_init_time", new Date().toISOString());
    } catch (error) {
      console.error("Error saving initialization time:", error);
    }
  }

  async getOfflineStatus(): Promise<OfflineStatus> {
    try {
      const quranReady = await quranDB.hasQuranData();
      const keys = await AsyncStorage.getAllKeys();
      const prayerCached = keys.some((key) =>
        key.startsWith("prayer_times_cache_"),
      );

      const initTime = await AsyncStorage.getItem("offline_init_time");

      const lastSyncTime = initTime ? new Date(initTime).getTime() : null;

      let totalDataSize = 0;

      if (quranReady) {
        totalDataSize += 15 * 1024 * 1024;
      }

      return {
        quranReady,
        prayerCached,
        lastSyncTime,
        totalDataSize,
      };
    } catch (error) {
      console.error("Error getting offline status:", error);

      return {
        quranReady: false,
        prayerCached: false,
        lastSyncTime: null,
        totalDataSize: 0,
      };
    }
  }

  async shouldShowInitialSetup(): Promise<boolean> {
    try {
      return !(await quranDB.hasQuranData());
    } catch (error) {
      console.error("Error checking initial setup:", error);
      return false;
    }
  }

  async clearAllOfflineData(): Promise<void> {
    try {
      console.log("🗑️ Clearing all offline data...");

      await quranDB.close();

      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(
        (key) =>
          key.startsWith("prayer_times_cache_") ||
          key.startsWith("fasting_calendar_cache_"),
      );

      await AsyncStorage.multiRemove([
        "offline_init_time",
        "prayer_times_cache",
        ...cacheKeys,
      ]);

      console.log("✅ All offline data cleared");
    } catch (error) {
      console.error("Error clearing offline data:", error);
      throw error;
    }
  }

  async verifyDataIntegrity(): Promise<boolean> {
    try {
      console.log("🔍 Verifying data integrity...");

      const quranReady = await quranDB.hasQuranData();

      if (!quranReady) {
        console.warn("⚠️ Quran data missing");
        return false;
      }

      console.log("✅ Data integrity verified");

      return true;
    } catch (error) {
      console.error("Error verifying data integrity:", error);
      return false;
    }
  }

  async getStorageInfo(): Promise<{
    used: number;
    total: number;
  }> {
    try {
      const keys = await AsyncStorage.getAllKeys();

      const data = await AsyncStorage.multiGet(keys);

      let used = 0;

      for (const [, value] of data) {
        if (value) {
          used += value.length;
        }
      }

      return {
        used,
        total: 50 * 1024 * 1024,
      };
    } catch (error) {
      console.error("Error getting storage info:", error);

      return {
        used: 0,
        total: 50 * 1024 * 1024,
      };
    }
  }
}

export const offlineDataService = new OfflineDataService();
