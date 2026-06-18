import React from "react";
import { View, Text, StyleSheet, Switch, ActivityIndicator } from "react-native";
import { Bell, BellOff, Sparkles } from "lucide-react-native";
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
      <View style={styles.header}>
        <View style={[styles.headerIcon, { backgroundColor: colors.PRIMARY_SOFT_BG }]}>
          <Sparkles color={colors.PRIMARY} size={16} />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.TEXT }]}>
            {t("Notification Settings")}
          </Text>
          <Text style={[styles.subtitle, { color: colors.TEXT_SECONDARY }]}>
            {t("Manage reminders and event alerts")}
          </Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.iconBubble, { backgroundColor: colors.PRIMARY_SOFT_BG }]}>
          <Bell color={colors.PRIMARY} size={18} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: colors.TEXT }]}>{t("Fasting Reminders")}</Text>
          <Text style={[styles.desc, { color: colors.TEXT_SECONDARY }]}>
            {t("Notification the night before fasting day")}
          </Text>
        </View>
        <Switch
          value={fastingEnabled}
          onValueChange={onFastingToggle}
          trackColor={{ false: colors.SWITCH_TRACK_OFF, true: colors.PRIMARY }}
          thumbColor={colors.BUTTON_TEXT}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.iconBubble, { backgroundColor: "rgba(16, 185, 129, 0.12)" }]}>
          <Bell color={colors.SECONDARY} size={18} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: colors.TEXT }]}>{t("Important Islamic Days")}</Text>
          <Text style={[styles.desc, { color: colors.TEXT_SECONDARY }]}>
            {t("Notification before important Islamic days")}
          </Text>
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
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    gap: 12,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 12,
  },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
  },
  desc: {
    fontSize: 11,
    marginTop: 2,
  },
  status: {
    borderTopWidth: 1,
    paddingTop: 14,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
