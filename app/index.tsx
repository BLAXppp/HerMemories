import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  Vibration,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const SEPARATION_DATE = new Date('2026-06-02T00:00:00');
const PAUSE_KEY = '@timer_pause';
const PERMANENT_PAUSE_KEY = '@timer_permanent_pause';

const SECTIONS = [
  { title: '📸 Her Photos', path: '/photos', color: '#e94560', icon: '📸' },
  { title: '🎙️ Her Voice', path: '/voice', color: '#0f3460', icon: '🎙️' },
  { title: '🎵 Her Songs', path: '/songs', color: '#533483', icon: '🎵' },
  { title: '📅 Her Cycle', path: '/periods', color: '#e94560', icon: '📅' },
  { title: '💌 Write to Her', path: '/letters', color: '#0f3460', icon: '💌' },
  { title: '📍 Her Places', path: '/places', color: '#533483', icon: '📍' },
  { title: '📖 Our Story', path: '/story', color: '#e94560', icon: '📖' },
  { title: '📊 Mood Stats', path: '/stats', color: '#0f3460', icon: '📊' },
  { title: '🌸 Daily Flower', path: '/flower', color: '#533483', icon: '🌸' },
  { title: '🤗 Virtual Hug', path: '/hug', color: '#e94560', icon: '🤗' },
];

