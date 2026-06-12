import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useHomeColors } from "../../constants/home.constants";
import { useTranslation } from "react-i18next";

export const GreetingSection: React.FC = () => {
  const { t } = useTranslation();
  const colors = useHomeColors();

  // Get greeting based on time of day
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("Good Morning");
    if (hour < 18) return t("Good Afternoon");
    return t("Good Evening");
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.greetingText, { color: colors.TEXT_SECONDARY }]}>
        {getTimeBasedGreeting()}
      </Text>
      <Text style={[styles.assalamualaikum, { color: colors.TEXT_PRIMARY }]}>
        {t("Assalamualaikum")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  greetingText: {
    fontSize: 14,
    marginBottom: 4,
  },
  assalamualaikum: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
