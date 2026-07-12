import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Share,
  Alert,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { ArrowLeft, Search } from "lucide-react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../../store/useAppStore";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { COLORS } from "../../constants/colors";
import { useJuzDetail } from "../../hooks/useJuzDetail";
import { useSurahDetail } from "../../hooks/useSurahDetail";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { useFullSurahPlayer } from "../../hooks/useFullSurahPlayer";
import { AyatItem } from "../../components/AyatItemJuz";
import { LoadingState } from "../../components/LoadingState";
import { ErrorState } from "../../components/ErrorState";
import { BannerCard } from "../../components/BannerCard";
import { FullSurahMiniPlayer } from "../../components/surah/FullSurahMiniPlayer";
import { Surah } from "../../types/quran.types";

const JuzDetail = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "JuzDetail">>();
  const { juzId, surahId, nomorAyat } = route.params;
  const flatListRef = useRef<FlatList<any> | null>(null);
  const language = i18n.language?.includes("id") ? "id" : "en";
  const [collectionPickerVisible, setCollectionPickerVisible] = React.useState(false);
  const [pendingAyat, setPendingAyat] = React.useState<any | null>(null);
  const [activeSurahId, setActiveSurahId] = React.useState<number | null>(null);
  
  const {
    collections,
    addBookmark,
    removeBookmark,
    isBookmarked,
    setLastRead,
    addAyatToCollection,
  } = useAppStore();
  const { data: juz, isLoading, isError, error, refetch } = useJuzDetail(juzId, language);
  const { data: activeSurah } = useSurahDetail(activeSurahId ?? 0, language);
  const {
    playAudio,
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

  const emptySurah: Surah = {
    namaLatin: "",
    arti: "",
    tempatTurun: "",
    jumlahAyat: 0,
    nama: "",
    ayat: [],
  };

  const { playFullSurah, skipToNext, skipToPrevious } = useFullSurahPlayer({
    surah: activeSurah || emptySurah,
    soundRef,
    selectedQari,
    isPlayingFullSurahRef,
    setIsPlayingFullSurah,
    currentPlayingIndex,
    setCurrentPlayingIndex,
    setIsLoadingAudio,
    flatListRef,
    onAyahPlay: (ayahNumber) => {
      if (!activeSurah) return;

      setLastRead({
        source: "surah",
        surahId: activeSurah.nomor || activeSurahId || 1,
        surahName: activeSurah.nama || "",
        nomorAyat: ayahNumber,
        namaLatin: activeSurah.namaLatin || "",
      });
    },
  });

  const onShare = async (item: any) => {
    try {
      const translation = language === "en"
        ? item.textEnglish || item.textIndonesian
        : item.textIndonesian;
      await Share.share({
        message: `${item.text}\n\n${translation}\n\n${t("From")} ${item.surah?.englishName || t("Surah")} - ${t("Juz")} ${juzId}`,
      });
    } catch (_e) {
      // silent
    }
  };

  const toggleBookmark = (item: any) => {
    const surahNumber = item.surah?.number || 1;
    if (isBookmarked(surahNumber, item.numberInSurah)) {
      removeBookmark(surahNumber, item.numberInSurah);
    } else {
      addBookmark({
        surahId: surahNumber,
        nomorAyat: item.numberInSurah,
        surahName: item.surah?.englishName || t("Surah"),
        ayahText: item.text,
      });
      Alert.alert(t("Success"), t("Ayah added to bookmarks"));
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
        surahId: pendingAyat.surah?.number || 1,
        nomorAyat: pendingAyat.numberInSurah,
        surahName: pendingAyat.surah?.englishName || t("Surah"),
        ayahText: pendingAyat.text,
      });
      Alert.alert(t("Saved"), t("Ayah saved to") + ` ${collectionName}`);
      closeCollectionPicker();
    },
    [addAyatToCollection, closeCollectionPicker, pendingAyat, t],
  );

  const onBookmarkLongPress = (item: any) => {
    setPendingAyat(item);
    setCollectionPickerVisible(true);
  };

  const renderAyatItem = ({ item }: { item: any }) => (
    <AyatItem
      item={item}
      juzId={juzId}
      language={language}
      isBookmarked={isBookmarked(item.surah?.number || 1, item.numberInSurah)}
      isPlaying={playingAyat === item.number}
      onShare={() => onShare(item)}
      onPlay={() => {
        setLastRead({
          source: "juz",
          juzId,
          surahId: item.surah?.number || 1,
          surahName: item.surah?.englishName || t("Surah"),
          nomorAyat: item.numberInSurah,
          namaLatin: item.surah?.englishName || t("Surah"),
        });
        playAudio(item.number);
      }}
      onBookmark={() => toggleBookmark(item)}
      onBookmarkLongPress={() => onBookmarkLongPress(item)}
    />
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0 && juz) {
        const firstVisibleAyat = viewableItems[0].item;
        const firstVisibleSurahId = firstVisibleAyat.surah?.number || null;
        if (firstVisibleSurahId && !isPlayingFullSurah) {
          setActiveSurahId(firstVisibleSurahId);
        }
        setLastRead({
          source: "juz",
          juzId,
          surahId: firstVisibleAyat.surah?.number || 1,
          surahName: firstVisibleAyat.surah?.englishName || t("Surah"),
          nomorAyat: firstVisibleAyat.numberInSurah,
          namaLatin: firstVisibleAyat.surah?.englishName || t("Surah"),
        });
      }
    },
    [juz, juzId, setLastRead, t, isPlayingFullSurah],
  );

  useEffect(() => {
    if (!activeSurahId && juz?.ayahs?.length) {
      setActiveSurahId(juz.ayahs[0]?.surah?.number || null);
    }
  }, [activeSurahId, juz?.ayahs]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      void stopAllPlayback();
    });

    return unsubscribe;
  }, [navigation, stopAllPlayback]);

  const handleToggleFullSurah = useCallback(async () => {
    if (!isPlayingFullSurah) {
      await playFullSurah();
      return;
    }

    await stopPlayback();
  }, [isPlayingFullSurah, playFullSurah, stopPlayback]);

  const jumpToPlayingAyah = useCallback(() => {
    if (!isPlayingFullSurah || !juz?.ayahs?.length || !activeSurahId) return;

    const currentAyahNumber =
      activeSurah?.ayat?.[currentPlayingIndex]?.nomorAyat || playingAyat;

    if (!currentAyahNumber) return;

    const targetIndex = juz.ayahs.findIndex(
      (ayah: any) =>
        ayah.surah?.number === activeSurahId &&
        ayah.numberInSurah === currentAyahNumber,
    );

    if (targetIndex === -1) return;

    flatListRef.current?.scrollToIndex({
      index: targetIndex,
      animated: true,
      viewPosition: 0.28,
    });
  }, [activeSurah?.ayat, activeSurahId, currentPlayingIndex, isPlayingFullSurah, juz?.ayahs, playingAyat]);

  useEffect(() => {
    if (!juz || !surahId || !nomorAyat) return;

    const targetIndex = juz.ayahs.findIndex(
      (ayah: any) =>
        ayah.surah?.number === surahId && ayah.numberInSurah === nomorAyat,
    );

    if (targetIndex === -1 || !flatListRef.current) return;

    const timer = setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: targetIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [juz, surahId, nomorAyat]);

  const renderContent = () => {
    if (isLoading) return <LoadingState juzId={juzId} />;
    if (isError) return <ErrorState error={error as Error} onRetry={refetch} juzId={juzId} />;
    if (!juz || !juz.ayahs || juz.ayahs.length === 0) {
      return <ErrorState error={new Error(`No ayahs data for Juz ${juzId}`)} onRetry={refetch} juzId={juzId} />;
    }

    return (
      <>
        {activeSurah && (
          <TouchableOpacity
            style={styles.playSurahCard}
            onPress={handleToggleFullSurah}
            activeOpacity={0.88}
          >
            <View style={styles.playSurahTextWrap}>
              <Text style={styles.playSurahLabel}>{t("Full Surah Player")}</Text>
              <Text style={styles.playSurahTitle} numberOfLines={1}>
                {activeSurah.namaLatin}
              </Text>
              <Text style={styles.playSurahMeaning} numberOfLines={1}>
                {activeSurah.arti}
              </Text>
            </View>

            <View style={styles.playSurahButton}>
              <Text style={styles.playSurahButtonText}>
                {isPlayingFullSurah ? t("Stop Playback") : t("Play Full Surah")}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <FlatList
          ref={flatListRef}
          data={juz.ayahs}
          keyExtractor={(item, index) => `${juzId}-${index}`}
          renderItem={renderAyatItem}
          initialNumToRender={10}
          ListHeaderComponent={<BannerCard juzId={juzId} />}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 30 }}
          onScrollToIndexFailed={(info) => {
            flatListRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: true,
            });
          }}
          contentContainerStyle={styles.listContent}
        />

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
                        <Text style={styles.collectionPillText}>{t("Save")}</Text>
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

        {isPlayingFullSurah && activeSurah && (
          <View style={styles.miniPlayerDock}>
            <FullSurahMiniPlayer
              surahName={activeSurah.namaLatin}
              surahMeaning={activeSurah.arti}
              currentIndex={currentPlayingIndex}
              totalAyahs={activeSurah.jumlahAyat}
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
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={COLORS.SECONDARY} size={28} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>
          {t("Juz")} {juzId}
        </Text>
        <Search color={COLORS.SECONDARY} size={28} />
      </View>
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  navHeader: {
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  navTitle: {
    color: COLORS.TEXT,
    fontSize: 20,
    fontWeight: "bold",
  },
  listContent: {
    paddingBottom: 220,
  },
  playSurahCard: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 12,
    padding: 16,
    borderRadius: 22,
    backgroundColor: "rgba(10, 20, 48, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  playSurahTextWrap: {
    flex: 1,
  },
  playSurahLabel: {
    color: COLORS.SECONDARY,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  playSurahTitle: {
    color: COLORS.TEXT,
    fontSize: 18,
    fontWeight: "800",
  },
  playSurahMeaning: {
    color: COLORS.TEXT,
    opacity: 0.84,
    fontSize: 13,
    marginTop: 4,
  },
  playSurahButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS.PRIMARY,
  },
  playSurahButtonText: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: "800",
  },
  miniPlayerDock: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
    paddingBottom: 14,
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

export default JuzDetail;
