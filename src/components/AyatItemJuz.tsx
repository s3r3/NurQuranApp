import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AyatActionBar } from "./AyatActionBar";
import { AyatJuzItemsProps } from "../types/quran.types";
import { COLORS } from "../constants/colors";
import { useTranslation } from "react-i18next";



export const AyatItem: React.FC<AyatJuzItemsProps> = ({
  item,
  juzId,
  language,
  isBookmarked,
  isPlaying,
  onShare,
  onPlay,
  onBookmark,
  onBookmarkLongPress,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <AyatActionBar
        ayatNumber={item.numberInSurah}
        isBookmarked={isBookmarked}
        isPlaying={isPlaying}
        onShare={onShare}
        onPlay={onPlay}
        onBookmark={onBookmark}
        onBookmarkLongPress={onBookmarkLongPress || onBookmark}
      />
      
      <Text style={styles.surahTag}>
        {item.surah?.englishName || t("Surah")}
      </Text>
      
      <Text style={styles.arabicText}>{item.text}</Text>
      
      <Text style={styles.translationText}>
        {language === "en"
          ? item.textEnglish || item.textIndonesian
          : item.textIndonesian}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.BORDER,
  },
  surahTag: {
    color: COLORS.PRIMARY,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 5,
  },
  arabicText: {
    color: COLORS.TEXT,
    fontSize: 24,
    textAlign: "right",
    lineHeight: 45,
    marginBottom: 10,
    fontWeight: "bold",
  },
  translationText: {
    color: COLORS.SECONDARY,
    fontSize: 15,
    lineHeight: 22,
  },
});
