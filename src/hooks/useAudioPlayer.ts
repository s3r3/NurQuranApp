import { useState, useEffect, useRef, useCallback } from "react";
import { Audio } from "expo-av";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";
import {
  setupAudioMode,
  cleanupSound,
  tryPlayAudio,
} from "../utils/audioHelpers";
import { AudioSources } from "../types/quran.types";
import { DEFAULT_QARI } from "../constants/qari";

export const useAudioPlayer = () => {
  const { t } = useTranslation();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingAyat, setPlayingAyat] = useState<number | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlayingFullSurah, setIsPlayingFullSurah] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(0);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [selectedQari, setSelectedQari] = useState(DEFAULT_QARI);
  const isPlayingFullSurahRef = useRef(false);

  useEffect(() => {
    setupAudioMode();
    return () => {
      cleanupSound(soundRef);
    };
  }, []);

  const playSingleAyah = useCallback(
    async (
      audio: AudioSources,
      ayatNumber: number,
      onPlayStart?: () => void,
    ) => {
      try {
        if (playingAyat === ayatNumber) {
          await cleanupSound(soundRef);
          setPlayingAyat(null);
          return;
        }

        if (isPlayingFullSurah) {
          setIsPlayingFullSurah(false);
          isPlayingFullSurahRef.current = false;
        }

        setIsLoadingAudio(true);

        const success = await tryPlayAudio(
          audio,
          selectedQari,
          ayatNumber,
          soundRef,
          () => setPlayingAyat(null),
        );

        if (success) {
          setPlayingAyat(ayatNumber);
          onPlayStart?.();
        } else {
          Alert.alert(
            t("Audio Error"),
            t("Could not play audio. Please check your internet connection."),
          );
        }
      } catch (error) {
        console.error("Error playing audio:", error);
        Alert.alert(t("Error"), t("Failed to play audio"));
      } finally {
        setIsLoadingAudio(false);
      }
    },
    [playingAyat, isPlayingFullSurah, selectedQari, t],
  );
  const stopPlayback = useCallback(async () => {
    await cleanupSound(soundRef);
    setIsPlayingFullSurah(false);
    isPlayingFullSurahRef.current = false;
    setPlayingAyat(null);
    setCurrentPlayingIndex(0);
  }, []);

  const stopAllPlayback = useCallback(async () => {
    await cleanupSound(soundRef);

    if (sound) {
      try {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.stopAsync();
          await sound.unloadAsync();
        }
      } catch (error) {
        console.error("Error cleaning up single audio sound:", error);
      } finally {
        setSound(null);
      }
    }

    setIsPlayingFullSurah(false);
    isPlayingFullSurahRef.current = false;
    setPlayingAyat(null);
    setCurrentPlayingIndex(0);
  }, [sound]);

  const playAudio = async (ayatNumber: number) => {
    try {
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayatNumber}.mp3`;

      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
      );
      setSound(newSound);
      setPlayingAyat(ayatNumber);
    } catch (error) {
      console.error("Error playing audio:", error);
      Alert.alert(t("Error"), t("Could not play audio"));
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return {
    playAudio,
    playingAyat,
    soundRef,
    isPlayingFullSurah,
    currentPlayingIndex,
    isLoadingAudio,
    selectedQari,
    setSelectedQari,
    playSingleAyah,
    stopPlayback,
    stopAllPlayback,
    setIsPlayingFullSurah,
    isPlayingFullSurahRef,
    setCurrentPlayingIndex,
    setIsLoadingAudio,
  };
};
