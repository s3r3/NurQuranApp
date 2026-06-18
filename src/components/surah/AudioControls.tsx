import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Pressable } from "react-native";
import { SkipBack, SkipForward } from "lucide-react-native";
import { COLORS } from "../../constants/colors";

interface AudioControlsProps {
  currentIndex: number;
  totalAyahs: number;
  playingAyat?: number | null;
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onPressCard?: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  currentIndex,
  totalAyahs,
  playingAyat,
  isLoading,
  onPrevious,
  onNext,
  onPressCard,
}) => {
  const progress = ((currentIndex + 1) / totalAyahs) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.cardGlow} />
      <Pressable
        onPress={onPressCard}
        style={({ pressed }) => [
          styles.infoSection,
          pressed && onPressCard ? styles.infoSectionPressed : null,
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Full Surah</Text>
          </View>
          <Text style={styles.progressText}>
            {currentIndex + 1}/{totalAyahs}
          </Text>
        </View>

        <View style={styles.nowPlayingRow}>
          {isLoading && (
            <ActivityIndicator size="small" color={COLORS.TEXT} style={styles.loadingIcon} />
          )}
          <Text style={styles.nowPlayingTitle}>
            Ayah {playingAyat || "..."}
          </Text>
        </View>

        <Text style={styles.nowPlayingSubtitle}>
          Tap card untuk lompat ke ayat yang sedang diputar
        </Text>
      </Pressable>

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={onPrevious}
          disabled={currentIndex === 0}
          style={styles.controlButton}
        >
          <SkipBack
            color={currentIndex === 0 ? COLORS.SECONDARY : COLORS.TEXT}
            size={24}
          />
        </TouchableOpacity>

        <View style={styles.centerButtonWrap}>
          <View style={styles.centerButtonDot} />
        </View>

        <TouchableOpacity
          onPress={onNext}
          disabled={currentIndex >= totalAyahs - 1}
          style={styles.controlButton}
        >
          <SkipForward
            color={currentIndex >= totalAyahs - 1 ? COLORS.SECONDARY : COLORS.TEXT}
            size={24}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 18,
    padding: 18,
    borderRadius: 22,
    backgroundColor: "rgba(10, 20, 48, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  infoSection: {
    borderRadius: 18,
  },
  infoSectionPressed: {
    opacity: 0.88,
  },
  cardGlow: {
    position: "absolute",
    right: -40,
    top: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(164, 74, 255, 0.18)",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    color: COLORS.TEXT,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  progressText: {
    color: COLORS.SECONDARY,
    fontSize: 12,
    fontWeight: "600",
  },
  nowPlayingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingIcon: {
    marginRight: 2,
  },
  nowPlayingTitle: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontWeight: "800",
    flexShrink: 1,
  },
  nowPlayingSubtitle: {
    color: COLORS.SECONDARY,
    fontSize: 12,
    marginTop: 6,
    marginBottom: 14,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 6,
  },
  controlButton: {
    padding: 10,
    alignItems: "center",
  },
  centerButtonWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  centerButtonDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.PRIMARY,
  },
  progressBarContainer: {
    width: "100%",
    height: 5,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 999,
    marginTop: 12,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 999,
  },
});
