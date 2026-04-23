import React from "react";
import { View, Text } from "react-native";
const tasbihScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#0B1535" }}>
        <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold", margin: 20 }}>
            Bookmarks
        </Text>
        <Text style={{ color: "#8D92A3", fontSize: 16, marginHorizontal: 20, marginBottom: 20 }}>
            Your saved bookmarks will appear here.
        </Text>
    </View>
  )
}
export default tasbihScreen;