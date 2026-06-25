import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Animated, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const STORY_KEY = '@our_story_chapters';

const DEFAULT_CHAPTERS = [
  { id: '1', title: 'Chapter 1: Pehli Mulakaat', date: '2020-01-15', emoji: '✨', color: '#2ecc71', content: 'Yahan likho kahan mile pehli baar...' },
  { id: '2', title: 'Chapter 2: Dosti', date: '2020-03-20', emoji: '🤝', color: '#3498db', content: 'Yahan likho kaise dosti hui...' },
  { id: '3', title: 'Chapter 3: Pyaar', date: '2020-06-14', emoji: '❤️', color: '#e94560', content: 'Yahan likho kab pyaar hua...' },
  { id: '4', title: 'Chapter 4: Long Distance', date: '2020-08-01', emoji: '📱', color: '#9b59b6', content: 'Yahan likho long distance ka dard...' },
  { id: '5', title: 'Chapter 5: Ladaiyan', date: '2021-02-10', emoji: '😤', color: '#f39c12', content: 'Yahan likho ladaiyon ke baare mein...' },
  { id: '6', title: 'Chapter 6: Her Birthday', date: '2021-05-20', emoji: '🎂', color: '#e94560', content: 'Yahan likho uske birthday ke pal...' },
  { id: '7', title: 'Chapter 7: Sapne', date: '2022-01-01', emoji: '🌙', color: '#1abc9c', content: 'Yahan likho future ke sapne...' },
  { id: '8', title: 'Chapter 8: Last Meet', date: '2026-05-30', emoji: '💔', color: '#c0392b', content: 'Yahan likho last meet ke baare mein...' },
  { id: '9', title: 'Chapter 9: 2 June 2026', date: '2026-06-02', emoji: '🕯️', color: '#2c3e50', content: 'Yahan likho woh din... jab sab khatam hua...' },
];

