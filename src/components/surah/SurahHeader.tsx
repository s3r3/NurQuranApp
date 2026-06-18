import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Play, Pause } from "lucide-react-native";
import { QariSelector } from "./QariSelector";
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
}

export const SurahHeader: React.FC<SurahHeaderProps> = ({
  surah,
  selectedQari,
  onQariChange,
  isPlayingFullSurah,
  isLoadingAudio,
  onPlayFullSurah,
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

    </View>
  );
};

const styles = StyleSheet.create({
  bannerCard: {
    margin: 20,
    padding: 24,
    borderRadius: 28,
    backgroundColor: COLORS.CARD_BACKGROUND,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
  bannerArabic: {
    color: COLORS.TEXT,
    fontSize: 34,
    marginBottom: 8,
    fontWeight: "700",
  },
  bannerTitle: {
    color: COLORS.TEXT,
    fontSize: 24,
    fontWeight: "800",
  },
  bannerSub: {
    color: COLORS.TEXT,
    fontSize: 16,
    marginTop: 4,
    opacity: 0.9,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.22)",
    width: "80%",
    marginVertical: 16,
  },
  bannerInfo: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  bismillah: {
    color: COLORS.TEXT,
    fontSize: 22,
    marginTop: 20,
    opacity: 0.95,
  },
  playFullButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    marginTop: 18,
    gap: 12,
  },
  playFullButtonActive: {
    backgroundColor: "rgba(239, 68, 68, 0.72)",
  },
  playFullButtonText: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: "800",
  },
});
