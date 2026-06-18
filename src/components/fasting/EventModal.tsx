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
                {t(event.islamicEvent.label)}
              </Text>
              <View style={[styles.metaPill, { backgroundColor: colors.PRIMARY_SOFT_BG }]}>
                <Text style={[styles.hijriDate, { color: colors.PRIMARY }]}>
                  {t(event.islamicEvent.hijriDate)}
                </Text>
              </View>
              <Text style={[styles.description, { color: colors.TEXT_MUTED }]}>
                {t(event.islamicEvent.description)}
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
                <View style={styles.sectionGap} />
              )}
              <Text style={[styles.title, { color: event.fastingEvent.color }]}>
                {t(event.fastingEvent.label)}
              </Text>
              <Text style={[styles.description, { color: colors.TEXT_MUTED }]}>
                {t(event.fastingEvent.description)}
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
    padding: 24,
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
    marginBottom: 12,
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
  },
  hijriDate: {
    fontWeight: "700",
    fontSize: 12,
  },
  metaPill: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  description: {
    marginTop: 12,
    textAlign: "center",
    lineHeight: 22,
  },
  gregorianDate: {
    marginTop: 10,
  },
  notifInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  notifText: {
    fontSize: 11,
    fontWeight: "500",
  },
  closeModalButton: {
    marginTop: 18,
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 14,
  },
  closeModalText: {
    fontWeight: "bold",
  },
  sectionGap: {
    height: 12,
  },
});
