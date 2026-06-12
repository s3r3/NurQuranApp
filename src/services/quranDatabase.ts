import * as SQLite from "expo-sqlite";
import { Quran, AyahData } from "../types/quran.types";
import {
  buildEquranAyahAudioSources,
  buildEquranFullSurahAudioSources,
} from "../utils/quranAudio";

const DB_NAME = "quran.db";

type QuranImportProgress = {
  completed: number;
  total: number;
};

class QuranDatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;
  private isImporting = false;

  async initialize() {
  console.log("🔵 initialize called");

  if (this.isInitialized && this.db) {
    console.log("🟢 DB already initialized");
    return;
  }

  if (this.initPromise) {
    console.log("🟡 Waiting existing initialization");
    return this.initPromise;
  }

  this.initPromise = (async () => {
    console.log("🟠 Opening database");

    this.db = await SQLite.openDatabaseAsync(DB_NAME);

    console.log("🟠 Creating tables");

    await this.createTables();

    this.isInitialized = true;

    console.log("✅ Quran DB Ready");
  })();

  await this.initPromise;
}

  private async createTables() {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS surahs (
        nomor INTEGER PRIMARY KEY,
        nama TEXT NOT NULL,
        namaLatin TEXT NOT NULL,
        jumlahAyat INTEGER NOT NULL,
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
        UNIQUE(nomorSurah, nomorAyat)
      );

      CREATE TABLE IF NOT EXISTS db_metadata (
        key TEXT PRIMARY KEY,
        value TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_surah
      ON ayats(nomorSurah);

      CREATE INDEX IF NOT EXISTS idx_ayat
      ON ayats(nomorAyat);
    `);
  }

  async hasQuranData(): Promise<boolean> {
    if (!this.db) await this.initialize();

    const result = await this.db!.getFirstAsync<{
      count: number;
    }>(
      `
      SELECT COUNT(*) as count
      FROM surahs
      `,
    );

    return (result?.count ?? 0) > 0;
  }

  async isQuranImported(): Promise<boolean> {
    if (!this.db) await this.initialize();

    const result = await this.db!.getFirstAsync<{
      value: string;
    }>(
      `
        SELECT value
        FROM db_metadata
        WHERE key = ?
        `,
      ["quran_imported"],
    );

    return result?.value === "true";
  }

  async clearDatabase() {
    if (!this.db) await this.initialize();

    await this.db!.execAsync(`
      DELETE FROM ayats;
      DELETE FROM surahs;
      DELETE FROM db_metadata;
    `);
  }

  async importQuranFromAPI(
    onProgress?: (progress: QuranImportProgress) => void,
  ): Promise<void> {
    if (this.isImporting) {
      console.log("⏳ Import already running");
      return;
    }

    this.isImporting = true;

    try {
      if (!this.db) {
        await this.initialize();
      }

      console.log("📥 Fetching surah list...");

      const response = await fetch("https://equran.id/api/v2/surat");

      const json = await response.json();

      if (!json?.data) {
        throw new Error("Invalid API response");
      }

      const surahs = json.data;
      const totalSurahs = surahs.length;

      onProgress?.({
        completed: 0,
        total: totalSurahs,
      });

      for (const surah of surahs) {
        await this.db!.runAsync(
          `
          INSERT OR REPLACE INTO surahs
          (
            nomor,
            nama,
            namaLatin,
            jumlahAyat,
            tempatTurun,
            arti
          )
          VALUES (?, ?, ?, ?, ?, ?)
          `,
          [
            surah.nomor,
            surah.nama,
            surah.namaLatin,
            surah.jumlahAyat,
            surah.tempatTurun,
            surah.arti,
          ],
        );
      }

      console.log("✅ Surah metadata saved");

      for (const surah of surahs) {
        try {
          console.log(`📥 Importing Surah ${surah.nomor}`);

          const detailResponse = await fetch(
            `https://equran.id/api/v2/surat/${surah.nomor}`,
          );

          const detailJson = await detailResponse.json();

          const ayats = detailJson?.data?.ayat ?? [];

          for (const ayat of ayats) {
            await this.db!.runAsync(
              `
              INSERT OR REPLACE INTO ayats
              (
                nomorSurah,
                nomorAyat,
                teksArab,
                teksLatin,
                teksIndonesia
              )
              VALUES (?, ?, ?, ?, ?)
              `,
              [
                surah.nomor,
                ayat.nomorAyat,
                ayat.teksArab,
                ayat.teksLatin,
                ayat.teksIndonesia,
              ],
            );
          }

          onProgress?.({
            completed: surah.nomor,
            total: totalSurahs,
          });
        } catch (error) {
          console.error(`❌ Failed importing Surah ${surah.nomor}`, error);
        }
      }

      await this.db!.runAsync(
        `
        INSERT OR REPLACE INTO db_metadata
        (key,value)
        VALUES (?,?)
        `,
        ["quran_imported", "true"],
      );

      await this.db!.runAsync(
        `
        INSERT OR REPLACE INTO db_metadata
        (key,value)
        VALUES (?,?)
        `,
        ["last_import", new Date().toISOString()],
      );

      console.log("🎉 Quran import completed");
    } catch (error) {
      console.error("❌ Quran import failed", error);
      throw error;
    } finally {
      this.isImporting = false;
    }
  }

  async getAllSurahs(): Promise<Quran[]> {
    if (!this.db) await this.initialize();

    return await this.db!.getAllAsync<Quran>(
      `
      SELECT *
      FROM surahs
      ORDER BY nomor ASC
      `,
    );
  }

  async getAyahsBySurah(surah: number): Promise<AyahData[]> {
    if (!this.db) await this.initialize();

    return await this.db!.getAllAsync<AyahData>(
      `
      SELECT
        nomorSurah,
        nomorAyat,
        teksArab,
        teksLatin,
        teksIndonesia
      FROM ayats
      WHERE nomorSurah = ?
      ORDER BY nomorAyat ASC
      `,
      [surah],
    );
  }
  async getSurahDetail(surahId: number) {
    if (!this.db) await this.initialize();

    const surah = await this.db!.getFirstAsync<any>(
      `
    SELECT *
    FROM surahs
    WHERE nomor = ?
    LIMIT 1
    `,
      [surahId],
    );

    if (!surah) {
      return null;
    }

    const ayats = await this.db!.getAllAsync<any>(
      `
    SELECT
      nomorAyat,
      teksArab,
      teksLatin,
      teksIndonesia
    FROM ayats
    WHERE nomorSurah = ?
    ORDER BY nomorAyat ASC
    `,
      [surahId],
    );

    return {
      ...surah,
      audioFull: buildEquranFullSurahAudioSources(surahId),
      ayat: ayats.map((a) => ({
        nomorAyat: a.nomorAyat,
        teksArab: a.teksArab,
        teksIndonesia: a.teksIndonesia,
        teksLatin: a.teksLatin,

        // compatibility dengan komponen lama
        number: a.nomorAyat,
        numberInSurah: a.nomorAyat,
        text: a.teksArab,
        textIndonesian: a.teksIndonesia,

        audio: buildEquranAyahAudioSources(surahId, a.nomorAyat),
      })),
    };
  }

  async getAyah(surah: number, ayah: number): Promise<AyahData | null> {
    if (!this.db) await this.initialize();

    const result = await this.db!.getFirstAsync<AyahData>(
      `
        SELECT
          nomorSurah,
          nomorAyat,
          teksArab,
          teksLatin,
          teksIndonesia
        FROM ayats
        WHERE nomorSurah = ?
        AND nomorAyat = ?
        LIMIT 1
        `,
      [surah, ayah],
    );

    return result ?? null;
  }

  async searchAyahs(keyword: string): Promise<AyahData[]> {
    if (!this.db) await this.initialize();

    return await this.db!.getAllAsync<AyahData>(
      `
      SELECT
        nomorSurah,
        nomorAyat,
        teksArab,
        teksLatin,
        teksIndonesia
      FROM ayats
      WHERE
        teksArab LIKE ?
        OR teksIndonesia LIKE ?
      LIMIT 50
      `,
      [`%${keyword}%`, `%${keyword}%`],
    );
  }

  async getLastImportDate() {
    if (!this.db) await this.initialize();

    const result = await this.db!.getFirstAsync<{
      value: string;
    }>(
      `
        SELECT value
        FROM db_metadata
        WHERE key = ?
        `,
      ["last_import"],
    );

    return result?.value ?? null;
  }

  async close() {
    if (!this.db) return;

    await this.db.closeAsync();

    this.db = null;
    this.isInitialized = false;
    this.initPromise = null;
  }
}

export const quranDB = new QuranDatabaseService();

export default QuranDatabaseService;
