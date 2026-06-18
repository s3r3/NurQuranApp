import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  PanResponder,
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
    goToToday,
  } = useCalendarNavigation();

  const calendarPanResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gestureState) =>
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
          Math.abs(gestureState.dx) > 12,
        onPanResponderRelease: (_event, gestureState) => {
          if (gestureState.dx < -40) {
            goToNextMonth();
          } else if (gestureState.dx > 40) {
            goToPreviousMonth();
          }
        },
      }),
    [goToNextMonth, goToPreviousMonth],
  );

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroCard}>
          <CalendarHeader />
          <NotificationSettings
            fastingEnabled={fastingNotifEnabled}
            onFastingToggle={setFastingNotifEnabled}
            eventEnabled={eventNotifEnabled}
            onEventToggle={setEventNotifEnabled}
            scheduledCount={scheduledCount}
            isScheduling={isScheduling}
          />
        </View>

        <View style={styles.controlCard}>
          <View style={styles.controlHeader}>
            <YearSelector
              year={selectedYear}
              onPrevious={goToPreviousYear}
              onNext={goToNextYear}
              onToday={goToToday}
            />
          </View>
        </View>

        <View style={styles.legendCard}>
          <CalendarLegend />
        </View>

        <View style={styles.monthCard}>
          <MonthSelector month={selectedMonth} year={selectedYear} />
        </View>

        <View style={styles.calendarCard}>
          <CalendarWeekHeader />
          <View style={styles.calendarArea} {...calendarPanResponder.panHandlers}>
            <View style={styles.grid}>{renderCalendar()}</View>
          </View>
        </View>
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
  scrollContent: {
    paddingBottom: 110,
  },
  heroCard: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 14,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  controlCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 28,
    backgroundColor: "rgba(168, 85, 247, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.12)",
    paddingVertical: 8,
  },
  controlHeader: {
    paddingTop: 2,
  },
  monthCard: {
    marginBottom: 14,
  },
  legendCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingTop: 14,
    paddingBottom: 4,
  },
  calendarCard: {
    marginHorizontal: 16,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingTop: 14,
    paddingBottom: 10,
  },
  calendarArea: {
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  dayCellPlaceholder: {
    width: "14.28%",
    aspectRatio: 1,
  },
});

export default FastingScreen;
