import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screen/homeScreen";
import PrayerTimeScreen from "../screen/prayerTimeScreen";
import FastingScreen from "../screen/FastingScreen";
import BookmarkScreen from "../screen/bookmarkScreen";
import CollectionDetailScreen from "../screen/Details/collectionDetailScreen";
import SurahDetail from "../screen/Details/surahDetail";
import JuzDetail from "../screen/Details/juzDetail";
import SearchScreen from "../screen/searchScreen";

// Constants
const SCREEN_OPTIONS = { headerShown: false };

// Types
export type RootStackParamList = {
  HomeScreen: undefined;

  PrayerTimesScreen: undefined;
  FastingScreen: undefined;
  TasbihScreen: undefined;
  BookmarkScreen: undefined;
  CollectionDetail: { collectionId: string; collectionName: string };
  SurahDetail: { surahId: number; nomorAyat?: number };
  JuzDetail: { juzId: number; surahId?: number; nomorAyat?: number };
  Search: undefined;
};

// Screen configuration
const SCREENS: Array<{
  name: keyof RootStackParamList;
  component: React.ComponentType<any>;
}> = [
  { name: "HomeScreen", component: HomeScreen },
  { name: "PrayerTimesScreen", component: PrayerTimeScreen },
  { name: "FastingScreen", component: FastingScreen },
  { name: "BookmarkScreen", component: BookmarkScreen },
  { name: "CollectionDetail", component: CollectionDetailScreen },
  { name: "SurahDetail", component: SurahDetail },
  { name: "JuzDetail", component: JuzDetail },
  { name: "Search", component: SearchScreen },
];

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
      {SCREENS.map(({ name, component }) => (
        <Stack.Screen key={name} name={name} component={component} />
      ))}
    </Stack.Navigator>
  );
}
