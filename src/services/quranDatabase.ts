import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { Quran, AyahData } from "../types/quran.types";

const DB_NAME = "quran.db";
const DB_VERSION = 1;
const QURAN_JSON_URL = "https://api.quran.com/api/v4/quran/verses";

class QuranDatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized && this.db) {
      return;
    }

    try {
      this.db = await SQLite.openDatabaseAsync(DB_NAME);
      await this.createTables();
      this.isInitialized = true;
      console.log("✅ Quran database initialized");
    } catch (error) {
      console.error("❌ Failed to initialize quran database:", error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    try {
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS surahs (
          id INTEGER PRIMARY KEY,
          nomor INTEGER UNIQUE,
          nama TEXT,
          namaLatin TEXT,
          jumlahAyat INTEGER,
          tempatTurun TEXT,
          arti TEXT
        );

        CREATE TABLE IF NOT EXISTS ayats (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nomorSurah INTEGER NOT NULL,
          nomorAyat INTEGER NOT NULL,
          teksArab TEXT,
          teksLatin TEXT,
          teksIndonesia TEXT,
          FOREIGN KEY(nomorSurah) REFERENCES surahs(nomor),
          UNIQUE(nomorSurah, nomorAyat)
        );

        CREATE TABLE IF NOT EXISTS db_metadata (
          key TEXT PRIMARY KEY,
          value TEXT
        );

        CREATE INDEX IF NOT EXISTS idx_surah_nomor ON surahs(nomor);
        CREATE INDEX IF NOT EXISTS idx_ayat_surah_nomor ON ayats(nomorSurah);
        CREATE INDEX IF NOT EXISTS idx_ayat_nomor ON ayats(nomorAyat);
      `);

      console.log("✅ Quran tables created");
    } catch (error) {
      console.error("❌ Failed to create tables:", error);
      throw error;
    }
  }

  async hasQuranData(): Promise<boolean> {
    if (!this.db) await this.initialize();

    try {
      const result = await this.db?.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM surahs"
      );
      return (result?.count ?? 0) > 0;
    } catch (error) {
      console.error("Error checking quran data:", error);
      return false;
    }
  }

  async importQuranFromAPI(): Promise<void> {
    if (!this.db) await this.initialize();

    try {
      console.log("📥 Downloading Quran data from API...");

      // Download surahs list
      const surahResponse = await fetch("https://api.quran.com/api/v4/quran/1");
      const surahData = await surahResponse.json();

      // Insert surahs
      for (const surah of surahData.quran) {
        await this.db?.runAsync(
          `INSERT OR REPLACE INTO surahs (nomor, nama, namaLatin, jumlahAyat, tempatTurun, arti)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            surah.number,
            surah.name,
            surah.englishName,
            surah.numberOfAyahs,
            surah.revelationType,
            surah.transliteration,
          ]
        );
      }

      console.log("✅ Surahs imported");

      // Download verses in batches
      const totalSurahs = surahData.quran.length;
      for (let surahNum = 1; surahNum <= totalSurahs; surahNum++) {
        try {
          const verseResponse = await fetch(
            `https://api.quran.com/api/v4/quran/verses/quran_${surahNum}`
          );
          const verseData = await verseResponse.json();

          if (verseData.verses) {
            for (const verse of verseData.verses) {
              const translation = verseData.translations?.find(
                (t: any) => t.language_name === "Indonesian"
              );

              await this.db?.runAsync(
                `INSERT OR REPLACE INTO ayats 
                 (nomorSurah, nomorAyat, teksArab, teksLatin, teksIndonesia)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                  verse.chapter_number,
                  verse.verse_number,
                  verse.text_uthmani,
                  verse.text_imlaei,
                  translation?.text || "",
                ]
              );
            }
          }

          console.log(`📊 Imported Surah ${surahNum}/${totalSurahs}`);
        } catch (error) {
          console.warn(`⚠️ Failed to import surah ${surahNum}:`, error);
        }
      }

      // Save metadata
      await this.db?.runAsync(
        `INSERT OR REPLACE INTO db_metadata (key, value) VALUES (?, ?)`,
        ["last_import", new Date().toISOString()]
      );

      console.log("✅ All Quran data imported successfully");
    } catch (error) {
      console.error("❌ Failed to import quran data:", error);
      throw error;
    }
  }

  async getAyah(surah: number, ayah: number): Promise<AyahData | null> {
    if (!this.db) await this.initialize();

    try {
      const result = await this.db?.getFirstAsync<AyahData>(
        `SELECT nomorSurah, nomorAyat, teksArab, teksLatin, teksIndonesia
         FROM ayats
         WHERE nomorSurah = ? AND nomorAyat = ?
         LIMIT 1`,
        [surah, ayah]
      );
      return result || null;
    } catch (error) {
      console.error("Error fetching ayah:", error);
      return null;
    }
  }

  async getAyahsBySurah(surah: number): Promise<AyahData[]> {
    if (!this.db) await this.initialize();

    try {
      const results = await this.db?.getAllAsync<AyahData>(
        `SELECT nomorSurah, nomorAyat, teksArab, teksLatin, teksIndonesia
         FROM ayats
         WHERE nomorSurah = ?
         ORDER BY nomorAyat ASC`,
        [surah]
      );
      return results || [];
    } catch (error) {
      console.error("Error fetching surahs ayahs:", error);
      return [];
    }
  }

  async searchAyahs(query: string): Promise<AyahData[]> {
    if (!this.db) await this.initialize();

    try {
      const results = await this.db?.getAllAsync<AyahData>(
        `SELECT nomorSurah, nomorAyat, teksArab, teksLatin, teksIndonesia
         FROM ayats
         WHERE teksArab LIKE ? OR teksIndonesia LIKE ?
         LIMIT 50`,
        [`%${query}%`, `%${query}%`]
      );
      return results || [];
    } catch (error) {
      console.error("Error searching ayahs:", error);
      return [];
    }
  }

  async getAllSurahs(): Promise<any[]> {
    if (!this.db) await this.initialize();

    try {
      const results = await this.db?.getAllAsync(
        `SELECT id, nomor, nama, namaLatin, jumlahAyat, tempatTurun, arti
         FROM surahs
         ORDER BY nomor ASC`
      );
      return results || [];
    } catch (error) {
      console.error("Error fetching all surahs:", error);
      return [];
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
      this.isInitialized = false;
    }
  }
}

export const quranDB = new QuranDatabaseService();
