import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { QuranSVG } from "../../assets/svg";


// Bingkai Bintang untuk Nomor Surah
export const StarNumber = ({ number }: { number: number }) => (
  <View style={styles.starWrapper}>
    <Svg width="36" height="36" viewBox="0 0 100 100">
      <Path
        d="M50 0 L61.2 38.8 L100 50 L61.2 61.2 L50 100 L38.8 61.2 L0 50 L38.8 38.8 Z"
        fill="none"
        stroke="#A44AFF"
        strokeWidth="5"
      />
    </Svg>
    <Text style={styles.numberText}>{number}</Text>
  </View>
);

// Quran dengan Animasi Mengambang yang Halus
export const AnimatedQuran = () => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <QuranSVG width={120} height={100} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  starWrapper: { justifyContent: "center", alignItems: "center" },
  numberText: {
    position: "absolute",
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});