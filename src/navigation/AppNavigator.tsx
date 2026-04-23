import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screen/homeScreen";
import qiblatScreen from "../screen/qiblatScreen";
import prayerTimeScreen from "../screen/prayerTimeScreen";
import fastingScreen from "../screen/fastingScreen";
import tasbihScreen from "../screen/tasbihScreen";
import BookmarkScreen from "../screen/bookmarkScreen";
import CollectionDetailScreen from "../screen/component/collectionDetailScreen";
import SurahDetail from "../screen/component/surahDetail";
import JuzDetail from "../screen/component/juzDetail";
import SearchScreen from "../screen/searchScreen";

export type RootStackParamList = {
  HomeScreen: undefined;
  QiblatScreen: undefined;
  PrayerTimesScreen: undefined;
  FastingScreen: undefined;
  TasbihScreen: undefined;
  BookmarkScreen: undefined;
  CollectionDetail: { collectionId: string; collectionName: string };
  SurahDetail: { surahId: number; nomorAyat?: number };
  JuzDetail: { juzId: number };
  Search: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="QiblatScreen" component={qiblatScreen} />
      <Stack.Screen name="PrayerTimesScreen" component={prayerTimeScreen} />
      <Stack.Screen name="FastingScreen" component={fastingScreen} />
      <Stack.Screen name="TasbihScreen" component={tasbihScreen} />
      <Stack.Screen name="BookmarkScreen" component={BookmarkScreen} />
      <Stack.Screen
        name="CollectionDetail"
        component={CollectionDetailScreen}
      />
      <Stack.Screen name="SurahDetail" component={SurahDetail} />
      <Stack.Screen name="JuzDetail" component={JuzDetail} />
      <Stack.Screen name="Search" component={SearchScreen} />
    </Stack.Navigator>
  );
}
