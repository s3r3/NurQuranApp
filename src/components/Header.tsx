import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Search, Menu } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const handleSearchPress = () => {
    navigation.navigate("Search");
  };

  return (
    <View style={[styles.header, { backgroundColor: colors.BACKGROUND }]}>
      <Menu color={colors.TEXT} size={ICON_SIZE} />
      <Text style={[styles.headerTitle, { color: colors.TEXT }]}>
        {t(title)}
      </Text>
      <TouchableOpacity onPress={handleSearchPress}>
        <Search color={colors.TEXT} size={ICON_SIZE} />
      </TouchableOpacity>
    </View>
  );
};

const ICON_SIZE = 28;
const PADDING = 20;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: PADDING,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Header;
