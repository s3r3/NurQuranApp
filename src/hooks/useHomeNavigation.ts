import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { LastRead } from "../types/quran.types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useHomeNavigation = () => {
  const navigation = useNavigation<NavigationProp>();

  const navigateToSurahDetail = (surahId: number, nomorAyat?: number) => {
    navigation.navigate("SurahDetail", {
      surahId,
      nomorAyat: nomorAyat || 1,
    });
  };

  const navigateToLastRead = (lastRead: LastRead | null) => {
    if (lastRead) {
      if (lastRead.source === "juz" && lastRead.juzId) {
        navigation.navigate("JuzDetail", {
          juzId: lastRead.juzId,
          surahId: lastRead.surahId,
          nomorAyat: lastRead.nomorAyat,
        });
        return;
      }

      navigation.navigate("SurahDetail", {
        surahId: lastRead.surahId,
        nomorAyat: lastRead.nomorAyat,
      });
    }
  };

  const navigateToSearch = () => {
    navigation.navigate("Search");
  };

  

  return {
    navigateToSurahDetail,
    navigateToLastRead,
    navigateToSearch,
    
  };
};
