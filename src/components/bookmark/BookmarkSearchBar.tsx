// components/bookmark/BookmarkSearchBar.tsx
import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Search, X } from "lucide-react-native";
import { COLORS } from "../../constants/colors";
import { useTranslation } from "react-i18next";

interface BookmarkSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export const BookmarkSearchBar: React.FC<BookmarkSearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder,
}) => {
  const { t } = useTranslation();
  const displayPlaceholder = placeholder || t("Search bookmarks...");

  return (
    <View style={styles.container}>
      <Search color={COLORS.SECONDARY} size={20} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={displayPlaceholder}
        placeholderTextColor={COLORS.SECONDARY}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear}>
          <X color={COLORS.SECONDARY} size={20} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 44,
  },
  input: {
    flex: 1,
    color: COLORS.TEXT,
    marginLeft: 10,
    fontSize: 16,
  },
});
