import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { PlusSquare, ListFilter } from "lucide-react-native";
import { COLORS, BOOKMARK_COLORS } from "../../constants/colors";
import { useTranslation } from "react-i18next";

interface AddCollectionCardProps {
  onPress: () => void;
}

export const AddCollectionCard: React.FC<AddCollectionCardProps> = ({
  onPress,
}) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <PlusSquare color={COLORS.PRIMARY} size={28} />
        <Text style={styles.addText}>{t("Add new collection")}</Text>
      </View>
      <ListFilter color={COLORS.TEXT} size={24} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
    backgroundColor: BOOKMARK_COLORS.ADD_SECTION_BG,
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: BOOKMARK_COLORS.ADD_SECTION_BORDER,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  addText: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 15,
  },
});
