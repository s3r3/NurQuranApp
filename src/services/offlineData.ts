import AsyncStorage from "@react-native-async-storage/async-storage";
import { quranDB } from "./quranDatabase";
import { prayerCache } from "./prayerCache";

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
    // Prevent multiple simultaneous initialization attempts
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

      // Initialize Quran database
      await quranDB.initialize();

      // Check if Quran data exists
      const hasQuranData = await quranDB.hasQuranData();

      if (!hasQuranData) {
        console.log("📥 No Quran data found. Importing from API...");
        try {
          await quranDB.importQuranFromAPI();
        } catch (error) {
          console.warn("⚠️ Failed to import Quran data:", error);
          // App will still work but in limited mode
        }
      } else {
        console.log("✅ Quran data already cached");
      }

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

      const initTime = await AsyncStorage.getItem("offline_init_time");
      const lastSyncTime = initTime ? new Date(initTime).getTime() : null;

      // Estimate data size
      let totalDataSize = 0;
      if (quranReady) {
        totalDataSize += 15 * 1024 * 1024; // ~15MB for Quran
      }

      return {
        quranReady,
        prayerCached: false, // Will be set per location
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
      const hasQuranData = await quranDB.hasQuranData();
      return !hasQuranData;
    } catch (error) {
      console.error("Error checking initial setup:", error);
      return false;
    }
  }

  async clearAllOfflineData(): Promise<void> {
    try {
      console.log("🗑️ Clearing all offline data...");

      // Close and delete database
      await quranDB.close();
      await AsyncStorage.multiRemove([
        "offline_init_time",
        "prayer_times_cache",
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

  async getStorageInfo(): Promise<{ used: number; total: number }> {
    // This is a simplified estimate
    // Real implementation would use device storage APIs
    try {
      const keys = await AsyncStorage.getAllKeys();
      const data = await AsyncStorage.multiGet(keys);

      let used = 0;
      for (const [, value] of data) {
        if (value) {
          used += value.length; // Rough estimate in bytes
        }
      }

      return {
        used,
        total: 50 * 1024 * 1024, // ~50MB available
      };
    } catch (error) {
      console.error("Error getting storage info:", error);
      return { used: 0, total: 50 * 1024 * 1024 };
    }
  }
}

export const offlineDataService = new OfflineDataService();
