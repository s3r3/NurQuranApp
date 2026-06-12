import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Bell } from "lucide-react-native";
import { usePrayerColors } from "../../constants/prayer.constants";
import { PrayerName } from "../../types/quran.types";
import { useTranslation } from "react-i18next";

interface PrayerTimeItemProps {
  name: PrayerName;
  time: string;
  isActive: boolean;
  isNext: boolean;
}

export const PrayerTimeItem: React.FC<PrayerTimeItemProps> = ({
  name,
  time,
  isActive,
  isNext,
}) => {
  const { t } = useTranslation();
  const colors = usePrayerColors();
  const isHighlighted = isActive || isNext;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isHighlighted
            ? colors.ACTIVE_CARD_BG
            : colors.CARD_BG,
        },
        isHighlighted && { borderColor: colors.ACCENT, borderWidth: 1.5 },
      ]}
    >
      <View style={styles.info}>
        <Bell
          color={isHighlighted ? colors.TEXT_PRIMARY : colors.PRIMARY}
          size={22}
          fill={isHighlighted ? colors.TEXT_PRIMARY : "transparent"}
        />
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.name,
              {
                color: isHighlighted
                  ? colors.TEXT_PRIMARY
                  : colors.TEXT_PRIMARY,
              },
            ]}
          >
            {name}
          </Text>
          <Text
            style={[
              styles.status,
              {
                color: isHighlighted
                  ? colors.TEXT_PRIMARY
                  : colors.TEXT_SECONDARY,
                opacity: isHighlighted ? 0.8 : 1,
              },
            ]}
          >
            {isActive
              ? t("Currently running")
              : isNext
                ? t("Next prayer")
                : t("Reminder active")}
          </Text>
        </View>
      </View>
      <Text style={[styles.time, { color: colors.TEXT_PRIMARY }]}>
        {time || "--:--"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  status: {
    fontSize: 13,
  },
  time: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
