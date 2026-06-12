import { AudioSources } from "../types/quran.types";

const QARI_AUDIO_DIRECTORIES: Record<string, string> = {
  "01": "Abdullah-Al-Juhany",
  "02": "Abdul-Muhsin-Al-Qasim",
  "03": "Abdurrahman-as-Sudais",
  "04": "Ibrahim-Al-Dossari",
  "05": "Misyari-Rasyid-Al-Afasi",
  "06": "Yasser-Al-Dosari",
};

const EQURAN_CDN_BASE_URL = "https://cdn.equran.id";

const padNumber = (value: number) => value.toString().padStart(3, "0");

export const buildEquranAyahAudioSources = (
  surahNumber: number,
  ayahNumber: number,
): AudioSources => {
  const audioId = `${padNumber(surahNumber)}${padNumber(ayahNumber)}`;

  return Object.fromEntries(
    Object.entries(QARI_AUDIO_DIRECTORIES).map(([qariId, directory]) => [
      qariId,
      `${EQURAN_CDN_BASE_URL}/audio-partial/${directory}/${audioId}.mp3`,
    ]),
  );
};

export const buildEquranFullSurahAudioSources = (
  surahNumber: number,
): AudioSources => {
  const audioId = padNumber(surahNumber);

  return Object.fromEntries(
    Object.entries(QARI_AUDIO_DIRECTORIES).map(([qariId, directory]) => [
      qariId,
      `${EQURAN_CDN_BASE_URL}/audio-full/${directory}/${audioId}.mp3`,
    ]),
  );
};
