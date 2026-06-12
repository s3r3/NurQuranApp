import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Bookmark } from "lucide-react-native";
import { COLORS } from "../../constants/colors";
import { useTranslation } from "react-i18next";

interface EmptyBookmarkStateProps {
  onCreateCollection: () => void;
}

export const EmptyBookmarkState: React.FC<EmptyBookmarkStateProps> = ({
  onCreateCollection,
}) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Bookmark color={COLORS.SECONDARY} size={48} />
      <Text style={styles.title}>{t("No bookmarks or collections yet")}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={onCreateCollection}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>{t("Create")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  title: {
    color: COLORS.SECONDARY,
    fontSize: 18,
    marginTop: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  buttonText: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: "600",
  },
});
