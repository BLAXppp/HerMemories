import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const LETTERS_KEY = '@letters_to_her';

export default function LettersScreen() {
  const router = useRouter();
  const [letters, setLetters] = useState<any[]>([]);
  const [newLetter, setNewLetter] = useState('');
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<any>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    loadLetters();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadLetters = async () => {
    try {
      const stored = await AsyncStorage.getItem(LETTERS_KEY);
      if (stored) setLetters(JSON.parse(stored));
    } catch (e) {}
  };

  const saveLetter = async () => {
    if (!newLetter.trim()) return;
    const letter = {
      id: Date.now().toString(),
      text: newLetter,
      date: new Date().toLocaleString(),
      timestamp: Date.now(),
    };
    const updated = [letter, ...letters];
    setLetters(updated);
    await AsyncStorage.setItem(LETTERS_KEY, JSON.stringify(updated));
    setNewLetter('');
    setShowWriteModal(false);
  };

  const deleteLetter = async (id: string) => {
    const updated = letters.filter((l) => l.id !== id);
    setLetters(updated);
    await AsyncStorage.setItem(LETTERS_KEY, JSON.stringify(updated));
    setSelectedLetter(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>💌 Write to Her</Text>
        <TouchableOpacity
          style={styles.writeBtn}
          onPress={() => setShowWriteModal(true)}
        >
          <Text style={styles.writeText}>✏️</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Letters I never sent...</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {letters.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>💌</Text>
            <Text style={styles.emptyText}>No letters yet</Text>
            <Text style={styles.emptySub}>
              Write your heart out, even if she never reads it
            </Text>
          </View>
        ) : (
          letters.map((letter, index) => (
            <Animated.View
              key={letter.id}
              style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}
            >
              <TouchableOpacity
                style={styles.letterCard}
                onPress={() => setSelectedLetter(letter)}
                activeOpacity={0.8}
              >
                <View style={styles.letterHeader}>
                  <Text style={styles.letterNumber}>#{letters.length - index}</Text>
                  <Text style={styles.letterDate}>{letter.date}</Text>
                </View>
                <Text style={styles.letterPreview} numberOfLines={3}>
                  {letter.text}
                </Text>
                <View style={styles.letterSeal}>
                  <Text style={styles.sealText}>💔 Unsent</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))
        )}
        <View style={{ height: 50 }} />
      </ScrollView>

      {/* Write Letter Modal */}
      <Modal visible={showWriteModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>💌 New Letter</Text>
            <TextInput
              style={styles.modalInput}
              multiline
              placeholder="Dear her...

Write what you feel..."
              placeholderTextColor="#666"
              value={newLetter}
              onChangeText={setNewLetter}
              textAlignVertical="top"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={saveLetter}
              >
                <Text style={styles.modalSaveText}>💌 Save Letter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => {
                  setNewLetter('');
                  setShowWriteModal(false);
                }}
              >
                <Text style={styles.modalCloseText}>✕ Discard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Read Letter Modal */}
      <Modal visible={selectedLetter !== null} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.readCard}>
            <Text style={styles.readDate}>{selectedLetter?.date}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.readText}>{selectedLetter?.text}</Text>
              <View style={{ height: 50 }} />
            </ScrollView>
            <View style={styles.readButtons}>
              <TouchableOpacity
                style={styles.readCloseBtn}
                onPress={() => setSelectedLetter(null)}
              >
                <Text style={styles.readCloseText}>✕ Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.readDeleteBtn}
                onPress={() => selectedLetter && deleteLetter(selectedLetter.id)}
              >
                <Text style={styles.readDeleteText}>🗑 Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  writeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
  },
  writeText: { color: '#fff', fontSize: 18 },
  subtitle: {
    fontSize: 13,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  scroll: { flex: 1, paddingHorizontal: 20 },
  emptyBox: { alignItems: 'center', marginTop: 100 },
  emptyEmoji: { fontSize: 60, marginBottom: 20 },
  emptyText: { color: '#e94560', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  emptySub: { color: '#666', fontSize: 14, fontStyle: 'italic', textAlign: 'center', paddingHorizontal: 40 },
  letterCard: {
    backgroundColor: 'rgba(22, 33, 62, 0.8)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#e94560',
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.2)',
  },
  letterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  letterNumber: { color: '#e94560', fontSize: 14, fontWeight: 'bold' },
  letterDate: { color: '#666', fontSize: 12 },
  letterPreview: { color: '#aaa', fontSize: 14, lineHeight: 20, fontStyle: 'italic' },
  letterSeal: {
    marginTop: 10,
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.3)',
  },
  sealText: { color: '#e94560', fontSize: 11, fontStyle: 'italic' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 25,
    padding: 25,
    width: width - 40,
    borderWidth: 2,
    borderColor: '#e94560',
    alignItems: 'center',
  },
  modalTitle: { color: '#e94560', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  modalInput: {
    backgroundColor: 'rgba(22, 33, 62, 0.8)',
    borderRadius: 15,
    padding: 15,
    color: '#fff',
    fontSize: 15,
    height: 250,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.3)',
    lineHeight: 22,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  modalButtons: { flexDirection: 'row', gap: 10, width: '100%' },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: '#e94560',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalSaveText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  modalCloseBtn: {
    flex: 1,
    backgroundColor: 'rgba(22, 33, 62, 0.8)',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.3)',
  },
  modalCloseText: { color: '#aaa', fontSize: 14 },
  readCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 25,
    padding: 25,
    width: width - 40,
    height: '80%',
    borderWidth: 2,
    borderColor: '#e94560',
  },
  readDate: {
    color: '#e94560',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(233, 69, 96, 0.3)',
    paddingBottom: 10,
  },
  readText: { color: '#fff', fontSize: 16, lineHeight: 26 },
  readButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(233, 69, 96, 0.3)',
    paddingTop: 15,
  },
  readCloseBtn: {
    flex: 1,
    backgroundColor: '#0f3460',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  readCloseText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  readDeleteBtn: {
    flex: 1,
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  readDeleteText: { color: '#e74c3c', fontSize: 14, fontWeight: 'bold' },
});