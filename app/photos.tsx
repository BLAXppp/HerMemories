import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const PHOTOS = [
  {
    id: '1',
    // CHANGE THIS TO YOUR ACTUAL PHOTO FILENAME
    uri: require('../assets/her-photo-1.jpg'),
    caption: 'Her world',
    date: '2026-06-02',
  },
  {
    id: '2',
    uri: require('../assets/her-photo-2.jpg'),
    caption: 'spideyy',
    date: '2026-06-02',
  },
  {
    id: '3',
    uri: require('../assets/her-photo-3.jpg'),
    caption: 'her',
    date: '2026-06-02',
  },
  {
    id: '4',
    uri: require('../assets/her-photo-4.jpg'),
    caption: 'Her beauty',
    date: '2026-06-02',
  },
  {
    id: '5',
    uri: require('../assets/her-photo-5.jpg'),
    caption: 'her smile',
    date: '2026-06-02',
  },
  {
    id: '6',
    uri: require('../assets/her-photo-6.jpg'),
    caption: 'Her eyes',
    date: '2026-06-02',
  },
];

export default function PhotosScreen() {
  const router = useRouter();
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📸 Her Photos</Text>
        <View style={{ width: 60 }} />
      </View>

      <Text style={styles.subtitle}>Every picture holds a memory</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {PHOTOS.map((photo) => (
            <TouchableOpacity
              key={photo.id}
              style={styles.photoCard}
              onPress={() => setSelectedPhoto(photo)}
              activeOpacity={0.8}
            >
              <Image source={photo.uri} style={styles.photoImage} />
              <View style={styles.photoOverlay}>
                <Text style={styles.photoCaption}>{photo.caption}</Text>
                <Text style={styles.photoDate}>{photo.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={selectedPhoto !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedPhoto(null)}>
          <View style={styles.modalContent}>
            {selectedPhoto && (
              <>
                <Image
                  source={selectedPhoto.uri}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
                <Text style={styles.modalCaption}>{selectedPhoto.caption}</Text>
                <Text style={styles.modalDate}>{selectedPhoto.date}</Text>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setSelectedPhoto(null)}
                >
                  <Text style={styles.closeText}>✕ Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backBtn: {
    padding: 8,
  },
  backText: {
    color: '#e94560',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    color: '#e94560',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 13,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  photoCard: {
    width: (width - 50) / 2,
    height: 200,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.2)',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
  },
  photoCaption: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  photoDate: {
    color: '#aaa',
    fontSize: 11,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width - 40,
    alignItems: 'center',
  },
  modalImage: {
    width: width - 40,
    height: 400,
    borderRadius: 15,
  },
  modalCaption: {
    color: '#fff',
    fontSize: 20,
    marginTop: 20,
    fontWeight: '600',
  },
  modalDate: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 5,
  },
  closeBtn: {
    marginTop: 30,
    backgroundColor: '#e94560',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});