import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Search, ArrowLeft, X } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useQuranStore } from "../store/useAppStore";

const SearchScreen = () => {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState("");
  const { allSurahs } = useQuranStore();

  // Pencarian Instant (Tanpa Loading API)
  const filteredResults = useMemo(() => {
    if (query.length < 2) return [];

    const searchKey = query.toLowerCase();
    return allSurahs.filter(
      (surah) =>
        surah.namaLatin.toLowerCase().includes(searchKey) ||
        surah.arti.toLowerCase().includes(searchKey)
    );
  }, [query, allSurahs]);

  const handleClearSearch = () => {
    setQuery("");
  };
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("SurahDetail", { surahId: item.nomor })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{item.nomor}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.title}>{item.namaLatin}</Text>
          <Text style={styles.subTitle}>
            {item.arti} • {item.jumlahAyat} Ayat
          </Text>
        </View>
        <Text style={styles.arabic}>{item.nama}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header & Search Bar */}
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Search color="#8D92A3" size={20} />
          <TextInput
            style={styles.input}
            placeholder="Cari Surah (contoh: Al-Fatihah)"
            placeholderTextColor="#8D92A3"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <X color="white" size={20} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Conditional Rendering berdasarkan status search */}
      {query.length < 2 ? (
        <View style={styles.emptyState}>
          <View style={styles.bigSearchIcon}>
            <Search color="#A44AFF" size={80} opacity={0.3} />
          </View>
          <Text style={styles.emptyTitle}>Mulai Pencarian</Text>
          <Text style={styles.emptySub}>
            Masukkan minimal 2 huruf untuk mencari surah Quran.
          </Text>
        </View>
      ) : filteredResults.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Surah Tidak Ditemukan</Text>
          <Text style={styles.emptySub}>
            Coba cari dengan kata kunci lain
          </Text>
        </View>
      ) : (
        <View style={styles.resultsContainer}>
          <Text style={styles.foundText}>
            Ditemukan {filteredResults.length} hasil
          </Text>
          <FlatList
            data={filteredResults}
            keyExtractor={(item) => item.nomor.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            scrollEnabled
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1535" },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 15,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#121931",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  bigSearchIcon: {
    width: 150,
    height: 150,
    backgroundColor: "#121931",
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  emptyTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptySub: {
    color: "#8D92A3",
    textAlign: "center",
    lineHeight: 22,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  foundText: {
    color: "#8D92A3",
    marginBottom: 15,
    fontSize: 14,
    marginTop: 10,
  },
  card: {
    backgroundColor: "rgba(26, 40, 68, 0.4)",
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: "rgba(164, 74, 255, 0.2)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  numberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#A44AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  subTitle: {
    color: "#8D92A3",
    fontSize: 13,
    marginTop: 4,
  },
  arabic: {
    color: "#A44AFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SearchScreen;