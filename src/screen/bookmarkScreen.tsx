import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import {
  Folder,
  PlusSquare,
  MoreVertical,
  ListFilter,
  Bookmark,
  Pin,
  Trash2,
  ChevronRight,
  Edit,
} from "lucide-react-native";
import { useQuranStore } from "../store/useAppStore";
import { useNavigation } from "@react-navigation/native";
import Header from "./component/Header";
import BottomTabBar from "../components/MainTabNavigator";

const BookmarkScreen = () => {
  const navigation = useNavigation<any>();
  const {
    bookmarks,
    collections,
    removeBookmark,
    deleteCollection,
    pinCollection,
    unpinCollection,
    createCollection,
  } = useQuranStore();

  const pinnedCollections = collections.filter((c) => c.isPinned);
  const unpinnedCollections = collections.filter((c) => !c.isPinned);

  const handleAddCollection = () => {
    Alert.prompt(
      "Create Collection",
      "Enter collection name:",
      (text) => {
        if (text?.trim()) {
          createCollection(text);
          Alert.alert("Success", `Collection "${text}" created!`);
        }
      },
      "plain-text",
      "",
      "default",
    );
  };
  const handleLongPressCollection = (item: any) => {
    Alert.alert("Kelola Koleksi", item.name, [
      {
        text: item.isPinned ? "Lepas Pin" : "Pin Koleksi",
        onPress: () =>
          item.isPinned ? unpinCollection(item.id) : pinCollection(item.id),
      },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => deleteCollection(item.id),
      },
      { text: "Batal", style: "cancel" },
    ]);
  };

  const handleCollectionOptions = (
    collectionId: string,
    collectionName: string,
  ) => {
    Alert.alert(collectionName, "What would you like to do?", [
      {
        text: "View Ayahs",
        onPress: () =>
          navigation.navigate("CollectionDetail", {
            collectionId,
            collectionName,
          }),
      },
      {
        text: pinnedCollections.some((c) => c.id === collectionId)
          ? "Unpin"
          : "Pin",
        onPress: () => {
          if (pinnedCollections.some((c) => c.id === collectionId)) {
            unpinCollection(collectionId);
          } else {
            pinCollection(collectionId);
          }
        },
      },
      {
        text: "Delete",
        onPress: () => {
          Alert.alert(
            "Delete Collection",
            `Are you sure you want to delete "${collectionName}"? This cannot be undone.`,
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                  deleteCollection(collectionId);
                  Alert.alert("Success", "Collection deleted");
                },
              },
            ],
          );
        },
        style: "destructive",
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const sortedCollections = [...collections].sort(
    (a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0),
  );

  const renderBookmarkItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.bookmarkItem}
      onPress={() =>
        navigation.navigate("SurahDetail", {
          surahId: item.surahId,
          nomorAyat: item.nomorAyat,
        })
      }
      activeOpacity={0.7}
    >
      <View style={styles.itemLeft}>
        <View style={styles.textContainer}>
          <View style={styles.row}>
            <Text style={styles.surahName}>{item.surahName}</Text>
            <Text style={styles.ayahNumber}> • Ayah {item.nomorAyat}</Text>
          </View>
          <Text style={styles.arabicTextSmall}>{item.ayahText}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => removeBookmark(item.surahId, item.nomorAyat)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Bookmark color="#A44AFF" size={24} fill="#A44AFF" strokeWidth={2} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderCollectionItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.collectionItem}
      onPress={() =>
        navigation.navigate("CollectionDetail", {
          collectionId: item.id,
          collectionName: item.name,
        })
      }
      onLongPress={() => handleLongPressCollection(item)}
    >
      <View style={styles.itemLeft}>
        <Folder color="#A44AFF" size={28} />
        <View style={styles.textContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.collectionName}>{item.name}</Text>
            {item.isPinned && (
              <Pin
                color="#FFD700"
                size={14}
                fill="#FFD700"
                style={{ marginLeft: 8 }}
              />
            )}
          </View>
          <Text style={styles.itemCount}>{item.items?.length || 0} items</Text>
        </View>
      </View>
      <ChevronRight color="white" size={20} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header title="Bookmarks" />

      {/* Add New Collection Button */}
      <TouchableOpacity style={styles.addSection} onPress={handleAddCollection}>
        <View style={styles.itemLeft}>
          <PlusSquare color="#A44AFF" size={28} />
          <Text style={styles.addText}>Add new collection</Text>
        </View>
        <ListFilter color="white" size={24} />
      </TouchableOpacity>

      {/* Bookmarks List */}
      {bookmarks.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Bookmarked Ayahs</Text>
          <FlatList
            data={bookmarks}
            keyExtractor={(item) => `${item.surahId}-${item.nomorAyat}`}
            renderItem={renderBookmarkItem}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
          />
        </>
      )}

      {/* Pinned Collections */}
      {pinnedCollections.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Pinned Collections</Text>
          <FlatList
            data={pinnedCollections}
            keyExtractor={(item) => item.id}
            renderItem={renderCollectionItem}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
          />
        </>
      )}

      {/* Other Collections */}
      {unpinnedCollections.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Collections</Text>
          <FlatList
            data={unpinnedCollections}
            keyExtractor={(item) => item.id}
            renderItem={renderCollectionItem}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
          />
        </>
      )}

      {bookmarks.length === 0 && collections.length === 0 && (
        <View style={styles.emptyState}>
          <Bookmark color="#8D92A3" size={48} />
          <Text style={styles.emptyStateText}>
            No bookmarks or collections yet
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={handleAddCollection}
          >
            <Text style={styles.emptyStateButtonText}>Create Collection</Text>
          </TouchableOpacity>
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
  addSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
    backgroundColor: "rgba(26, 40, 68, 0.3)",
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "rgba(164, 74, 255, 0.3)",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  addText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 15,
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  bookmarkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(141, 146, 163, 0.3)",
    backgroundColor: "rgba(26, 40, 68, 0.4)",
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  arabicTextSmall: {
    color: "#8D92A3",
    fontSize: 12,
    marginTop: 5,
  },
  collectionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(42, 58, 90, 0.6)",
    backgroundColor: "rgba(26, 40, 68, 0.3)",
  },
  collectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  collectionName: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  itemCount: {
    color: "#8D92A3",
    fontSize: 14,
    marginTop: 2,
  },
  collectionActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  moreButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyStateText: {
    color: "#8D92A3",
    fontSize: 18,
    marginTop: 16,
    textAlign: "center",
  },
  emptyStateButton: {
    backgroundColor: "#A44AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  emptyStateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default BookmarkScreen;
