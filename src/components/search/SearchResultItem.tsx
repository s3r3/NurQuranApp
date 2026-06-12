import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SEARCH_COLORS, SEARCH_SIZES } from "../../constants/search.constants";
import { Surah } from "../../types/search.types";
import { useTranslation } from "react-i18next";
import { getSurahMeaning } from "../../utils/surahMeaning";

interface SearchResultItemProps {
  item: Surah;
  onPress: (surahId: number) => void;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = memo(({ item, onPress }) => {
  const { t, i18n } = useTranslation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item.nomor)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{item.nomor}</Text>
        </View>
        
        <View style={styles.info}>
          <Text style={styles.title}>{item.namaLatin}</Text>
          <Text style={styles.subtitle}>
            {getSurahMeaning(item.nomor, item.arti, i18n.language)} • {item.jumlahAyat} {t("Ayat")}
          </Text>
        </View>
        
        <Text style={styles.arabic}>{item.nama}</Text>
      </View>
    </TouchableOpacity>
  );
});

SearchResultItem.displayName = 'SearchResultItem';

const styles = StyleSheet.create({
  container: {
    backgroundColor: SEARCH_COLORS.cardBackground,
    borderRadius: SEARCH_SIZES.borderRadius,
    padding: SEARCH_SIZES.cardPadding,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: SEARCH_COLORS.border,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  numberBadge: {
    width: SEARCH_SIZES.numberBadge,
    height: SEARCH_SIZES.numberBadge,
    borderRadius: SEARCH_SIZES.numberBadge / 2,
    backgroundColor: SEARCH_COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    color: SEARCH_COLORS.text,
    fontWeight: "bold",
    fontSize: 14,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: SEARCH_COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    color: SEARCH_COLORS.secondaryText,
    fontSize: 13,
    marginTop: 4,
  },
  arabic: {
    color: SEARCH_COLORS.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
});
