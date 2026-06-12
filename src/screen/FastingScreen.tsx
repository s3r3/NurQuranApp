import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import { useCalendarColors } from "../constants/calendar.constants";
import { useFastingCalendar } from "../hooks/useFastingCalendar";
import { useNotifications } from "../hooks/useNotifications";
import { useCalendarEvents } from "../hooks/useCalendarEvents";
import { useCalendarNavigation } from "../hooks/useCalendarNavigation";
import {
  CalendarHeader,
  NotificationSettings,
  YearSelector,
  MonthSelector,
  CalendarLegend,
  CalendarWeekHeader,
  CalendarDayCell,
  EventModal,
  LoadingState,
} from "../components/fasting";
import MainTabNavigator from "../components/MainTabNavigator";

const FastingScreen = () => {
  const colors = useCalendarColors();
  const {
    selectedYear,
    selectedMonth,
    goToPreviousYear,
    goToNextYear,
    goToPreviousMonth,
    goToNextMonth,
  } = useCalendarNavigation();

  const { calendarData, loading, refetch } = useFastingCalendar(selectedYear);
  const {
    fastingNotifEnabled,
    setFastingNotifEnabled,
    eventNotifEnabled,
    setEventNotifEnabled,
    scheduledCount,
    isScheduling,
    requestPermissions,
    scheduleAllNotifications,
  } = useNotifications();

  const { selectedEvent, showModal, handleDayPress, closeModal } = useCalendarEvents();

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    if (Object.keys(calendarData).length > 0) {
      scheduleAllNotifications(calendarData);
    }
  }, [calendarData, fastingNotifEnabled, eventNotifEnabled]);

  const daysInMonth = calendarData[selectedMonth] || [];

  const renderCalendar = () => {
    const cells = [];
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(
        <View
          key={`empty-${i}`}
          style={[styles.dayCellPlaceholder, { backgroundColor: "transparent" }]}
        />
      );
    }

    // Add day cells
    for (const day of daysInMonth) {
      cells.push(
        <CalendarDayCell
          key={day.date}
          day={day}
          currentMonth={selectedMonth}
          currentYear={selectedYear}
          onPress={handleDayPress}
        />
      );
    }

    return cells;
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.BACKGROUND },
      ]}
    >
      <StatusBar
        barStyle={colors.BACKGROUND === "#FFFFFF" ? "dark-content" : "light-content"}
        backgroundColor={colors.BACKGROUND}
        translucent={false}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <CalendarHeader />

        <NotificationSettings
          fastingEnabled={fastingNotifEnabled}
          onFastingToggle={setFastingNotifEnabled}
          eventEnabled={eventNotifEnabled}
          onEventToggle={setEventNotifEnabled}
          scheduledCount={scheduledCount}
          isScheduling={isScheduling}
        />

        <YearSelector
          year={selectedYear}
          onPrevious={goToPreviousYear}
          onNext={goToNextYear}
        />

        <CalendarLegend />

        <MonthSelector
          month={selectedMonth}
          year={selectedYear}
          onPrevious={goToPreviousMonth}
          onNext={goToNextMonth}
        />

        <CalendarWeekHeader />

        <View style={styles.grid}>{renderCalendar()}</View>
      </ScrollView>

      <EventModal
        visible={showModal}
        event={selectedEvent}
        onClose={closeModal}
        notificationsEnabled={fastingNotifEnabled || eventNotifEnabled}
      />

      <MainTabNavigator active="fasting" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    marginBottom: 40,
  },
  dayCellPlaceholder: {
    width: "14.28%",
    aspectRatio: 1,
  },
});

export default FastingScreen;
