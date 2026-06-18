import { useCallback } from "react";
import { FlatList } from "react-native";
import { tryPlayAudio } from "../utils/audioHelpers";
import { Surah } from "../types/quran.types";

interface UseFullSurahPlayerProps {
  surah: Surah;
  soundRef: React.MutableRefObject<any>;
  selectedQari: string;
  isPlayingFullSurahRef: React.MutableRefObject<boolean>;
  setIsPlayingFullSurah: (value: boolean) => void;
  currentPlayingIndex: number;
  setCurrentPlayingIndex: (value: number) => void;
  setIsLoadingAudio: (value: boolean) => void;
  flatListRef: React.RefObject<FlatList<any> | null>;
  onAyahPlay?: (ayahNumber: number) => void;
}

export const useFullSurahPlayer = (props: UseFullSurahPlayerProps) => {
  const {
    surah,
    soundRef,
    selectedQari,
    isPlayingFullSurahRef,
    setIsPlayingFullSurah,
    currentPlayingIndex,
    setCurrentPlayingIndex,
    setIsLoadingAudio,
    flatListRef,
    onAyahPlay,
  } = props;

  const playAyahSequential = useCallback(
    async (index: number) => {
      if (!surah?.ayat || index >= surah.ayat.length) {
        setIsPlayingFullSurah(false);
        isPlayingFullSurahRef.current = false;
        setCurrentPlayingIndex(0);
        return;
      }

      if (!isPlayingFullSurahRef.current) return;

      const currentAyah = surah.ayat[index];
      setIsLoadingAudio(true);
      setCurrentPlayingIndex(index);

      const success = await tryPlayAudio(
        currentAyah.audio,
        selectedQari,
        currentAyah.nomorAyat,
        soundRef,
        () => {
          if (!isPlayingFullSurahRef.current) {
            return;
          }

          const nextIndex = index + 1;
          if (nextIndex < surah.ayat.length) {
            setTimeout(() => playAyahSequential(nextIndex), 800);
          } else {
            setIsPlayingFullSurah(false);
            isPlayingFullSurahRef.current = false;
            setCurrentPlayingIndex(0);
          }
        },
      );

      setIsLoadingAudio(false);

      if (success) {
        onAyahPlay?.(currentAyah.nomorAyat);
      } else if (isPlayingFullSurahRef.current) {
        const nextIndex = index + 1;
        if (nextIndex < surah.ayat.length) {
          setTimeout(() => playAyahSequential(nextIndex), 500);
        } else {
          setIsPlayingFullSurah(false);
          isPlayingFullSurahRef.current = false;
        }
      }
    },
    [surah, selectedQari, soundRef, isPlayingFullSurahRef],
  );

  const playFullSurah = useCallback(async () => {
    if (!surah?.ayat?.length) return;

    if (isPlayingFullSurahRef.current) {
      // Stop playback
      if (soundRef.current) {
        await soundRef.current.stopAsync?.();
        await soundRef.current.unloadAsync?.();
        soundRef.current = null;
      }
      setIsPlayingFullSurah(false);
      isPlayingFullSurahRef.current = false;
      setCurrentPlayingIndex(0);
      return;
    }

    // Start playback
    setIsPlayingFullSurah(true);
    isPlayingFullSurahRef.current = true;
    setCurrentPlayingIndex(0);
    await playAyahSequential(0);
  }, [surah, playAyahSequential]);

  const skipToNext = useCallback(async () => {
    if (!isPlayingFullSurahRef.current || !surah?.ayat) return;
    const nextIndex = (props.currentPlayingIndex ?? 0) + 1;
    if (nextIndex < surah.ayat.length) {
      if (soundRef.current) {
        await soundRef.current.stopAsync?.();
        await soundRef.current.unloadAsync?.();
        soundRef.current = null;
      }
      await playAyahSequential(nextIndex);
    }
  }, [surah, playAyahSequential, props.currentPlayingIndex]);

  const skipToPrevious = useCallback(async () => {
    if (!isPlayingFullSurahRef.current || props.currentPlayingIndex <= 0)
      return;
    const prevIndex = props.currentPlayingIndex - 1;
    if (soundRef.current) {
      await soundRef.current.stopAsync?.();
      await soundRef.current.unloadAsync?.();
      soundRef.current = null;
    }
    await playAyahSequential(prevIndex);
  }, [playAyahSequential, props.currentPlayingIndex]);

  return {
    playFullSurah,
    skipToNext,
    skipToPrevious,
  };
};
