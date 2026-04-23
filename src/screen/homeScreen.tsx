import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Search, Menu } from "lucide-react-native";
import { AnimatedQuran } from "../components/SurahAssets";
import Animated, { FadeInDown } from "react-native-reanimated";
// Import semua komponen tab dari HomeTabs
import { SurahList, ParaList } from "../components/HomeTabs";
import MainTabNavigator from "../components/MainTabNavigator";
import { RootStackParamList } from "../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useQuranStore } from "../store/useAppStore";
import Header from "./component/Header";
import { preloadQuranData } from "./component/preloadQuranData";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
// Fetching data dari API Equran.id
const fetchSurahs = async () => {
  const response = await axios.get("https://equran.id/api/v2/surat");
  return response.data.data;
};

const HomeScreen = () => {
  useEffect(() => {
    preloadQuranData();
  }, []);
  // State harus ada di dalam komponen
  const [activeTab, setActiveTab] = useState("Surah");
  const navigation = useNavigation<NavigationProp>();
  const { lastRead } = useQuranStore();

  const { data: surahs, isLoading } = useQuery({
    queryKey: ["surahs"],
    queryFn: fetchSurahs,
  });

  // Fungsi render konten berdasarkan tab
  const renderContent = () => {
    switch (activeTab) {
      case "Surah":
        return <SurahList surahs={surahs || []} />;
      case "Para":
        return <ParaList />;

      default:
        return <SurahList surahs={surahs || []} />;
    }
  };

  const handleLastReadPress = () => {
    if (lastRead) {
      navigation.navigate("SurahDetail", {
        surahId: lastRead.surahId,
        nomorAyat: lastRead.nomorAyat,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="NurQuran" />

      {/* Greeting */}
      <View style={styles.greetingSection}>
        <Text style={styles.greetingText}>Assalamualaikum</Text>
      </View>

      {/* Last Read Card */}
      <TouchableOpacity
        onPress={handleLastReadPress}
        style={styles.lastReadCard}
        disabled={!lastRead}
      >
        <View style={styles.cardContent}>
          <View style={styles.lastReadLabelContainer}>
            <Text style={styles.lastReadText}>Last Read</Text>
          </View>
          <Text style={styles.lastReadSurah}>
            {lastRead?.namaLatin || "Al-Fatihah"}
          </Text>
          <Text style={styles.lastReadAyah}>
            Ayah No: {lastRead?.nomorAyat || 1}
          </Text>
        </View>
        <View style={styles.cardIllustration}>
          <AnimatedQuran />
        </View>
      </TouchableOpacity>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {["Surah", "Para"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content Area */}
      <View style={{ flex: 1 }}>{renderContent()}</View>
      <MainTabNavigator active="home" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1535" },
  lastReadLabelContainer: {
    backgroundColor: "#A44AFF",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
  },
  headerTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  greetingSection: { paddingHorizontal: 20, marginTop: 10 },
  greetingText: { color: "#8D92A3", fontSize: 18 },
  lastReadCard: {
    margin: 20,
    height: 130,
    backgroundColor: "#6236CC",
    borderRadius: 20,
    flexDirection: "row",
    padding: 20,
    overflow: "hidden",
  },
  cardContent: { flex: 1, justifyContent: "center" },
  lastReadText: { color: "white", fontSize: 14, fontWeight: "500" },
  lastReadSurah: {
    color: "pink",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },
  lastReadAyah: { color: "white", fontSize: 14, opacity: 0.8 },
  cardIllustration: {
    position: "absolute",
    right: -10,
    bottom: -10,
    opacity: 0.9,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  tab: { paddingVertical: 10, paddingHorizontal: 20 },
  activeTab: { borderBottomWidth: 3, borderBottomColor: "#A44AFF" },
  tabText: { color: "#8D92A3", fontWeight: "bold" },
  activeTabText: { color: "white" },
  // Hapus listContent karena sudah di-handle di dalam komponen tab masing-masing
});

export default HomeScreen;
