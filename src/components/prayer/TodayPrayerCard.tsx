import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Clock } from "lucide-react-native";
import { usePrayerColors } from "../../constants/prayer.constants";
import { PrayerInfo, PrayerTimes } from "../../types/quran.types";
import { useTranslation } from "react-i18next";

interface TodayPrayerCardProps {
  nextPrayer: PrayerInfo | null;
  prayerTimes: PrayerTimes | null;
  countdown: string;
  locationName: string;
}

export const TodayPrayerCard: React.FC<TodayPrayerCardProps> = ({
  nextPrayer,
  prayerTimes,
  countdown,
  locationName,
}) => {
  const { t } = useTranslation();
  const colors = usePrayerColors();

  const prayerTime =
    nextPrayer?.name && prayerTimes?.[nextPrayer.name]
      ? prayerTimes[nextPrayer.name]
      : "";

  return (
    <View style={[styles.card, { backgroundColor: colors.CARD_PRIMARY_BG }]}>
      <View style={styles.cardRow}>
        <Clock color={colors.TEXT_PRIMARY} size={20} opacity={0.7} />
        <Text style={[styles.label, { color: colors.TEXT_PRIMARY }]}>
          {nextPrayer?.isCurrent ? t("Currently Running") : t("Next Prayer")}
        </Text>
      </View>

      <Text style={[styles.mainTime, { color: colors.TEXT_PRIMARY }]}>
        {nextPrayer?.name || "---"}
      </Text>
      <Text style={[styles.prayerTime, { color: colors.TEXT_PRIMARY }]}>
        {prayerTime}
      </Text>

      <Text style={[styles.countdown, { color: colors.COUNTDOWN_TEXT }]}>
        {nextPrayer?.isCurrent
          ? countdown
          : countdown
            ? `-${countdown}`
            : t("Waiting for Data")}
      </Text>

      <Text style={[styles.location, { color: colors.TEXT_PRIMARY }]}>
        {locationName}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    opacity: 0.9,
  },
  mainTime: {
    fontSize: 32,
    fontWeight: "bold",
  },
  prayerTime: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 4,
    opacity: 0.9,
  },
  countdown: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 4,
  },
  location: {
    opacity: 0.7,
    marginTop: 15,
    fontSize: 14,
  },
});
