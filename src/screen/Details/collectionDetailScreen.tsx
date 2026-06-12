import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import BottomTabBar from "../../components/MainTabNavigator";
import {
  CollectionHeader,
  CollectionInfo,
  CollectionAyahItem,
  CollectionEmptyState,
} from "../../components/collection";
import { useCollectionDetail } from "../../hooks/useCollectionDetail";
import { CollectionDetailRouteParams, AyahItemCollection } from "../../types/quran.types";
import { getItemKey } from "../../utils/collectionHelpers";
import { COLORS } from "../../constants/colors";
import { useTranslation } from "react-i18next";

const CollectionDetailScreen = () => {
  const route = useRoute();
  const { t } = useTranslation();
  const { collectionId, collectionName } = route.params as CollectionDetailRouteParams;

  const {
    collection,
    items,
    itemCount,
    isEmpty,
    isPinned,
    handleRemoveAyah,
    handleShare,
    handleNavigateToSurah,
    handleDeleteCollection,
    handleTogglePin,
    goBack,
  } = useCollectionDetail(collectionId);

  // If collection doesn't exist
  if (!collection) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{t("collectionNotFound")}</Text>
        </View>
        <BottomTabBar active="bookmark" />
      </SafeAreaView>
    );
  }

  const renderAyahItem = ({ item }: { item: AyahItemCollection }) => (
    <CollectionAyahItem
      item={item}
      onPress={handleNavigateToSurah}
      onShare={handleShare}
      onRemove={handleRemoveAyah}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.BACKGROUND}
        translucent={false}
      />

      <CollectionHeader
        collectionName={collection.name}
        isPinned={isPinned}
        onBack={goBack}
        onTogglePin={handleTogglePin}
        onDelete={handleDeleteCollection}
      />

      <CollectionInfo itemCount={itemCount} />

      {!isEmpty ? (
        <FlatList
          data={items}
          keyExtractor={getItemKey}
          renderItem={renderAyahItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      ) : (
        <CollectionEmptyState />
      )}

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
  listContent: {
    paddingBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: COLORS.TEXT,
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});

export default CollectionDetailScreen;