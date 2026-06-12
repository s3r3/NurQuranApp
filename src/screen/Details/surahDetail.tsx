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

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SurahDetail = () => {
  const route = useRoute<any>();
  const { surahId, nomorAyat } = route.params;
  const flatListRef = useRef<FlatList<any> | null>(null);
  const { t, i18n } = useTranslation();
  const language = i18n.language?.includes("id") ? "id" : "en";

  const navigation = useNavigation<NavigationProp>();
  const { data: surah, isLoading } = useSurahDetail(surahId, language);

  const {
    addBookmark,
    removeBookmark,
    isBookmarked,
    setLastRead,
    collections,
    addAyatToCollection,
    createCollection,
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

  const onBookmarkLongPress = (item: any) => {
    const currentCollections = useAppStore.getState().collections;
    const options: any[] = currentCollections.map((c) => ({
      text: c.name,
      onPress: () => {
        addAyatToCollection(c.id, {
          surahId,
          nomorAyat: item.nomorAyat,
          surahName: surah?.namaLatin || "",
          ayahText: item.teksArab,
        });
        Alert.alert(t("Saved"), t("Ayah saved to") + ` ${c.name}`);
      },
    }));

    options.push({
      text: t("+ Create New Collection"),
      onPress: () => {
        const collectionName =
          Platform.OS === "ios"
            ? undefined
            : t("Collection") + ` ${collections.length + 1}`;

        if (Platform.OS === "ios") {
          Alert.prompt(t("New Collection"), t("Enter folder name:"), (name) => {
            if (name) {
              const newId = createCollection(name);
              addAyatToCollection(newId, {
                surahId,
                nomorAyat: item.nomorAyat,
                surahName: surah?.namaLatin || "",
                ayahText: item.teksArab,
              });
            }
          });
        } else if (collectionName) {
          const newId = createCollection(collectionName);
          addAyatToCollection(newId, {
            surahId,
            nomorAyat: item.nomorAyat,
            surahName: surah?.namaLatin || "",
            ayahText: item.teksArab,
          });
          Alert.alert(t("Success"), t("Ayah saved to") + ` ${collectionName}`);
        }
      },
    });

    options.push({ text: t("Cancel"), onPress: () => {} });
    Alert.alert(t("Save to Collection"), t("Choose storage folder:"), options);
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0 && surah && !isPlayingFullSurah) {
        const firstVisibleAyat = viewableItems[0].item;
        setLastRead({
          surahId,
          surahName: surah.nama || "",
          nomorAyat: firstVisibleAyat.nomorAyat,
          namaLatin: surah.namaLatin || "",
        });
      }
    },
    [surahId, surah, setLastRead, isPlayingFullSurah],
  );

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
              currentPlayingIndex={currentPlayingIndex}
              playingAyat={playingAyat}
              onSkipPrevious={skipToPrevious}
              onSkipNext={skipToNext}
              totalAyahs={surah.jumlahAyat}
            />
          ) : null
        }
        contentContainerStyle={styles.listContent}
      />
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
    paddingBottom: 40,
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
});

export default SurahDetail;
