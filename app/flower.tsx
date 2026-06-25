import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FLOWER_KEY = '@daily_flower';

const FLOWERS = [
  { emoji: '🌹', name: 'Red Rose', meaning: 'Love & Passion' },
  { emoji: '🌻', name: 'Sunflower', meaning: 'Adoration & Loyalty' },
  { emoji: '🌷', name: 'Tulip', meaning: 'Perfect Love' },
  { emoji: '🌸', name: 'Cherry Blossom', meaning: 'Beauty & Hope' },
  { emoji: '🌺', name: 'Hibiscus', meaning: 'Delicate Beauty' },
  { emoji: '🌼', name: 'Daisy', meaning: 'Innocence & Purity' },
  { emoji: '🌵', name: 'Cactus', meaning: 'Endurance & Strength' },
  { emoji: '🌿', name: 'Herb', meaning: 'Healing & Protection' },
  { emoji: '💐', name: 'Bouquet', meaning: 'Gratitude & Joy' },
  { emoji: '🥀', name: 'Wilted Rose', meaning: 'Lost Love' },
  { emoji: '🪷', name: 'Lotus', meaning: 'Spiritual Growth' },
  { emoji: '🌾', name: 'Wheat', meaning: 'Abundance' },
];

export default function FlowerScreen() {
  const router = useRouter();
  const [todayFlower, setTodayFlower] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [scaleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadFlower();
    Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  }, []);

  const loadFlower = async () => {
    try {
      const stored = await AsyncStorage.getItem(FLOWER_KEY);
      const today = new Date().toLocaleDateString();
      if (stored) {
        const data = JSON.parse(stored);
        if (data.date === today) {
          setTodayFlower(data.flower);
        } else {
          pickNewFlower(today, data.history || []);
        }
      } else {
        pickNewFlower(today, []);
      }
    } catch (e) { pickNewFlower(new Date().toLocaleDateString(), []); }
  };

  const pickNewFlower = async (date: string, prevHistory: any[]) => {
    const random = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];
    const newHistory = [{ ...random, date }, ...prevHistory].slice(0, 30);
    const data = { date, flower: random, history: newHistory };
    await AsyncStorage.setItem(FLOWER_KEY, JSON.stringify(data));
    setTodayFlower(random);
    setHistory(newHistory);
  };

  const getNewFlower = () => {
    const today = new Date().toLocaleDateString();
    pickNewFlower(today, history);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🌸 Daily Flower</Text>
        <View style={{ width: 60 }} />
      </View>
      <Text style={styles.subtitle}>A flower for her, every day</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {todayFlower && (
          <Animated.View style={[styles.flowerCard, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.flowerEmoji}>{todayFlower.emoji}</Text>
            <Text style={styles.flowerName}>{todayFlower.name}</Text>
            <Text style={styles.flowerMeaning}>{todayFlower.meaning}</Text>
            <Text style={styles.flowerDate}>For: {new Date().toLocaleDateString()}</Text>
            <TouchableOpacity style={styles.newBtn} onPress={getNewFlower}>
              <Text style={styles.newText}>🌸 Get New Flower</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <Text style={styles.historyTitle}>📜 Flower History</Text>
        {history.length > 1 ? (
          history.slice(1).map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyEmoji}>{item.emoji}</Text>
              <View style={styles.historyInfo}>
                <Text style={styles.historyName}>{item.name}</Text>
                <Text style={styles.historyMeaning}>{item.meaning}</Text>
              </View>
              <Text style={styles.historyDate}>{item.date}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No history yet...</Text>
        )}
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 10 },
  backBtn: { padding: 8 }, backText: { color: '#e94560', fontSize: 16 },
  title: { fontSize: 24, color: '#e94560', fontWeight: 'bold' },
  subtitle: { fontSize: 13, color: '#aaa', textAlign: 'center', marginBottom: 20, fontStyle: 'italic' },
  scroll: { flex: 1, paddingHorizontal: 20 },
  flowerCard: { backgroundColor: 'rgba(22, 33, 62, 0.8)', borderRadius: 25, padding: 40, alignItems: 'center', marginBottom: 20, borderWidth: 2, borderColor: 'rgba(233, 69, 96, 0.3)' },
  flowerEmoji: { fontSize: 80, marginBottom: 15 },
  flowerName: { color: '#e94560', fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  flowerMeaning: { color: '#aaa', fontSize: 16, marginBottom: 10, fontStyle: 'italic' },
  flowerDate: { color: '#666', fontSize: 12, marginBottom: 20 },
  newBtn: { backgroundColor: 'rgba(233, 69, 96, 0.2)', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 20, borderWidth: 1, borderColor: '#e94560' },
  newText: { color: '#e94560', fontSize: 14, fontWeight: 'bold' },
  historyTitle: { color: '#e94560', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  historyItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(22, 33, 62, 0.8)', borderRadius: 15, padding: 12, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: '#533483' },
  historyEmoji: { fontSize: 24, marginRight: 15 },
  historyInfo: { flex: 1 },
  historyName: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  historyMeaning: { color: '#888', fontSize: 12 },
  historyDate: { color: '#666', fontSize: 11 },
  emptyText: { color: '#666', fontSize: 14, textAlign: 'center', fontStyle: 'italic' },
});