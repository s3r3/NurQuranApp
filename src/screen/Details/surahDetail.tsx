import React, { useRef, useCallback, useEffect } from "react";
import {
  View,
  Share,
  Alert,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { ArrowLeft, Search } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../../store/useAppStore";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { COLORS } from "../../constants/colors";
import { useSurahDetail } from "../../hooks/useSurahDetail";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { useFullSurahPlayer } from "../../hooks/useFullSurahPlayer";
import { SurahHeader } from "../../components/surah/SurahHeader";
import { AyatItem } from "../../components/surah/AyatItemSurah";
import { FullSurahMiniPlayer } from "../../components/surah/FullSurahMiniPlayer";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SurahDetail = () => {
  const route = useRoute<any>();
  const { surahId, nomorAyat } = route.params;
  const flatListRef = useRef<FlatList<any> | null>(null);
  const { t, i18n } = useTranslation();
  const language = i18n.language?.includes("id") ? "id" : "en";
  const [collectionPickerVisible, setCollectionPickerVisible] = React.useState(false);
  const [pendingAyat, setPendingAyat] = React.useState<any | null>(null);

  const navigation = useNavigation<NavigationProp>();
  const { data: surah, isLoading } = useSurahDetail(surahId, language);

  const {
    addBookmark,
    removeBookmark,
    isBookmarked,
    setLastRead,
    collections,
    addAyatToCollection,
  } = useAppStore();

  const {
    playingAyat,
    isPlayingFullSurah,
    currentPlayingIndex,
    isLoadingAudio,
    selectedQari,
    setSelectedQari,
    playSingleAyah,
    stopPlayback,
    stopAllPlayback,
    setIsPlayingFullSurah,
    isPlayingFullSurahRef,
    setCurrentPlayingIndex,
    setIsLoadingAudio,
    soundRef,
  } = useAudioPlayer();

  const { playFullSurah, skipToNext, skipToPrevious } = useFullSurahPlayer({
    surah: surah!,
    soundRef,
    selectedQari,
    isPlayingFullSurahRef,
    setIsPlayingFullSurah,
    currentPlayingIndex,
    setCurrentPlayingIndex,
    setIsLoadingAudio,
    flatListRef,
    onAyahPlay: (ayahNumber) => {
      if (surah) {
        setLastRead({
          source: "surah",
          surahId,
          surahName: surah.nama || "",
          nomorAyat: ayahNumber,
          namaLatin: surah.namaLatin || "",
        });
      }
    },
  });

  // Scroll to specific ayah
  useEffect(() => {
    if (surah && nomorAyat) {
      const ayatIndex = surah.ayat.findIndex(
        (ayat: any) => ayat.nomorAyat === nomorAyat,
      );
      if (ayatIndex !== -1 && flatListRef.current) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: ayatIndex,
            animated: true,
            viewPosition: 0.5,
          });
        }, 300);
      }
    }
  }, [surah, nomorAyat]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      void stopAllPlayback();
    });

    return unsubscribe;
  }, [navigation, stopAllPlayback]);
  console.log(
    "LANGUAGE:",
    language,
    "I18N:",
    i18n.language
  );

  const handleShare = async (item: any) => {
    try {
      const translation =
        language === "en"
          ? item.teksInggris || item.teksIndonesia
          : item.teksIndonesia;
      await Share.share({
        message: `${item.teksArab}\n\n${translation}\n\n${t("From")} ${t("Surah")} ${surah?.namaLatin} (${item.nomorAyat})`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const toggleBookmark = (item: any) => {
    if (isBookmarked(surahId, item.nomorAyat)) {
      removeBookmark(surahId, item.nomorAyat);
    } else {
      addBookmark({
        surahId,
        nomorAyat: item.nomorAyat,
        surahName: surah?.namaLatin || "",
        ayahText: item.teksArab,
      });
    }
  };

  const closeCollectionPicker = useCallback(() => {
    setCollectionPickerVisible(false);
    setPendingAyat(null);
  }, []);

  const saveAyahToCollection = useCallback(
    (collectionId: string, collectionName: string) => {
      if (!pendingAyat) return;

      addAyatToCollection(collectionId, {
        surahId,
        nomorAyat: pendingAyat.nomorAyat,
        surahName: surah?.namaLatin || "",
        ayahText: pendingAyat.teksArab,
      });
      Alert.alert(t("Saved"), t("Ayah saved to") + ` ${collectionName}`);
      closeCollectionPicker();
    },
    [addAyatToCollection, closeCollectionPicker, pendingAyat, surah?.namaLatin, surahId, t],
  );

  const onBookmarkLongPress = (item: any) => {
    setPendingAyat(item);
    setCollectionPickerVisible(true);
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0 && surah && !isPlayingFullSurah) {
        const firstVisibleAyat = viewableItems[0].item;
        setLastRead({
          source: "surah",
          surahId,
          surahName: surah.nama || "",
          nomorAyat: firstVisibleAyat.nomorAyat,
          namaLatin: surah.namaLatin || "",
        });
      }
    },
    [surahId, surah, setLastRead, isPlayingFullSurah],
  );

  const jumpToPlayingAyah = useCallback(() => {
    if (!surah?.ayat?.length || !isPlayingFullSurah) return;

    const targetIndex = Math.min(
      Math.max(currentPlayingIndex, 0),
      surah.ayat.length - 1,
    );

    flatListRef.current?.scrollToIndex({
      index: targetIndex,
      animated: true,
      viewPosition: 0.28,
    });
  }, [currentPlayingIndex, isPlayingFullSurah, surah?.ayat?.length]);

  const handleToggleFullSurah = useCallback(async () => {
    if (!isPlayingFullSurah) {
      await playFullSurah();
      return;
    }

    await stopPlayback();
  }, [isPlayingFullSurah, playFullSurah, stopPlayback]);

  const renderAyatItem = ({ item, index }: { item: any; index: number }) => (
    <AyatItem
      item={item}
      index={index}
      language={language}
      isBookmarked={isBookmarked(surahId, item.nomorAyat)}
      isPlaying={playingAyat === item.nomorAyat}
      isLoadingAudio={isLoadingAudio}
      onShare={() => handleShare(item)}
      onPlay={() =>
        playSingleAyah(item.audio, item.nomorAyat, () => {
          setLastRead({
            source: "surah",
            surahId,
            surahName: surah?.nama || "",
            nomorAyat: item.nomorAyat,
            namaLatin: surah?.namaLatin || "",
          });
        })
      }
      onBookmark={() => toggleBookmark(item)}
      onBookmarkLongPress={() => onBookmarkLongPress(item)}
    />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.BACKGROUND}
        />
        <View style={styles.navHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color={COLORS.SECONDARY} size={28} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>{t("Loading")}...</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <Search color={COLORS.SECONDARY} size={28} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>{t("Loading Ayahs")}...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.BACKGROUND}
        translucent={false}
      />

      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={COLORS.SECONDARY} size={28} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>{surah?.namaLatin || ""}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Search color={COLORS.SECONDARY} size={28} />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={surah?.ayat}
        keyExtractor={(item) => item.nomorAyat.toString()}
        renderItem={renderAyatItem}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 30 }}
        scrollEventThrottle={16}
        onScrollToIndexFailed={(info) => {
          flatListRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
        }}
        ListHeaderComponent={
          surah ? (
            <SurahHeader
              surah={surah}
              selectedQari={selectedQari}
              onQariChange={setSelectedQari}
              isPlayingFullSurah={isPlayingFullSurah}
              isLoadingAudio={isLoadingAudio}
              onPlayFullSurah={playFullSurah}
            />
          ) : null
        }
        contentContainerStyle={styles.listContent}
      />

      {isPlayingFullSurah && surah && (
        <View style={styles.miniPlayerDock}>
          <FullSurahMiniPlayer
            surahName={surah.namaLatin}
            surahMeaning={surah.arti}
            currentIndex={currentPlayingIndex}
            totalAyahs={surah.jumlahAyat}
            playingAyat={playingAyat}
            isPlaying={isPlayingFullSurah}
            isLoading={isLoadingAudio}
            onPlayPause={handleToggleFullSurah}
            onPrevious={skipToPrevious}
            onNext={skipToNext}
            onPressCard={jumpToPlayingAyah}
          />
        </View>
      )}

      <Modal
        transparent
        animationType="fade"
        visible={collectionPickerVisible}
        onRequestClose={closeCollectionPicker}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeCollectionPicker}>
          <View style={styles.collectionSheet} onStartShouldSetResponder={() => true}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetTitleWrap}>
                <Text style={styles.sheetTitle}>{t("Save to Collection")}</Text>
                <Text style={styles.sheetSubtitle}>
                  {t("Choose storage folder:")}
                </Text>
              </View>

              <TouchableOpacity
                onPress={closeCollectionPicker}
                style={styles.closeButton}
                activeOpacity={0.8}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.collectionList}
            >
              {collections.length > 0 ? (
                collections.map((collection) => (
                  <TouchableOpacity
                    key={collection.id}
                    style={styles.collectionRow}
                    onPress={() =>
                      saveAyahToCollection(collection.id, collection.name)
                    }
                    activeOpacity={0.85}
                  >
                    <View style={styles.collectionRowText}>
                      <Text style={styles.collectionName}>{collection.name}</Text>
                      <Text style={styles.collectionMeta}>
                        {collection.items?.length || 0} {t("items")}
                      </Text>
                    </View>
                    <View style={styles.collectionPill}>
                      <Text style={styles.collectionPillText}>
                        {t("Save")}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>
                    {t("No bookmarks or collections yet")}
                  </Text>
                  <Text style={styles.emptySubtitle}>
                    {t("You can close this popup and create a collection from the Bookmark page.")}
                  </Text>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.cancelSheetButton}
              onPress={closeCollectionPicker}
              activeOpacity={0.85}
            >
              <Text style={styles.cancelSheetButtonText}>{t("Cancel")}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  navTitle: {
    color: COLORS.TEXT,
    fontSize: 20,
    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: 180,
  },
  miniPlayerDock: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: COLORS.TEXT,
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(3, 7, 18, 0.72)",
    justifyContent: "flex-end",
  },
  collectionSheet: {
    backgroundColor: "#101A3A",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 24,
    minHeight: "44%",
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },
  sheetTitleWrap: {
    flex: 1,
  },
  sheetTitle: {
    color: COLORS.TEXT,
    fontSize: 20,
    fontWeight: "800",
  },
  sheetSubtitle: {
    color: COLORS.SECONDARY,
    marginTop: 4,
    fontSize: 13,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: COLORS.TEXT,
    fontSize: 24,
    lineHeight: 24,
    marginTop: -2,
  },
  collectionList: {
    paddingBottom: 12,
    gap: 10,
  },
  collectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  collectionRowText: {
    flex: 1,
    paddingRight: 12,
  },
  collectionName: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: "700",
  },
  collectionMeta: {
    color: COLORS.SECONDARY,
    marginTop: 4,
    fontSize: 12,
  },
  collectionPill: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  collectionPillText: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: "700",
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyTitle: {
    color: COLORS.TEXT,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  emptySubtitle: {
    color: COLORS.SECONDARY,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
  },
  cancelSheetButton: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 4,
  },
  cancelSheetButtonText: {
    color: COLORS.TEXT,
    fontSize: 15,
    fontWeight: "700",
  },
});

export default SurahDetail;
