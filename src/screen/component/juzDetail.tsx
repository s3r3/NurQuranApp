import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowLeft, Share2, Play, Bookmark, Search } from "lucide-react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { AnimatedQuran } from "../../components/SurahAssets";

// Fetching data Juz dengan Error Handling lebih kuat
const fetchJuzDetail = async (id: number) => {
  try {
    // Fetch Arabic dan Indonesian translation secara parallel
    const [arabicResponse, indonesianResponse] = await Promise.all([
      axios.get(`https://api.alquran.cloud/v1/juz/${id}/ar.uthmani`),
      axios.get(`https://api.alquran.cloud/v1/juz/${id}/id.indonesian`),
    ]);

    console.log("Arabic Response:", arabicResponse.data);
    console.log("Indonesian Response:", indonesianResponse.data);

    // Validasi response
    if (
      !arabicResponse.data.data?.ayahs ||
      !indonesianResponse.data.data?.ayahs
    ) {
      throw new Error("Data ayat tidak ditemukan untuk Juz ini");
    }

    // Merge data - kombinasikan teks Arab dan Indonesia
    const arabiAyahs = arabicResponse.data.data.ayahs;
    const indonesianAyahs = indonesianResponse.data.data.ayahs;

    const mergedAyahs = arabiAyahs.map((arabicAyah: any, index: number) => ({
      ...arabicAyah,
      textIndonesian: indonesianAyahs[index]?.text || "",
    }));

    return {
      ...arabicResponse.data.data,
      ayahs: mergedAyahs,
    };
  } catch (error) {
    console.error("Error fetching Juz:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Gagal menyambung ke server: ${error.message}`);
    }
    throw new Error("Gagal menyambung ke server. Periksa koneksi internet.");
  }
};

const JuzDetail = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "JuzDetail">>();
  const { juzId } = route.params;

  const {
    data: juz,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["juz", juzId],
    queryFn: () => fetchJuzDetail(juzId),
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!juzId,
  });

  const renderAyatItem = ({ item }: any) => (
    <View style={styles.ayatContainer}>
      <View style={styles.ayatActionBar}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{item.numberInSurah}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity>
            <Share2 color="#A44AFF" size={20} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Play
              color="#A44AFF"
              size={20}
              fill="#A44AFF"
              style={{ marginHorizontal: 20 }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Bookmark color="#A44AFF" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tampilkan nama surah */}
      <Text style={styles.surahTag}>{item.surah?.englishName || "Surah"}</Text>
      
      {/* Teks Arab */}
      <Text style={styles.arabicText}>{item.text}</Text>
      
      {/* Terjemahan Indonesia */}
      <Text style={styles.translationText}>{item.textIndonesian}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color="#8D92A3" size={28} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Juz {juzId}</Text>
        <Search color="#8D92A3" size={28} />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#A44AFF" />
          <Text style={styles.infoText}>Memuat Juz {juzId}...</Text>
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{(error as Error).message}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Coba Lagi
            </Text>
          </TouchableOpacity>
        </View>
      ) : !juz || !juz.ayahs || juz.ayahs.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Tidak ada data ayat untuk Juz {juzId}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Coba Lagi
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={juz.ayahs}
          keyExtractor={(item, index) => `${juzId}-${index}`}
          renderItem={renderAyatItem}
          initialNumToRender={10}
          ListHeaderComponent={
            <View style={styles.bannerCard}>
              <Text style={styles.bannerTitle}>Juz {juzId}</Text>
              <View style={styles.divider} />
              <AnimatedQuran />
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1535" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  navHeader: {
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  navTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  bannerCard: {
    margin: 20,
    padding: 25,
    backgroundColor: "#6236CC",
    borderRadius: 20,
    alignItems: "center",
  },
  bannerTitle: { color: "white", fontSize: 24, fontWeight: "bold" },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    width: "80%",
    marginVertical: 15,
  },
  ayatContainer: {
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(141,146,163,0.1)",
  },
  ayatActionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(18,25,49,0.5)",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  numberBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#A44AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: { color: "white", fontSize: 12, fontWeight: "bold" },
  actions: { flexDirection: "row", alignItems: "center" },
  surahTag: {
    color: "#A44AFF",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 5,
  },
  arabicText: {
    color: "white",
    fontSize: 24,
    textAlign: "right",
    lineHeight: 45,
    marginBottom: 10,
    fontWeight: "bold",
  },
  translationText: { color: "#8D92A3", fontSize: 15, lineHeight: 22 },
  listContent: { paddingBottom: 40 },
  infoText: { color: "white", marginTop: 10 },
  errorText: { color: "#ff5252", textAlign: "center", marginBottom: 20 },
  retryButton: {
    backgroundColor: "#A44AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});

export default JuzDetail;
