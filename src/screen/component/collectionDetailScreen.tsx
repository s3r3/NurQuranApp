import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { ArrowLeft, Trash2, Share2, Pin, Edit } from "lucide-react-native";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useQuranStore } from "../../store/useAppStore";
import BottomTabBar from "../../components/MainTabNavigator";

const CollectionDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { collectionId, collectionName } = route.params;

  const {
    collections,
    removeAyatFromCollection,
    deleteCollection,
    pinCollection,
    unpinCollection,
  } = useQuranStore();

  const collection = collections.find((c) => c.id === collectionId);

  if (!collection || !collection.items) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Collection not found</Text>
      </SafeAreaView>
    );
  }

  const handleRemoveAyah = (surahId: number, nomorAyat: number) => {
    Alert.alert(
      "Remove Ayah",
      "Are you sure you want to remove this ayah from the collection?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            removeAyatFromCollection(collectionId, surahId, nomorAyat);
          },
        },
      ],
    );
  };

  const handleShare = (item: any) => {
    const message = `${item.surahName} - Ayah ${item.nomorAyat}\n\n${item.ayahText}`;
    // Implement sharing logic here
    Alert.alert("Share", message);
  };

  const handleNavigateToSurah = (item: any) => {
    navigation.navigate("SurahDetail", {
      surahId: item.surahId,
      nomorAyat: item.nomorAyat,
    });
  };

  const renderAyahItem = ({ item }: { item: any }) => (
    <View style={styles.ayahItem}>
      <TouchableOpacity
        style={styles.ayahContent}
        onPress={() => handleNavigateToSurah(item)}
        activeOpacity={0.7}
      >
        <View style={styles.ayahHeader}>
          <Text style={styles.surahName}>{item.surahName}</Text>
          <Text style={styles.ayahNumber}>Ayah {item.nomorAyat}</Text>
        </View>
        <Text style={styles.ayahText}>{item.ayahText}</Text>
      </TouchableOpacity>
      <View style={styles.ayahActions}>
        <TouchableOpacity onPress={() => handleShare(item)}>
          <Share2 color="#A44AFF" size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleRemoveAyah(item.surahId, item.nomorAyat)}
        >
          <Trash2 color="#FF6B6B" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{collection.name}</Text>
        <View style={styles.headerIcons}>
          {collection.isPinned && (
            <Pin color="#FFD700" size={20} fill="#FFD700" />
          )}
        </View>
      </View>

      {/* Collection Info */}
      <Text style={styles.itemCount}>
        {collection.items?.length || 0} item
        {(collection.items?.length || 0) !== 1 ? "s" : ""}
      </Text>

      {/* Ayahs List */}
      {collection.items && collection.items.length > 0 ? (
        <FlatList
          data={collection.items}
          keyExtractor={(item) => `${item.surahId}-${item.nomorAyat}`}
          renderItem={renderAyahItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No ayahs in this collection yet
          </Text>
        </View>
      )}

      <BottomTabBar active="bookmark" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1535",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(42, 58, 90, 0.6)",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 16,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(42, 58, 90, 0.6)",
  },
  itemCount: {
    color: "#8D92A3",
    fontSize: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  listContent: {
    paddingVertical: 12,
  },
  ayahItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(42, 58, 90, 0.6)",
    backgroundColor: "rgba(26, 40, 68, 0.4)",
  },
  ayahContent: {
    flex: 1,
    marginRight: 12,
  },
  ayahHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  surahName: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  ayahNumber: {
    color: "#8D92A3",
    fontSize: 14,
  },
  ayahText: {
    color: "#8D92A3",
    fontSize: 13,
    lineHeight: 20,
  },
  ayahActions: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    color: "#8D92A3",
    fontSize: 16,
  },
  errorText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});

export default CollectionDetailScreen;
