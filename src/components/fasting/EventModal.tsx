import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { X, Bell } from "lucide-react-native";
import { SelectedEvent } from "../../types/quran.types";
import { useCalendarColors } from "../../constants/calendar.constants";
import { useTranslation } from "react-i18next";

interface EventModalProps {
  visible: boolean;
  event: SelectedEvent | null;
  onClose: () => void;
  notificationsEnabled: boolean;
}

export const EventModal: React.FC<EventModalProps> = ({
  visible,
  event,
  onClose,
  notificationsEnabled,
}) => {
  const { t } = useTranslation();
  const colors = useCalendarColors();

  if (!event) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={[styles.overlay, { backgroundColor: colors.OVERLAY }]}>
        <View style={[styles.content, { backgroundColor: colors.MODAL_BG }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={22} color={colors.TEXT} />
          </TouchableOpacity>

          {event.islamicEvent && (
            <>
              <View
                style={[
                  styles.modalDot,
                  { backgroundColor: colors.IMPORTANT_DOT },
                ]}
              />
              <Text style={[styles.title, { color: colors.TEXT }]}>
                {event.islamicEvent.label}
              </Text>
              <Text style={[styles.hijriDate, { color: colors.PRIMARY }]}>
                {event.islamicEvent.hijriDate}
              </Text>
              <Text style={[styles.description, { color: colors.TEXT_MUTED }]}>
                {event.islamicEvent.description}
              </Text>
            </>
          )}

          {event.fastingEvent && (
            <>
              {!event.islamicEvent && (
                <View
                  style={[
                    styles.modalDot,
                    { backgroundColor: event.fastingEvent.color },
                  ]}
                />
              )}
              {event.islamicEvent && (
                <Text style={[styles.divider, { color: colors.TEXT_MUTED }]}>
                  ------------------
                </Text>
              )}
              <Text style={[styles.title, { color: event.fastingEvent.color }]}>
                {event.fastingEvent.label}
              </Text>
              <Text style={[styles.description, { color: colors.TEXT_MUTED }]}>
                {event.fastingEvent.description}
              </Text>
            </>
          )}

          <Text
            style={[styles.gregorianDate, { color: colors.TEXT_SECONDARY }]}
          >
            {event.gregorianDate}
          </Text>

          <View
            style={[
              styles.notifInfo,
              { backgroundColor: colors.PRIMARY_SOFT_BG },
            ]}
          >
            <Bell color={colors.PRIMARY} size={14} />
            <Text style={[styles.notifText, { color: colors.PRIMARY }]}>
              {notificationsEnabled
                ? t("Notification will be sent the night before (20:00)")
                : t("Notifications disabled")}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.closeModalButton,
              { backgroundColor: colors.PRIMARY },
            ]}
            onPress={onClose}
          >
            <Text
              style={[styles.closeModalText, { color: colors.BUTTON_TEXT }]}
            >
              {t("Close")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "82%",
    borderRadius: 24,
    padding: 26,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  modalDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  hijriDate: {
    marginTop: 8,
    fontWeight: "700",
  },
  description: {
    marginTop: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  gregorianDate: {
    marginTop: 12,
  },
  divider: {
    marginVertical: 10,
    textAlign: "center",
    fontSize: 12,
  },
  notifInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 8,
  },
  notifText: {
    fontSize: 11,
    fontWeight: "500",
  },
  closeModalButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeModalText: {
    fontWeight: "bold",
  },
});
