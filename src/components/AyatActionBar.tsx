import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Share2, Play, Bookmark } from "lucide-react-native";
import { COLORS } from "../constants/colors";
import { AyatActionProps } from "../types/quran.types"


export const AyatActionBar: React.FC<AyatActionProps> = ({
  ayatNumber,
  isBookmarked,
  isPlaying,
  onShare,
  onPlay,
  onBookmark,
  onBookmarkLongPress,
}) => {
  return (
    <View style={styles.actionBar}>
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{ayatNumber}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onShare}>
          <Share2 color={COLORS.PRIMARY} size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPlay} style={{ marginHorizontal: 20 }}>
          <Play
            color={COLORS.PRIMARY}
            size={20}
            fill={isPlaying ? COLORS.PRIMARY : "transparent"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onBookmark} onLongPress={onBookmarkLongPress}>
          <Bookmark
            color={COLORS.PRIMARY}
            size={20}
            fill={isBookmarked ? COLORS.PRIMARY : "transparent"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.ACTION_BAR_BG,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  numberBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    color: COLORS.TEXT,
    fontSize: 12,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
});
