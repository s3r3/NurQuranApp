import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Svg, {
  Path,
  G,
  Defs,
  RadialGradient,
  Stop,
  Rect,
} from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator"; // Sesuaikan path navigasimu
import { StarSVG, CloudSVG, QuranSVG } from "../../assets/svg";
import { useAppStore } from "../store/useAppStore";
const { width, height } = Dimensions.get("window");


// Membuat bayangan elips di bawah Quran menggunakan SVG Gradient
const QuranShadowSVG = () => (
  <Svg width="220" height="40" viewBox="0 0 220 40">
    <Defs>
      <RadialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <Stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
        <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </RadialGradient>
    </Defs>
    <Rect width="220" height="40" fill="url(#grad)" rx="20" ry="20" />
  </Svg>
);

// --- KOMPONEN UTAMA ---

type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "HomeScreen"
>;

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);

  // Shared Values untuk Animasi
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);

  const cardScale = useSharedValue(0.9);
  const cardOpacity = useSharedValue(0);

  const quranFloating = useSharedValue(0);
  const shadowScale = useSharedValue(1);

  const buttonScale = useSharedValue(1);

  useEffect(() => {
    // 1. Animasi Teks Atas (Fade In + Slide Up)
    textOpacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.quad),
    });
    textTranslateY.value = withTiming(0, {
      duration: 1000,
      easing: Easing.out(Easing.quad),
    });

    // 2. Animasi Kartu Ungu Muncul (Fade In + Scale Up)
    cardOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));
    cardScale.value = withDelay(
      500,
      withTiming(1, { duration: 800, easing: Easing.back(1) }),
    );

    // 3. Animasi Quran Mengambang (Looping)
    quranFloating.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );

    // 4. Animasi Bayangan Mengecil saat Quran naik (Looping)
    shadowScale.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
  }, []);

  // Animated Styles
  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const animatedCardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  const animatedQuranStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: quranFloating.value }],
  }));

  const animatedShadowStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: shadowScale.value }],
    opacity: shadowScale.value, // Sedikit memudar saat mengecil
  }));

  // Animasi Tombol saat di-tap
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100 });
  };

  const handleGetStarted = () => {
    completeOnboarding(); 
    navigation.navigate("HomeScreen");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Bagian Teks Atas */}
      <Animated.View style={[styles.textHeader, animatedTextStyle]}>
        <Text style={styles.title}>Nur Quran</Text>
        <Text style={styles.subtitle}>
          {"Learn Quran and\nRecite once everyday"}
        </Text>
      </Animated.View>

      {/* Bagian Kartu Ungu Utama */}
      <Animated.View style={[styles.mainCard, animatedCardStyle]}>
        {/* Dekorasi Latar Belakang (Bintang & Awan) - Posisikan Absolut */}
        <View style={styles.star1}>
          <StarSVG />
        </View>
        <View style={styles.star2}>
          <StarSVG />
        </View>
        <View style={styles.star3}>
          <StarSVG />
        </View>
        <View style={styles.cloud1}>
          <CloudSVG />
        </View>
        <View style={styles.cloud2}>
          <CloudSVG />
        </View>

        {/* Quran dan Bayangannya */}
        <View style={styles.quranContainer}>
          {/* Bayangan di bawah */}
          <Animated.View style={[styles.quranShadow, animatedShadowStyle]}>
            <QuranShadowSVG />
          </Animated.View>

          {/* Al Quran yang mengambang */}
          <Animated.View style={animatedQuranStyle}>
            <QuranSVG />
          </Animated.View>
        </View>

        {/* Tombol Get Started */}
        <Animated.View style={[styles.buttonWrapper, animatedButtonStyle]}>
          <TouchableOpacity
            style={styles.button}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleGetStarted}
            activeOpacity={1} // Matikan default opacity change, kita pakai scale
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1535", // Warna background biru gelap sesuai gambar
    alignItems: "center",
    justifyContent: "space-between", // Sebar konten atas dan bawah
    paddingTop: 80,
    paddingBottom: 40,
  },
  textHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    fontFamily: "System", // Gunakan font custom jika ada
  },
  subtitle: {
    fontSize: 16,
    color: "#8D92A3", // Warna teks abu-abu kebiruan
    textAlign: "center",
    lineHeight: 24,
    fontFamily: "System",
  },
  mainCard: {
    width: width * 0.9, // 90% lebar layar
    height: height * 0.6, // 60% tinggi layar
    backgroundColor: "#6236CC", // Warna ungu kartu
    borderRadius: 32,
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-end", // Elemen utama di kartu mepet bawah
    overflow: "hidden", // Agar awan terpotong rapi di pinggir
    position: "relative",
    top :-60
  },
  // Posisi dekorasi SVG
  star1: { position: "absolute", top: 40, left: 30, opacity: 0.8 },
  star2: { position: "absolute", top: 100, left: 130 },
  star3: { position: "absolute", top: 200, right: 30, opacity: 0.6 },
  cloud1: { position: "absolute", top: 80, left: -20 },
  cloud2: {
    position: "absolute",
    top: 150,
    right: -10,
    transform: [{ scale: 1.2 }],
  },

  quranContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40, // Jarak ke tombol
    position: "relative",
    width: "100%",
    height: 180, // Tentukan tinggi kontainer agar bayangan tidak lari
  },
  quranShadow: {
    position: "absolute",
    bottom: -15, // Posisikan di bawah sedikit
    zIndex: -1, // Di belakang Quran
  },
  buttonWrapper: {
    width: "80%",
    marginBottom: 20,
        
  },
  button: {
    backgroundColor: "#FFB085", // Warna peach/oranye tombol
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // Bayangan di Android
    shadowColor: "#000", // Bayangan di iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0B1535", // Warna teks tombol biru gelap
  },
});

export default SplashScreen;
