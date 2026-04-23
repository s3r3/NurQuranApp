import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Search, Menu } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigation = useNavigation<NavigationProp>();

  const handleSearchPress = () => {
    navigation.navigate("Search");
  };
  return (
    <View style={styles.header}>
      <Menu color="white" size={28} />
      <Text style={styles.headerTitle}>{title}</Text>
      <Search color="white" size={28} onPress={handleSearchPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
  },
  headerTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
});

export default Header;