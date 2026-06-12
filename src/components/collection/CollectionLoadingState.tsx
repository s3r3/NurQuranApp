import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { COLORS } from "../../constants/colors";
import { useTranslation } from "react-i18next";

export const CollectionLoadingState: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      <Text style={styles.text}>
        {t("Loading")} {t("Collection")}...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: COLORS.TEXT,
    marginTop: 12,
    fontSize: 16,
  },
});