function ChapterCard({ chapter, index, onPress }: any) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: index * 100, useNativeDriver: true }).start();
  }, []);
  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity style={[styles.chapterCard, { borderLeftColor: chapter.color }]} onPress={() => onPress(chapter)}>
        <View style={styles.chapterHeader}>
          <View style={[styles.chapterIcon, { backgroundColor: chapter.color + '30' }]}>
            <Text style={styles.chapterEmoji}>{chapter.emoji}</Text>
          </View>
          <View style={styles.chapterInfo}>
            <Text style={styles.chapterTitle}>{chapter.title}</Text>
            <Text style={styles.chapterDate}>{chapter.date}</Text>
          </View>
        </View>
        <Text style={styles.chapterPreview} numberOfLines={2}>{chapter.content}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function ChapterDetail({ chapter, onClose, onSave }: any) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(chapter.content);
  const handleSave = () => { onSave({ ...chapter, content }); setEditing(false); };
  return (
    <Modal visible={true} transparent={true} animationType="fade">
      <View style={styles.detailOverlay}>
        <View style={[styles.detailCard, { borderColor: chapter.color }]}>
          <View style={[styles.detailHeader, { backgroundColor: chapter.color + '20' }]}>
            <Text style={styles.detailEmoji}>{chapter.emoji}</Text>
            <Text style={[styles.detailTitle, { color: chapter.color }]}>{chapter.title}</Text>
            <Text style={styles.detailDate}>{chapter.date}</Text>
          </View>
          {editing ? (
            <View style={styles.editBox}>
              <TextInput style={styles.editInput} multiline value={content} onChangeText={setContent} placeholder="Write your story here..." placeholderTextColor="#666" textAlignVertical="top" />
              <TouchableOpacity style={[styles.saveBtn, { backgroundColor: chapter.color }]} onPress={handleSave}>
                <Text style={styles.saveBtnText}>💾 Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.detailContent}>{chapter.content}</Text>
                <View style={{ height: 50 }} />
              </ScrollView>
              <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
                <Text style={styles.editBtnText}>✏️ Edit Story</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity style={[styles.closeBtn, { backgroundColor: chapter.color }]} onPress={onClose}>
            <Text style={styles.closeText}>✕ Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function StoryScreen() {
  const router = useRouter();
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);

  useEffect(() => { loadChapters(); }, []);
  const loadChapters = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORY_KEY);
      if (stored !== null) { setChapters(JSON.parse(stored)); }
      else { setChapters(DEFAULT_CHAPTERS); await AsyncStorage.setItem(STORY_KEY, JSON.stringify(DEFAULT_CHAPTERS)); }
    } catch (e) { setChapters(DEFAULT_CHAPTERS); }
    setLoading(false);
  };
  const saveChapters = async (newChapters: any[]) => {
    try { await AsyncStorage.setItem(STORY_KEY, JSON.stringify(newChapters)); } catch (e) { console.log('Error saving:', e); }
  };
  const handleSave = (updatedChapter: any) => {
    const updated = chapters.map((c) => (c.id === updatedChapter.id ? updatedChapter : c));
    setChapters(updated); saveChapters(updated); setSelectedChapter(null);
  };

  if (loading) return <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}><Text style={{ color: '#e94560', fontSize: 18 }}>Loading story...</Text></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}><Text style={styles.backText}>← Back</Text></TouchableOpacity>
        <Text style={styles.title}>📖 Our Story</Text>
        <View style={{ width: 60 }} />
      </View>
      <Text style={styles.subtitle}>Tumhari kahani, tumhare alfaz...</Text>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.timelineLine} />
        {chapters.map((chapter, index) => (
          <View key={chapter.id} style={styles.timelineItem}>
            <View style={[styles.timelineDot, { backgroundColor: chapter.color }]} />
            <ChapterCard chapter={chapter} index={index} onPress={setSelectedChapter} />
          </View>
        ))}
        <View style={styles.endBox}><Text style={styles.endText}>🕯️ To Be Continued... In My Heart</Text></View>
        <View style={{ height: 50 }} />
      </ScrollView>
      {selectedChapter && <ChapterDetail chapter={selectedChapter} onClose={() => setSelectedChapter(null)} onSave={handleSave} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 10 },
  backBtn: { padding: 8 }, backText: { color: '#e94560', fontSize: 16 },
  title: { fontSize: 24, color: '#e94560', fontWeight: 'bold' },
  subtitle: { fontSize: 13, color: '#aaa', textAlign: 'center', marginBottom: 20, fontStyle: 'italic' },
  scroll: { paddingHorizontal: 20 },
  timelineLine: { position: 'absolute', left: 35, top: 0, bottom: 0, width: 2, backgroundColor: 'rgba(233, 69, 96, 0.3)' },
  timelineItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20, position: 'relative' },
  timelineDot: { width: 14, height: 14, borderRadius: 7, marginRight: 20, marginTop: 20, zIndex: 2, borderWidth: 2, borderColor: '#1a1a2e' },
  chapterCard: { flex: 1, backgroundColor: 'rgba(22, 33, 62, 0.8)', borderRadius: 15, padding: 15, borderLeftWidth: 4 },
  chapterHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  chapterIcon: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  chapterEmoji: { fontSize: 24 }, chapterInfo: { flex: 1 },
  chapterTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  chapterDate: { color: '#aaa', fontSize: 11, marginTop: 2 },
  chapterPreview: { color: '#888', fontSize: 13, lineHeight: 18, fontStyle: 'italic' },
  endBox: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
  endText: { color: '#e94560', fontSize: 16, fontStyle: 'italic' },
  detailOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
  detailCard: { backgroundColor: '#1a1a2e', borderRadius: 25, padding: 25, width: width - 40, height: height * 0.7, borderWidth: 2 },
  detailHeader: { borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 20 },
  detailEmoji: { fontSize: 50, marginBottom: 10 },
  detailTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  detailDate: { color: '#aaa', fontSize: 14, marginBottom: 15 },
  detailContent: { color: '#fff', fontSize: 16, lineHeight: 26, textAlign: 'center' },
  editBox: { flex: 1, width: '100%' },
  editInput: { backgroundColor: 'rgba(22, 33, 62, 0.8)', borderRadius: 15, padding: 15, color: '#fff', fontSize: 15, height: 200, borderWidth: 1, borderColor: 'rgba(233, 69, 96, 0.3)', lineHeight: 22, marginBottom: 15 },
  saveBtn: { paddingHorizontal: 40, paddingVertical: 12, borderRadius: 20, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  editBtn: { backgroundColor: 'rgba(233, 69, 96, 0.2)', paddingHorizontal: 30, paddingVertical: 10, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: '#e94560' },
  editBtnText: { color: '#e94560', fontSize: 14, fontWeight: 'bold' },
  closeBtn: { paddingHorizontal: 40, paddingVertical: 12, borderRadius: 25, alignItems: 'center' },
  closeText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});