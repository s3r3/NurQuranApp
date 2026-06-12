import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { usePrayerColors } from "../../constants/prayer.constants";
import { useTranslation } from "react-i18next";

interface NotificationSettingsProps {
  isReminderActive: boolean;
  isPreNotificationActive: boolean;
  onReminderToggle: () => void;
  onPreNotificationToggle: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  isReminderActive,
  isPreNotificationActive,
  onReminderToggle,
  onPreNotificationToggle,
}) => {
  const { t } = useTranslation();
  const colors = usePrayerColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.CARD_BG }]}>
      <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>
        {t("Notification Settings")}
      </Text>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.TEXT_SECONDARY }]}>
          {t("Prayer Reminders")}
        </Text>
        <Switch
          value={isReminderActive}
          onValueChange={onReminderToggle}
          trackColor={{ false: "#3E4462", true: colors.PRIMARY }}
          thumbColor={colors.TEXT_PRIMARY}
        />
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.TEXT_SECONDARY }]}>
          {t("15 min before notification")}
        </Text>
        <Switch
          value={isPreNotificationActive}
          onValueChange={onPreNotificationToggle}
          trackColor={{ false: "#3E4462", true: colors.PRIMARY }}
          thumbColor={colors.TEXT_PRIMARY}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
  },
});
