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
      <View style={[styles.card, { backgroundColor: colors.CARD_BG, borderColor: colors.BORDER }]}>
        <ActivityIndicator size="large" color={colors.PRIMARY} />
        <Text style={[styles.text, { color: colors.TEXT }]}>{t("Loading Islamic Calendar")}...</Text>
        <Text style={[styles.subtext, { color: colors.TEXT_SECONDARY }]}>
          {t("Preparing fasting schedule and event markers")}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 1,
    gap: 8,
  },
  text: {
    marginTop: 12,
    fontWeight: "700",
    fontSize: 15,
    textAlign: "center",
  },
  subtext: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});
