import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MOOD_KEY = '@mood_stats';

const MOODS = [
  { emoji: '😊', label: 'Happy', color: '#2ecc71' },
  { emoji: '😢', label: 'Sad', color: '#3498db' },
  { emoji: '😤', label: 'Angry', color: '#e74c3c' },
  { emoji: '😴', label: 'Tired', color: '#9b59b6' },
  { emoji: '🥰', label: 'Loved', color: '#e94560' },
  { emoji: '😰', label: 'Anxious', color: '#f39c12' },
  { emoji: '🤔', label: 'Thinking', color: '#1abc9c' },
  { emoji: '💔', label: 'Missing Her', color: '#c0392b' },
];

export default function StatsScreen() {
  const router = useRouter();
  const [moodCounts, setMoodCounts] = useState<any>({});
  const [todayMood, setTodayMood] = useState('');
  const [totalEntries, setTotalEntries] = useState(0);

  useEffect(() => { loadMoods(); }, []);

  const loadMoods = async () => {
    try {
      const stored = await AsyncStorage.getItem(MOOD_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setMoodCounts(data.counts || {});
        setTotalEntries(data.total || 0);
      }
    } catch (e) {}
  };

  const saveMood = async (mood: any) => {
    const today = new Date().toLocaleDateString();
    if (todayMood === today) return; // Already logged today

    const newCounts = { ...moodCounts };
    newCounts[mood.label] = (newCounts[mood.label] || 0) + 1;

    const data = {
      counts: newCounts,
      total: totalEntries + 1,
      lastEntry: today,
    };

    await AsyncStorage.setItem(MOOD_KEY, JSON.stringify(data));
    setMoodCounts(newCounts);
    setTotalEntries(totalEntries + 1);
    setTodayMood(today);
  };

  const getMaxMood = () => {
    let max = 0;
    let maxMood = '';
    Object.entries(moodCounts).forEach(([label, count]: any) => {
      if (count > max) { max = count; maxMood = label; }
    });
    return maxMood;
  };

  const today = new Date().toLocaleDateString();
  const alreadyLogged = todayMood === today;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📊 Mood Stats</Text>
        <View style={{ width: 60 }} />
      </View>
      <Text style={styles.subtitle}>How do you feel today?</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.moodGrid}>
          {MOODS.map((mood) => (
            <TouchableOpacity
              key={mood.label}
              style={[styles.moodBtn, { backgroundColor: mood.color + '25', borderColor: mood.color }]}
              onPress={() => saveMood(mood)}
              disabled={alreadyLogged}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={[styles.moodLabel, { color: mood.color }]}>{mood.label}</Text>
              {moodCounts[mood.label] > 0 && (
                <View style={[styles.moodBadge, { backgroundColor: mood.color }]}>
                  <Text style={styles.moodBadgeText}>{moodCounts[mood.label]}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>📈 Your Stats</Text>
          <Text style={styles.statsText}>Total Entries: {totalEntries}</Text>
          <Text style={styles.statsText}>Most Frequent: {getMaxMood() || 'None yet'}</Text>
          {alreadyLogged && <Text style={styles.statsNote}>✅ Already logged today!</Text>}
        </View>

        <View style={styles.historyCard}>
          <Text style={styles.historyTitle}>📜 Mood History</Text>
          {Object.entries(moodCounts).length === 0 ? (
            <Text style={styles.emptyText}>No moods logged yet...</Text>
          ) : (
            Object.entries(moodCounts).map(([label, count]: any) => (
              <View key={label} style={styles.historyItem}>
                <Text style={styles.historyLabel}>{label}</Text>
                <View style={styles.historyBar}>
                  <View style={[styles.historyFill, { width: `${Math.min((count / totalEntries) * 100, 100)}%` }]} />
                </View>
                <Text style={styles.historyCount}>{count}</Text>
              </View>
            ))
          )}
        </View>
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
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  moodBtn: { width: '48%', borderRadius: 20, padding: 20, marginBottom: 10, alignItems: 'center', borderWidth: 2 },
  moodEmoji: { fontSize: 30, marginBottom: 5 },
  moodLabel: { fontSize: 14, fontWeight: 'bold' },
  moodBadge: { position: 'absolute', top: 5, right: 5, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  moodBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  statsCard: { backgroundColor: 'rgba(22, 33, 62, 0.8)', borderRadius: 20, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(233, 69, 96, 0.3)' },
  statsTitle: { color: '#e94560', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  statsText: { color: '#fff', fontSize: 14, marginBottom: 5 },
  statsNote: { color: '#2ecc71', fontSize: 13, marginTop: 10, fontStyle: 'italic' },
  historyCard: { backgroundColor: 'rgba(22, 33, 62, 0.8)', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(233, 69, 96, 0.3)' },
  historyTitle: { color: '#e94560', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  emptyText: { color: '#666', fontSize: 14, textAlign: 'center', fontStyle: 'italic' },
  historyItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  historyLabel: { color: '#fff', fontSize: 13, width: 80 },
  historyBar: { flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, marginHorizontal: 10 },
  historyFill: { height: 8, backgroundColor: '#e94560', borderRadius: 4 },
  historyCount: { color: '#e94560', fontSize: 12, fontWeight: 'bold', width: 25, textAlign: 'right' },
});