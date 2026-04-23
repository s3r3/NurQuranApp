import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { StarNumber } from './SurahAssets';
import Animated, { FadeInDown } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

// --- COMPONENT: SURAH LIST ---
export const SurahList = ({ surahs }: { surahs: any[] }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <FlatList
      data={surahs}
      keyExtractor={(item) => item.nomor.toString()}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => (
        <Animated.View entering={FadeInDown.delay(index * 50)}>
          <TouchableOpacity style={styles.listItem} onPress={()=> navigation.navigate("SurahDetail",{surahId:item.nomor})}>
            <View style={styles.itemLeft}>
              <StarNumber number={item.nomor} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.namaLatin}</Text>
                <Text style={styles.itemSub}>
                  {item.tempatTurun.toUpperCase()} • {item.jumlahAyat} VERSES
                </Text>
              </View>
            </View>
            <Text style={styles.arabicName}>{item.nama}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    />
  );
};



// --- COMPONENT: PARA (JUZ) ---
export const ParaList = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // Data dummy 1-30 Juz
  const juzData = Array.from({ length: 30 }, (_, i) => ({ 
    id: i + 1, 
    name: `Juz ${i + 1}` 
  }));

  return (
    <FlatList
      data={juzData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.listItem}
          onPress={() => {
            console.log(`Navigating to JuzDetail with juzId: ${item.id}`);
            navigation.navigate("JuzDetail", { juzId: item.id });
          }}
        >
          <View style={styles.itemLeft}>
            <StarNumber number={item.id} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemSub}>Lihat seluruh ayat di {item.name}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
    />
  );
};

// --- COMPONENT: PAGE ---
export const PageList = () => {
  const pageData = Array.from({ length: 604 }, (_, i) => ({ id: i + 1, name: `Page ${i + 1}` }));

  return (
    <FlatList
      data={pageData}
      numColumns={4}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.pageBox}>
          <Text style={styles.pageText}>{item.id}</Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={{ paddingHorizontal: 20, alignItems: 'center', paddingBottom: 100 }}
    />
  );
};

const styles = StyleSheet.create({
  listItem: { flexDirection: 'row', paddingVertical: 15, borderBottomWidth: 0.5, borderBottomColor: '#240F4F', alignItems: 'center', justifyContent: 'space-between' },
  arabicName: { color: '#A44AFF', fontSize: 20, fontWeight: 'bold' },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  itemInfo: { marginLeft: 15 },
  itemTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  itemSub: { color: '#8D92A3', fontSize: 12 },
  pageBox: { 
    width: 70, height: 70, backgroundColor: '#121931', 
    margin: 8, borderRadius: 12, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#240F4F'
  },
  pageText: { color: 'white', fontWeight: 'bold' }
});