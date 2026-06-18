import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { preloadQuranData } from "../components/preloadQuranData";
import Header from "../components/Header";
import MainTabNavigator from "../components/MainTabNavigator";
import { HomeTabs } from "../components/HomeTabs";
import { GreetingSection, LastReadCard, HomeTabBar, EmptyState } from "../components/home";
import { useHomeData } from "../hooks/useHomeData";
import { useHomeNavigation } from "../hooks/useHomeNavigation";
import { useActiveTab } from "../hooks/useActiveTab";
import { useHomeColors } from "../constants/home.constants";
import { useTranslation } from "react-i18next";

const INTRO_EXPANDED_HEIGHT = 228;
const INTRO_COLLAPSED_HEIGHT = 170;
const GREETING_COLLAPSE_DISTANCE = 56;

const HomeScreen = () => {
  const { t } = useTranslation();
  const colors = useHomeColors();
  const { activeTab, changeTab } = useActiveTab();
  const scrollY = useRef(new Animated.Value(0)).current;
  const {
    surahs,
    isLoading,
    isError,
    error,
    refetch,
    lastReadData,
  } = useHomeData();
  const { navigateToLastRead } = useHomeNavigation();

  useEffect(() => {
    // Preload Quran data in background
    preloadQuranData();
  }, []);

  useEffect(() => {
    scrollY.setValue(0);
  }, [activeTab, scrollY]);

  const handleLastReadPress = () => {
    navigateToLastRead(lastReadData);
  };

  const introHeight = scrollY.interpolate({
    inputRange: [0, GREETING_COLLAPSE_DISTANCE],
    outputRange: [INTRO_EXPANDED_HEIGHT, INTRO_COLLAPSED_HEIGHT],
    extrapolate: "clamp",
  });

  const greetingHeight = scrollY.interpolate({
    inputRange: [0, GREETING_COLLAPSE_DISTANCE],
    outputRange: [56, 0],
    extrapolate: "clamp",
  });

  const greetingOpacity = scrollY.interpolate({
    inputRange: [0, 24, GREETING_COLLAPSE_DISTANCE],
    outputRange: [1, 0.6, 0],
    extrapolate: "clamp",
  });

  const lastReadTranslateY = scrollY.interpolate({
    inputRange: [0, GREETING_COLLAPSE_DISTANCE],
    outputRange: [0, -6],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView edges={["top"]} style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <Header title={t("NurQuran")} />

      <Animated.View
        style={[
          styles.introContainer,
          {
            height: introHeight,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.greetingWrapper,
            {
              height: greetingHeight,
              opacity: greetingOpacity,
            },
          ]}
        >
          <GreetingSection />
        </Animated.View>

        <Animated.View style={{ transform: [{ translateY: lastReadTranslateY }] }}>
          <LastReadCard lastRead={lastReadData} onPress={handleLastReadPress} />
        </Animated.View>
      </Animated.View>

      <HomeTabBar activeTab={activeTab} onTabChange={changeTab} />

      <View style={styles.contentArea}>
        {isError ? (
          <EmptyState error={error} onRetry={refetch} />
        ) : activeTab === "Surah" && isLoading ? (
          <EmptyState
            isLoading
            message={`${t("Loading surahs")}...`}
            progress={undefined}
          />
        ) : (
          <HomeTabs
            activeTab={activeTab}
            surahs={surahs}
            scrollY={scrollY}
          />
        )}
      </View>

      <MainTabNavigator active="home" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentArea: {
    flex: 1,
  },
  introContainer: {
    overflow: "hidden",
  },
  greetingWrapper: {
    overflow: "hidden",
  },
});

export default HomeScreen;
