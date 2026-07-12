import React from "react";
import { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  Modal,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../store/useAppStore";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import BottomTabBar from "../components/MainTabNavigator";
import {
  AddCollectionCard,
  BookmarkItem,
  CollectionItem,
  BookmarkSectionHeader,
  EmptyBookmarkState,
  BookmarkSearchBar,
} from "../components/bookmark";
import { useBookmarkScreen } from "../hooks/useBookmarkScreen";
import { useCollectionManagement } from "../hooks/useCollectionManagement";
import { COLORS } from "../constants/colors";

const BookmarkScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const { createCollection } = useAppStore();

  const {
    bookmarks,
    pinnedCollections,
    unpinnedCollections,
    hasAnyContent,
    handleBookmarkPress,
    handleRemoveBookmark,
    handleCollectionPress,
  } = useBookmarkScreen();
  const filteredBookmarks = useMemo(() => {
    if (!searchQuery.trim()) return bookmarks;
    const query = searchQuery.toLowerCase();
    return bookmarks.filter(
      (item) =>
        item.surahName.toLowerCase().includes(query) ||
        item.ayahText?.toLowerCase().includes(query),
    );
  }, [bookmarks, searchQuery]);
  const filteredCollections = useMemo(() => {
    if (!searchQuery.trim())
      return { pinned: pinnedCollections, unpinned: unpinnedCollections };
    const query = searchQuery.toLowerCase();
    const filterFn = (c: any) => c.name.toLowerCase().includes(query);
    return {
      pinned: pinnedCollections.filter(filterFn),
      unpinned: unpinnedCollections.filter(filterFn),
    };
  }, [pinnedCollections, unpinnedCollections, searchQuery]);

  const { handleCollectionLongPress } = useCollectionManagement();

  const openCreateCollectionModal = () => {
    setCollectionName("");
    setIsCreateModalVisible(true);
  };

  const closeCreateCollectionModal = () => {
    setIsCreateModalVisible(false);
    setCollectionName("");
  };

  const handleCreateCollection = () => {
    const name = collectionName.trim();

    if (!name) {
      Alert.alert(t("Create Collection"), t("Collection name cannot be empty"));
      return;
    }

    createCollection(name);
    Alert.alert(
      t("Success"),
      `${t("Collection")} "${name}" ${t("created!")}`,
    );
    closeCreateCollectionModal();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.BACKGROUND}
        translucent={false}
      />

      <Header title={t("Bookmarks")} />
      <BookmarkSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery("")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <AddCollectionCard onPress={openCreateCollectionModal} />

        {filteredBookmarks.length > 0 && (
          <View>
            <BookmarkSectionHeader title={t("Bookmarked Ayahs")} />
            {filteredBookmarks.map((item) => (
              <BookmarkItem
                key={`${item.surahId}-${item.nomorAyat}`}
                item={item}
                onPress={handleBookmarkPress}
                onRemove={handleRemoveBookmark}
              />
            ))}
          </View>
        )}

        {filteredCollections.pinned.length > 0 && (
          <View>
            <BookmarkSectionHeader title={t("Pinned Collections")} />
            {filteredCollections.pinned.map((item) => (
              <CollectionItem
                key={item.id}
                item={item}
                onPress={handleCollectionPress}
                onLongPress={handleCollectionLongPress}
              />
            ))}
          </View>
        )}

        {filteredCollections.unpinned.length > 0 && (
          <View>
            <BookmarkSectionHeader title={t("Collections")} />
            {filteredCollections.unpinned.map((item) => (
              <CollectionItem
                key={item.id}
                item={item}
                onPress={handleCollectionPress}
                onLongPress={handleCollectionLongPress}
              />
            ))}
          </View>
        )}

        {!hasAnyContent && (
          <EmptyBookmarkState onCreateCollection={openCreateCollectionModal} />
        )}
      </ScrollView>

      <Modal
        transparent
        animationType="fade"
        visible={isCreateModalVisible}
        onRequestClose={closeCreateCollectionModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t("Create Collection")}</Text>
            <Text style={styles.modalSubtitle}>{t("Enter folder name:")}</Text>
            <TextInput
              value={collectionName}
              onChangeText={setCollectionName}
              placeholder={t("Enter folder name:")}
              placeholderTextColor={COLORS.SECONDARY}
              style={styles.modalInput}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleCreateCollection}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={closeCreateCollectionModal}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalButtonText, { color: COLORS.TEXT }]}>
                  {t("Cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalCreateButton]}
                onPress={handleCreateCollection}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalButtonText, { color: COLORS.TEXT }]}>
                  {t("Create")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomTabBar active="bookmark" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  modalTitle: {
    color: COLORS.TEXT,
    fontSize: 20,
    fontWeight: "bold",
  },
  modalSubtitle: {
    color: COLORS.SECONDARY,
    marginTop: 8,
    marginBottom: 14,
    fontSize: 14,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.TEXT,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalCancelButton: {
    backgroundColor: "#1B2347",
  },
  modalCreateButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
});

export default BookmarkScreen;
