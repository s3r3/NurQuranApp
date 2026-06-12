import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Share2, Trash2 } from "lucide-react-native";
import { COLORS, COLLECTION_COLORS } from "../../constants/colors";
import { AyahItemCollection } from "../../types/quran.types";
import { useTranslation } from "react-i18next";

interface CollectionAyahItemProps {
  item: AyahItemCollection;
  onPress: (item: AyahItemCollection) => void;
  onShare: (item: AyahItemCollection) => void;
  onRemove: (item: AyahItemCollection) => void;
}

export const CollectionAyahItem: React.FC<CollectionAyahItemProps> = ({
  item,
  onPress,
  onShare,
  onRemove,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.content}
        onPress={() => onPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <Text style={styles.surahName}>{item.surahName}</Text>
          <Text style={styles.ayahNumber}>
            {t("Ayah")} {item.nomorAyat}
          </Text>
        </View>
        <Text style={styles.ayahText} numberOfLines={3}>
          {item.ayahText}
        </Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => onShare(item)}
          style={styles.actionButton}
        >
          <Share2 color={COLORS.PRIMARY} size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onRemove(item)}
          style={styles.actionButton}
        >
          <Trash2 color={COLLECTION_COLORS.ERROR} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: COLLECTION_COLORS.BORDER,
    backgroundColor: COLLECTION_COLORS.ITEM_BG,
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
    gap: 8,
  },
  surahName: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: "600",
  },
  ayahNumber: {
    color: COLORS.SECONDARY,
    fontSize: 14,
  },
  ayahText: {
    color: COLORS.SECONDARY,
    fontSize: 13,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    paddingLeft: 10,
  },
  actionButton: {
    padding: 4,
  },
});
