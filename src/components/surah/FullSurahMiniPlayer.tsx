import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Pause, Play, SkipBack, SkipForward, ChevronUp } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { COLORS } from "../../constants/colors";

interface FullSurahMiniPlayerProps {
  surahName: string;
  surahMeaning: string;
  currentIndex: number;
  totalAyahs: number;
  playingAyat?: number | null;
  isPlaying: boolean;
  isLoading: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onPressCard?: () => void;
}

export const FullSurahMiniPlayer: React.FC<FullSurahMiniPlayerProps> = ({
  surahName,
  surahMeaning,
  currentIndex,
  totalAyahs,
  playingAyat,
  isPlaying,
  isLoading,
  onPlayPause,
  onPrevious,
  onNext,
  onPressCard,
}) => {
  const { t } = useTranslation();
  const progress = ((currentIndex + 1) / totalAyahs) * 100;

  return (
    <View style={styles.shell}>
      <View style={styles.glow} />

      <Pressable
        onPress={onPressCard}
        style={({ pressed }) => [
          styles.infoCard,
          pressed && onPressCard ? styles.infoCardPressed : null,
        ]}
      >
        <View style={styles.topRow}>
          <View>
            <Text style={styles.kicker}>{t("Full Surah Player")}</Text>
            <Text style={styles.surahName} numberOfLines={1}>
              {surahName}
            </Text>
          </View>
          <View style={styles.jumpChip}>
            <ChevronUp color={COLORS.TEXT} size={14} />
            <Text style={styles.jumpChipText}>{t("Jump")}</Text>
          </View>
        </View>

        <Text style={styles.meaning} numberOfLines={1}>
          {surahMeaning}
        </Text>

        <View style={styles.nowRow}>
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.TEXT} />
          ) : (
            <View style={styles.playingDot} />
          )}
          <Text style={styles.nowText}>
            {t("Ayah")} {playingAyat || "..."} {t("of")} {totalAyahs}
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </Pressable>

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={onPrevious}
          disabled={currentIndex === 0}
          style={styles.controlButton}
          activeOpacity={0.8}
        >
          <SkipBack
            color={currentIndex === 0 ? COLORS.SECONDARY : COLORS.TEXT}
            size={24}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onPlayPause}
          style={styles.playButton}
          activeOpacity={0.85}
        >
          {isPlaying ? (
            <Pause color={COLORS.TEXT} size={24} fill={COLORS.TEXT} />
          ) : (
            <Play color={COLORS.TEXT} size={24} fill={COLORS.TEXT} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNext}
          disabled={currentIndex >= totalAyahs - 1}
          style={styles.controlButton}
          activeOpacity={0.8}
        >
          <SkipForward
            color={currentIndex >= totalAyahs - 1 ? COLORS.SECONDARY : COLORS.TEXT}
            size={24}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shell: {
    backgroundColor: "rgba(8, 14, 36, 0.98)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
    padding: 16,
  },
  glow: {
    position: "absolute",
    left: -20,
    top: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(164, 74, 255, 0.18)",
  },
  infoCard: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  infoCardPressed: {
    opacity: 0.9,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  kicker: {
    color: COLORS.SECONDARY,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  surahName: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontWeight: "800",
    maxWidth: "100%",
  },
  meaning: {
    color: COLORS.TEXT,
    opacity: 0.88,
    fontSize: 13,
    marginTop: 6,
  },
  jumpChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  jumpChipText: {
    color: COLORS.TEXT,
    fontSize: 11,
    fontWeight: "700",
  },
  nowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
  },
  playingDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: COLORS.PRIMARY,
  },
  nowText: {
    color: COLORS.TEXT,
    fontSize: 14,
    fontWeight: "700",
  },
  progressTrack: {
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginTop: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: COLORS.PRIMARY,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 8,
  },
  controlButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  playButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.PRIMARY,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
});
