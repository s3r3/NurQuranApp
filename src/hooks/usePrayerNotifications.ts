import { useEffect, useCallback } from "react";
import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../store/useAppStore";
import { PrayerTimes, PrayerName, PRAYER_NAMES } from "../types/quran.types";
import { createDateFromTime } from "../utils/timeHelpers";
import { NOTIFICATION_SETTINGS } from "../constants/prayer.constants";
import { Platform } from "react-native";

export const usePrayerNotifications = () => {
  const { t } = useTranslation();
  const {
    prayerTimes,
    locationName,
    isReminderActive,
    isPreNotificationActive,
  } = useAppStore();

  const schedulePrayerNotification = useCallback(async (
    prayerName: PrayerName,
    prayerTime: string,
    isPreNotification: boolean = false
  ) => {
    const date = createDateFromTime(prayerTime);
    const diff = date.getTime() - Date.now();
    
    if (diff <= 0) return;

    const seconds = Math.floor(diff / 1000);
    
    let notificationSeconds = seconds;
    let title = t("Time for Prayer") + ` ${prayerName}`;
    let body = t("Let's perform the") + ` ${prayerName} ` + t("prayer for") + ` ${locationName}.`;

    if (isPreNotification) {
      notificationSeconds = seconds - NOTIFICATION_SETTINGS.PRE_NOTIFICATION_SECONDS;
      if (notificationSeconds <= 0) return;
      title = t("15 Minutes until") + ` ${prayerName}`;
      body = t("Get ready, prayer time") + ` ${prayerName} ` + t("will be here soon.");
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { prayerName, isPreNotification, timestamp: date.toISOString() },
        sound: "default",
        ...(Platform.OS === "android" && { channelId: "prayer-reminders" }),
      },
      trigger: {
        type: SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: notificationSeconds,
      },
    });
  }, [t, locationName]);

  const scheduleAllNotifications = useCallback(async (timings: PrayerTimes) => {
    // Cancel all existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    if (!isReminderActive) return;

    // Setup notification channels for Android
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("prayer-reminders", {
        name: t("Prayer Reminders"),
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#A44AFF",
        sound: "default",
      });
    }
   

    let scheduledCount = 0;

    for (const prayerName of PRAYER_NAMES) {
      if (!timings[prayerName]) continue;

      // Schedule main prayer notification
      await schedulePrayerNotification(prayerName, timings[prayerName], false);
      scheduledCount++;

      // Schedule pre-notification if enabled
      if (isPreNotificationActive) {
        await schedulePrayerNotification(prayerName, timings[prayerName], true);
        scheduledCount++;
      }
    }

    console.log(`Scheduled ${scheduledCount} prayer notifications`);
  }, [isReminderActive, isPreNotificationActive, schedulePrayerNotification, t]);

  return {
    scheduleAllNotifications,
  };
};