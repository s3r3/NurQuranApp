import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, StatusBar } from "react-native";
import { useCalendarColors } from "../../constants/calendar.constants";
import { useTranslation } from "react-i18next";

export const LoadingState: React.FC = () => {
  const { t } = useTranslation();
  const colors = useCalendarColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <StatusBar
        barStyle={colors.BACKGROUND === "#FFFFFF" ? "dark-content" : "light-content"}
        backgroundColor={colors.BACKGROUND}
        translucent={false}
      />
      <ActivityIndicator size="large" color={colors.PRIMARY} />
      <Text style={[styles.text, { color: colors.TEXT }]}>{t("Loading Islamic Calendar")}...</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 12,
  },
});
