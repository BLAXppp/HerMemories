import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CYCLE_KEY = '@her_cycle_data';

export default function PeriodsScreen() {
  const router = useRouter();
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [periodLength, setPeriodLength] = useState('5');
  const [showAddModal, setShowAddModal] = useState(false);
  const [nextPeriod, setNextPeriod] = useState('');
  const [fertileWindow, setFertileWindow] = useState('');
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => { loadData(); }, []);
  useEffect(() => { calculateDates(); }, [lastPeriod, cycleLength, periodLength]);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem(CYCLE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setLastPeriod(data.lastPeriod || '');
        setCycleLength(data.cycleLength || '28');
        setPeriodLength(data.periodLength || '5');
      }
    } catch (e) {}
  };

  const saveData = async () => {
    const data = { lastPeriod, cycleLength, periodLength };
    await AsyncStorage.setItem(CYCLE_KEY, JSON.stringify(data));
    setShowAddModal(false);
  };

  const calculateDates = () => {
    if (!lastPeriod) return;
    const last = new Date(lastPeriod);
    const cycle = parseInt(cycleLength);
    const period = parseInt(periodLength);

    const next = new Date(last);
    next.setDate(last.getDate() + cycle);

    const fertileStart = new Date(next);
    fertileStart.setDate(next.getDate() - 14);
    const fertileEnd = new Date(fertileStart);
    fertileEnd.setDate(fertileStart.getDate() + 5);

    const today = new Date();
    const diff = next.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    setNextPeriod(next.toLocaleDateString());
    setFertileWindow(`${fertileStart.toLocaleDateString()} - ${fertileEnd.toLocaleDateString()}`);
    setDaysLeft(days);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📅 Her Cycle</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Tracking her health, caring for her</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {lastPeriod ? (
          <>
            <View style={styles.card}>
              <Text style={styles.cardEmoji}>🩸</Text>
              <Text style={styles.cardLabel}>Next Period</Text>
              <Text style={styles.cardValue}>{nextPeriod}</Text>
              <Text style={styles.cardSub}>{daysLeft > 0 ? `In ${daysLeft} days` : daysLeft === 0 ? 'Today!' : `${Math.abs(daysLeft)} days late`}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardEmoji}>🌸</Text>
              <Text style={styles.cardLabel}>Fertile Window</Text>
              <Text style={styles.cardValue}>{fertileWindow}</Text>
              <Text style={styles.cardSub}>Best time to conceive</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardEmoji}>📊</Text>
              <Text style={styles.cardLabel}>Cycle Length</Text>
              <Text style={styles.cardValue}>{cycleLength} days</Text>
              <Text style={styles.cardSub}>Period lasts {periodLength} days</Text>
            </View>
          </>
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyText}>No cycle data yet</Text>
            <Text style={styles.emptySub}>Tap + to add her last period date</Text>
          </View>
        )}
        <View style={{ height: 50 }} />
      </ScrollView>

      <Modal visible={showAddModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>📅 Add Cycle Data</Text>
            <Text style={styles.modalLabel}>Last Period Start Date</Text>
            <TextInput style={styles.modalInput} placeholder="YYYY-MM-DD" placeholderTextColor="#666" value={lastPeriod} onChangeText={setLastPeriod} />
            <Text style={styles.modalLabel}>Cycle Length (days)</Text>
            <TextInput style={styles.modalInput} placeholder="28" placeholderTextColor="#666" value={cycleLength} onChangeText={setCycleLength} keyboardType="numeric" />
            <Text style={styles.modalLabel}>Period Length (days)</Text>
            <TextInput style={styles.modalInput} placeholder="5" placeholderTextColor="#666" value={periodLength} onChangeText={setPeriodLength} keyboardType="numeric" />
            <TouchableOpacity style={styles.modalSaveBtn} onPress={saveData}>
              <Text style={styles.modalSaveText}>💾 Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCloseText}>✕ Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 10 },
  backBtn: { padding: 8 }, backText: { color: '#e94560', fontSize: 16 },
  title: { fontSize: 24, color: '#e94560', fontWeight: 'bold' },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e94560', justifyContent: 'center', alignItems: 'center' },
  addText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 13, color: '#aaa', textAlign: 'center', marginBottom: 20, fontStyle: 'italic' },
  scroll: { flex: 1, paddingHorizontal: 20 },
  card: { backgroundColor: 'rgba(22, 33, 62, 0.8)', borderRadius: 20, padding: 25, marginBottom: 15, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(233, 69, 96, 0.3)' },
  cardEmoji: { fontSize: 40, marginBottom: 10 },
  cardLabel: { color: '#aaa', fontSize: 14, marginBottom: 5 },
  cardValue: { color: '#e94560', fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  cardSub: { color: '#666', fontSize: 12, fontStyle: 'italic' },
  emptyBox: { alignItems: 'center', marginTop: 100 },
  emptyEmoji: { fontSize: 60, marginBottom: 20 },
  emptyText: { color: '#e94560', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  emptySub: { color: '#666', fontSize: 14, fontStyle: 'italic' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: '#1a1a2e', borderRadius: 25, padding: 30, width: 300, borderWidth: 2, borderColor: '#e94560', alignItems: 'center' },
  modalTitle: { color: '#e94560', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  modalLabel: { color: '#aaa', fontSize: 12, alignSelf: 'flex-start', marginBottom: 5, marginTop: 10 },
  modalInput: { backgroundColor: 'rgba(22, 33, 62, 0.8)', borderRadius: 15, padding: 15, color: '#fff', fontSize: 16, width: '100%', borderWidth: 1, borderColor: 'rgba(233, 69, 96, 0.3)', marginBottom: 10 },
  modalSaveBtn: { backgroundColor: '#e94560', paddingHorizontal: 40, paddingVertical: 12, borderRadius: 20, width: '100%', alignItems: 'center', marginTop: 15, marginBottom: 10 },
  modalSaveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalCloseBtn: { backgroundColor: 'rgba(22, 33, 62, 0.8)', paddingHorizontal: 40, paddingVertical: 12, borderRadius: 20, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(233, 69, 96, 0.3)' },
  modalCloseText: { color: '#aaa', fontSize: 16 },
});