import React from "react";
import { View, Text, StyleSheet, Switch, ActivityIndicator } from "react-native";
import { Bell, BellOff } from "lucide-react-native";
import { useCalendarColors } from "../../constants/calendar.constants";
import { useTranslation } from "react-i18next";

interface NotificationSettingsProps {
  fastingEnabled: boolean;
  onFastingToggle: (value: boolean) => void;
  eventEnabled: boolean;
  onEventToggle: (value: boolean) => void;
  scheduledCount: number;
  isScheduling: boolean;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  fastingEnabled,
  onFastingToggle,
  eventEnabled,
  onEventToggle,
  scheduledCount,
  isScheduling,
}) => {
  const { t } = useTranslation();
  const colors = useCalendarColors();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.CARD_BG, borderColor: colors.BORDER },
      ]}
    >
      <Text style={[styles.title, { color: colors.TEXT }]}>🔔 {t("Notification Settings")}</Text>

      <View style={styles.row}>
        <View style={styles.info}>
          <Bell color={colors.WARNING} size={18} />
          <View style={styles.textContainer}>
            <Text style={[styles.label, { color: colors.TEXT }]}>{t("Fasting Reminders")}</Text>
            <Text style={[styles.desc, { color: colors.TEXT_SECONDARY }]}>
              {t("Notification the night before fasting day")}
            </Text>
          </View>
        </View>
        <Switch
          value={fastingEnabled}
          onValueChange={onFastingToggle}
          trackColor={{ false: colors.SWITCH_TRACK_OFF, true: colors.PRIMARY }}
          thumbColor={colors.BUTTON_TEXT}
        />
      </View>

      <View style={styles.row}>
        <View style={styles.info}>
          <Bell color={colors.SECONDARY} size={18} />
          <View style={styles.textContainer}>
            <Text style={[styles.label, { color: colors.TEXT }]}>{t("Important Islamic Days")}</Text>
            <Text style={[styles.desc, { color: colors.TEXT_SECONDARY }]}>
              {t("Notification before important Islamic days")}
            </Text>
          </View>
        </View>
        <Switch
          value={eventEnabled}
          onValueChange={onEventToggle}
          trackColor={{ false: colors.SWITCH_TRACK_OFF, true: colors.PRIMARY }}
          thumbColor={colors.BUTTON_TEXT}
        />
      </View>

      <View style={[styles.status, { borderTopColor: colors.BORDER }]}>
        {isScheduling ? (
          <View style={styles.statusRow}>
            <ActivityIndicator size="small" color={colors.PRIMARY} />
            <Text style={[styles.statusText, { color: colors.TEXT_SECONDARY }]}>
              {t("Scheduling notifications")}...
            </Text>
          </View>
        ) : (
          <View style={styles.statusRow}>
            {scheduledCount > 0 ? (
              <Bell color={colors.SECONDARY} size={14} />
            ) : (
              <BellOff color={colors.ERROR} size={14} />
            )}
            <Text
              style={[
                styles.statusText,
                { color: scheduledCount > 0 ? colors.SECONDARY : colors.ERROR },
              ]}
            >
              {scheduledCount > 0
                ? `${scheduledCount} ${t("notifications scheduled")}`
                : t("No notifications scheduled")}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  desc: {
    fontSize: 11,
    marginTop: 2,
  },
  status: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
