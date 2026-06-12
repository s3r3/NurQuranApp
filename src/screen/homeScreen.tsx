import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
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

const HomeScreen = () => {
  const { t } = useTranslation();
  const colors = useHomeColors();
  const { activeTab, changeTab } = useActiveTab();
  const { surahs, isLoading, isError, error, refetch, hasLastRead, lastReadData } = useHomeData();
  const { navigateToLastRead } = useHomeNavigation();

  useEffect(() => {
    // Preload Quran data in background
    preloadQuranData();
  }, []);

  const handleLastReadPress = () => {
    navigateToLastRead(lastReadData);
  };

  const renderContent = () => {
    if (isError) {
      return <EmptyState error={error} onRetry={refetch} />;
    }

    return <HomeTabs activeTab={activeTab} surahs={surahs} />;
  };

  return (
    <SafeAreaView edges={["top"]} style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <Header title={t("NurQuran")} />

      <GreetingSection />

      <LastReadCard lastRead={lastReadData} onPress={handleLastReadPress} />

      <HomeTabBar activeTab={activeTab} onTabChange={changeTab} />

      <View style={styles.contentArea}>{renderContent()}</View>

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
});

export default HomeScreen;
