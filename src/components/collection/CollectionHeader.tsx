import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import {
  ArrowLeft,
  Trash2,
  MoreVertical,
  Pin,
  PinOff,
} from "lucide-react-native";
import { COLORS, COLLECTION_COLORS } from "../../constants/colors";
import { useTranslation } from "react-i18next";

interface CollectionHeaderProps {
  collectionName: string;
  isPinned: boolean;
  onBack: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
}

export const CollectionHeader: React.FC<CollectionHeaderProps> = ({
  collectionName,
  isPinned,
  onBack,
  onTogglePin,
  onDelete,
}) => {
  const { t } = useTranslation();

  const showMenu = () => {
    Alert.alert(
      collectionName,
      t("Collection Options"),
      [
        {
          text: isPinned ? t("Unpin Collection") : t("Pin Collection"),
          onPress: onTogglePin,
        },
        {
          text: t("Delete Collection"),
          style: "destructive",
          onPress: onDelete,
        },
        { text: t("Cancel"), style: "cancel" },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <ArrowLeft color={COLORS.TEXT} size={24} />
      </TouchableOpacity>

      <Text style={styles.headerTitle} numberOfLines={1}>
        {collectionName}
      </Text>

      <View style={styles.headerActions}>
        {isPinned && (
          <View style={styles.pinIndicator}>
            <Pin
              color={COLLECTION_COLORS.PIN}
              size={18}
              fill={COLLECTION_COLORS.PIN}
            />
          </View>
        )}
        <TouchableOpacity onPress={showMenu} style={styles.menuButton}>
          <MoreVertical color={COLORS.TEXT} size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: COLLECTION_COLORS.BORDER,
    backgroundColor: COLORS.BACKGROUND,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: COLORS.TEXT,
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    marginHorizontal: 16,
    textAlign: "center",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pinIndicator: {
    padding: 4,
  },
  menuButton: {
    padding: 4,
  },
});
