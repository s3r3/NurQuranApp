import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Volume2, Play, Pause } from "lucide-react-native";
import { QariSelector } from "./QariSelector";
import { AudioControls } from "./AudioControls";
import { COLORS } from "../../constants/colors";
import { useTranslation } from "react-i18next";
import { getSurahMeaning } from "../../utils/surahMeaning";

interface SurahHeaderProps {
  surah: {
    nomor?: number;
    nama: string;
    namaLatin: string;
    arti: string;
    tempatTurun: string;
    jumlahAyat: number;
  };
  selectedQari: string;
  onQariChange: (qari: string) => void;
  isPlayingFullSurah: boolean;
  isLoadingAudio: boolean;
  onPlayFullSurah: () => void;
  currentPlayingIndex?: number;
  playingAyat?: number | null;
  onSkipPrevious?: () => void;
  onSkipNext?: () => void;
  totalAyahs?: number;
}

export const SurahHeader: React.FC<SurahHeaderProps> = ({
  surah,
  selectedQari,
  onQariChange,
  isPlayingFullSurah,
  isLoadingAudio,
  onPlayFullSurah,
  currentPlayingIndex,
  playingAyat,
  onSkipPrevious,
  onSkipNext,
  totalAyahs,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <View style={styles.bannerCard}>
      <Text style={styles.bannerArabic}>{surah.nama}</Text>
      <Text style={styles.bannerTitle}>{surah.namaLatin}</Text>
      <Text style={styles.bannerSub}>
        {getSurahMeaning(surah.nomor, surah.arti, i18n.language)}
      </Text>
      <View style={styles.divider} />
      <Text style={styles.bannerInfo}>
        {surah.tempatTurun.toUpperCase()} • {surah.jumlahAyat} {t("AYAT")}
      </Text>
      <Text style={styles.bismillah}>
        بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
      </Text>

      <QariSelector selectedQari={selectedQari} onSelectQari={onQariChange} />

      <TouchableOpacity
        style={[
          styles.playFullButton,
          isPlayingFullSurah && styles.playFullButtonActive,
        ]}
        onPress={onPlayFullSurah}
        disabled={isLoadingAudio && !isPlayingFullSurah}
      >
        {isPlayingFullSurah ? (
          <Pause color={COLORS.TEXT} size={24} fill={COLORS.TEXT} />
        ) : (
          <Play color={COLORS.TEXT} size={24} fill={COLORS.TEXT} />
        )}
        <Text style={styles.playFullButtonText}>
          {isPlayingFullSurah ? t("Stop Playback") : t("Play Full Surah")}
        </Text>
      </TouchableOpacity>

      {isPlayingFullSurah && onSkipPrevious && onSkipNext && totalAyahs && (
        <AudioControls
          currentIndex={currentPlayingIndex ?? 0}
          totalAyahs={totalAyahs}
          playingAyat={playingAyat}
          isLoading={isLoadingAudio}
          onPrevious={onSkipPrevious}
          onNext={onSkipNext}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bannerCard: {
    margin: 20,
    padding: 28,
    borderRadius: 20,
    backgroundColor: COLORS.CARD_BACKGROUND,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerArabic: {
    color: COLORS.TEXT,
    fontSize: 32,
    marginBottom: 8,
  },
  bannerTitle: {
    color: COLORS.TEXT,
    fontSize: 26,
    fontWeight: "bold",
  },
  bannerSub: {
    color: COLORS.TEXT,
    fontSize: 16,
    marginTop: 4,
    opacity: 0.9,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
    width: "80%",
    marginVertical: 16,
  },
  bannerInfo: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: "500",
  },
  bismillah: {
    color: COLORS.TEXT,
    fontSize: 24,
    marginTop: 20,
  },
  playFullButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 28,
    marginTop: 16,
    gap: 12,
  },
  playFullButtonActive: {
    backgroundColor: "rgba(239, 68, 68, 0.6)",
  },
  playFullButtonText: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: "700",
  },
});