function SectionButton({ section, index, onPress }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = () => {
    Vibration.vibrate(20);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start(() => onPress());
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        style={[styles.sectionBtn, { borderLeftColor: section.color }]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={[styles.iconCircle, { backgroundColor: section.color + '25' }]}>
          <Text style={styles.iconText}>{section.icon}</Text>
        </View>
        <View style={styles.sectionInfo}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
        <Text style={[styles.arrow, { color: section.color }]}>›</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function HeartBeat() {
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Text style={styles.heartEmoji}>💔</Text>
    </Animated.View>
  );
}

function PauseModal({ visible, onPause, onResume, onPermanent, isPaused, isPermanent }: any) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.pauseCard}>
          <Text style={styles.pauseTitle}>⏸ Timer Control</Text>
          {isPermanent ? (
            <View style={styles.permanentBox}>
              <Text style={styles.permanentText}>❤️ Paused Forever</Text>
              <Text style={styles.permanentSub}>You found her again...</Text>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.pauseBtn, isPaused && styles.pauseBtnActive]}
                onPress={isPaused ? onResume : onPause}
              >
                <Text style={styles.pauseBtnText}>{isPaused ? '▶ Resume' : '⏸ Pause'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.permanentBtn} onPress={onPermanent}>
                <Text style={styles.permanentBtnText}>❤️ Permanent Pause (Found Her)</Text>
              </TouchableOpacity>
            </>
          )}
          <Text style={styles.pauseNote}>
            {isPaused ? 'Timer is paused' : isPermanent ? 'Timer stopped forever' : 'Timer is running'}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [timeApart, setTimeApart] = useState({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPaused, setIsPaused] = useState(false);
  const [permanentPause, setPermanentPause] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);

  useEffect(() => { loadPauseStates(); }, []);
  useEffect(() => {
    if (permanentPause) return;
    const timer = setInterval(() => {
      if (isPaused) return;
      const now = new Date();
      const diff = now.getTime() - SEPARATION_DATE.getTime();
      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
      const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeApart({ years, days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, permanentPause]);

  const loadPauseStates = async () => {
    try {
      const paused = await AsyncStorage.getItem(PAUSE_KEY);
      const permanent = await AsyncStorage.getItem(PERMANENT_PAUSE_KEY);
      if (paused) setIsPaused(JSON.parse(paused));
      if (permanent) setPermanentPause(JSON.parse(permanent));
    } catch (e) { console.log('Error loading pause states:', e); }
  };

  const savePauseState = async (key: string, value: any) => {
    try { await AsyncStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.log('Error saving pause state:', e); }
  };

  const handlePause = () => { setIsPaused(true); savePauseState(PAUSE_KEY, true); };
  const handleResume = () => { setIsPaused(false); savePauseState(PAUSE_KEY, false); };
  const handlePermanent = () => {
    setPermanentPause(true); setIsPaused(false);
    savePauseState(PERMANENT_PAUSE_KEY, true); savePauseState(PAUSE_KEY, false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <HeartBeat />
            <Text style={styles.title}>Time Without You</Text>
            <Text style={styles.subtitle}>Every second feels like forever</Text>
          </View>

          <View style={styles.timerBox}>
            {Object.entries(timeApart).map(([key, value]) => (
              <View key={key} style={styles.timeItem}>
                <Text style={styles.number}>{String(value).padStart(2, '0')}</Text>
                <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.pauseStatusBox} onPress={() => setShowPauseModal(true)}>
            <Text style={styles.pauseStatusText}>
              {permanentPause ? '❤️ Paused Forever' : isPaused ? '⏸ Paused' : '▶ Running'}
            </Text>
            <Text style={styles.pauseTapText}>Tap to control</Text>
          </TouchableOpacity>

          <View style={styles.dateBox}>
            <Text style={styles.dateText}>Since: 2 June 2026</Text>
            <Text style={styles.dateSub}>The day everything changed...</Text>
          </View>

          <Text style={styles.sectionHeading}>Her Memories</Text>
          {SECTIONS.map((section, index) => (
            <SectionButton key={section.path} section={section} index={index} onPress={() => router.push(section.path)} />
          ))}
          <View style={{ height: 50 }} />
        </ScrollView>

        <PauseModal
          visible={showPauseModal}
          onPause={handlePause}
          onResume={handleResume}
          onPermanent={handlePermanent}
          isPaused={isPaused}
          isPermanent={permanentPause}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  overlay: { flex: 1, backgroundColor: 'rgba(26, 26, 46, 0.92)', padding: 20 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 20 },
  heartEmoji: { fontSize: 40, marginBottom: 10 },
  title: { fontSize: 32, color: '#e94560', textAlign: 'center', fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#aaa', textAlign: 'center', marginTop: 8, fontStyle: 'italic' },
  timerBox: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 10 },
  timeItem: { alignItems: 'center', margin: 6, backgroundColor: 'rgba(22, 33, 62, 0.8)', padding: 12, borderRadius: 15, minWidth: 65, borderWidth: 1, borderColor: 'rgba(233, 69, 96, 0.3)' },
  number: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  label: { fontSize: 11, color: '#aaa', marginTop: 4 },
  pauseStatusBox: { alignItems: 'center', marginBottom: 15, padding: 10, backgroundColor: 'rgba(233, 69, 96, 0.1)', borderRadius: 15, borderWidth: 1, borderColor: 'rgba(233, 69, 96, 0.3)' },
  pauseStatusText: { color: '#e94560', fontSize: 16, fontWeight: 'bold' },
  pauseTapText: { color: '#888', fontSize: 12, marginTop: 4 },
  dateBox: { alignItems: 'center', marginBottom: 20 },
  dateText: { color: '#e94560', fontSize: 14, fontWeight: '600' },
  dateSub: { color: '#666', fontSize: 12, marginTop: 4, fontStyle: 'italic' },
  sectionHeading: { fontSize: 20, color: '#fff', marginBottom: 15, marginLeft: 5, fontWeight: '600' },
  sectionBtn: { backgroundColor: 'rgba(22, 33, 62, 0.8)', padding: 15, borderRadius: 15, marginBottom: 12, borderLeftWidth: 4, flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  iconText: { fontSize: 22 },
  sectionInfo: { flex: 1 },
  sectionTitle: { color: '#fff', fontSize: 17 },
  arrow: { fontSize: 22, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  pauseCard: { backgroundColor: '#1a1a2e', borderRadius: 25, padding: 30, width: width - 60, borderWidth: 2, borderColor: '#e94560', alignItems: 'center' },
  pauseTitle: { color: '#e94560', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  pauseBtn: { backgroundColor: '#0f3460', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 20, marginBottom: 15, width: '100%', alignItems: 'center' },
  pauseBtnActive: { backgroundColor: '#e94560' },
  pauseBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  permanentBtn: { backgroundColor: 'rgba(46, 204, 113, 0.2)', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 20, marginBottom: 15, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#2ecc71' },
  permanentBtnText: { color: '#2ecc71', fontSize: 16, fontWeight: 'bold' },
  permanentBox: { alignItems: 'center', padding: 20 },
  permanentText: { color: '#2ecc71', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  permanentSub: { color: '#aaa', fontSize: 14, fontStyle: 'italic' },
  pauseNote: { color: '#888', fontSize: 13, marginTop: 10, fontStyle: 'italic' },
});