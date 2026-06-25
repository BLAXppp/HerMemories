import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Vibration,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const HUG_KEY = '@hug_count';
const HUG_HISTORY_KEY = '@hug_history';
const HUG_PATTERN = [0, 300, 100, 300, 100, 300, 100, 500];

export default function HugScreen() {
  const router = useRouter();
  const [hugSent, setHugSent] = useState(false);
  const [hugCount, setHugCount] = useState(0);
  const [hugHistory, setHugHistory] = useState<any[]>([]);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadHugData();
  }, []);

  const loadHugData = async () => {
    try {
      const count = await AsyncStorage.getItem(HUG_KEY);
      const history = await AsyncStorage.getItem(HUG_HISTORY_KEY);
      if (count) setHugCount(parseInt(count));
      if (history) setHugHistory(JSON.parse(history));
    } catch (e) {
      console.log('Error loading hug data:', e);
    }
  };

  const saveHugData = async (newCount: number, newHistory: any[]) => {
    try {
      await AsyncStorage.setItem(HUG_KEY, newCount.toString());
      await AsyncStorage.setItem(HUG_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (e) {
      console.log('Error saving hug data:', e);
    }
  };

  const sendHug = async () => {
    Vibration.vibrate(HUG_PATTERN);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const newHug = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      timestamp: Date.now(),
    };

    const newCount = hugCount + 1;
    const newHistory = [newHug, ...hugHistory];

    setHugCount(newCount);
    setHugHistory(newHistory);
    await saveHugData(newCount, newHistory);

    setHugSent(true);
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
      setHugSent(false);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🤗 Virtual Hug</Text>
        <View style={{ width: 60 }} />
      </View>

      <Text style={styles.subtitle}>Jab usse hug nahi kar sakte...</Text>

      <View style={styles.counterBox}>
        <Text style={styles.counterNumber}>{hugCount}</Text>
        <Text style={styles.counterLabel}>Total Hugs Sent</Text>
      </View>

      <TouchableOpacity
        style={styles.hugButton}
        onPress={sendHug}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Text style={styles.hugEmoji}>🤗</Text>
        </Animated.View>
        <Text style={styles.hugText}>TAP TO SEND HUG</Text>
        <Text style={styles.hugSub}>Phone will vibrate like a heartbeat</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.messageBox, { opacity: opacityAnim }]}>
        <Text style={styles.messageText}>💫 Hug sent to her!</Text>
        <Text style={styles.messageSub}>She would have felt it...</Text>
      </Animated.View>

      <Text style={styles.historyTitle}>📜 Hug History</Text>

      <ScrollView style={styles.historyScroll} showsVerticalScrollIndicator={false}>
        {hugHistory.length === 0 ? (
          <Text style={styles.emptyText}>No hugs sent yet... Send your first hug! 🤗</Text>
        ) : (
          hugHistory.map((hug, index) => (
            <View key={hug.id} style={styles.historyItem}>
              <Text style={styles.historyNumber}>#{hugCount - index}</Text>
              <View style={styles.historyInfo}>
                <Text style={styles.historyDate}>{hug.date}</Text>
                <Text style={styles.historyLabel}>Hug sent with love 💔</Text>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backBtn: { padding: 8 },
  backText: { color: '#e94560', fontSize: 16 },
  title: { fontSize: 24, color: '#e94560', fontWeight: 'bold' },
  subtitle: {
    fontSize: 13,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  counterBox: { alignItems: 'center', marginBottom: 20 },
  counterNumber: { color: '#e94560', fontSize: 48, fontWeight: 'bold' },
  counterLabel: { color: '#aaa', fontSize: 14, marginTop: 5 },
  hugButton: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
    borderWidth: 3,
    borderColor: '#e94560',
    marginTop: 10,
    marginBottom: 20,
  },
  hugEmoji: { fontSize: 70, marginBottom: 5 },
  hugText: { color: '#e94560', fontSize: 14, fontWeight: 'bold', marginTop: 5 },
  hugSub: {
    color: '#888',
    fontSize: 10,
    marginTop: 3,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  messageBox: {
    alignItems: 'center',
    marginVertical: 15,
    padding: 15,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2ecc71',
    marginHorizontal: 40,
  },
  messageText: { color: '#2ecc71', fontSize: 16, fontWeight: 'bold' },
  messageSub: { color: '#aaa', fontSize: 12, marginTop: 3, fontStyle: 'italic' },
  historyTitle: {
    color: '#e94560',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  historyScroll: { flex: 1, paddingHorizontal: 20 },
  emptyText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 30,
    fontStyle: 'italic',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(22, 33, 62, 0.8)',
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#e94560',
  },
  historyNumber: {
    color: '#e94560',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 15,
    width: 40,
  },
  historyInfo: { flex: 1 },
  historyDate: { color: '#fff', fontSize: 13, marginBottom: 2 },
  historyLabel: { color: '#888', fontSize: 11, fontStyle: 'italic' },
});