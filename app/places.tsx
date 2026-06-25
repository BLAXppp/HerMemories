import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Online photo URLs — tum badal bhi sakte ho
const PLACES = [
  {
    id: '1',
    name: 'Vrindavan',
    state: 'Uttar Pradesh',
    emoji: '🛕',
    color: '#FF6B6B',
    photo: 'https://cdn.pixabay.com/photo/2020/01/21/08/09/indian-temple-4782305_1280.jpg', },
  {
    id: '2',
    name: 'Dwarka',
    state: 'Gujarat',
    emoji: '🌊',
    color: '#4ECDC4',
    photo: 'https://tse1.mm.bing.net/th/id/OIP.xJWAKplrGCa9-ze5Q9tSowHaEo?rs=1&pid=ImgDetMain&o=7&rm=3',
  },
  {
    id: '3',
    name: 'Mumbai',
    state: 'Maharashtra',
    emoji: '🌆',
    color: '#FFE66D',
    photo: 'https://tse1.explicit.bing.net/th/id/OIP.ctjxLFlGySEbcYHrBxM48gHaEo?rs=1&pid=ImgDetMain&o=7&rm=3',
  },
  {
    id: '4',
    name: 'Haryana',
    state: 'Haryana',
    emoji: '🏡',
    color: '#95E1D3',
    photo: 'https://images.travelandleisureasia.com/wp-content/uploads/sites/5/2024/06/28140504/brahma-sarovar-kurukshetra-sourabh-patiyal-designs-shutterstock.jpeg',
  },
  {
    id: '5',
    name: 'Odisha',
    state: 'East India',
    emoji: '🏛️',
    color: '#F38181',
    photo: 'https://assets.traveltriangle.com/blog/wp-content/uploads/2016/11/Suntemple-Konark.jpg',
  },
  {
    id: '6',
    name: 'Bangalore',
    state: 'Karnataka',
    emoji: '🌳',
    color: '#AA96DA',
    photo: 'https://www.tripplannersindia.com/assets/blog/images/bestplacestovisitinbangalore/Vidhana_Soudha.webp',
  },
  {
    id: '7',
    name: 'Dubai',
    state: 'UAE',
    emoji: '🏙️',
    color: '#FCBAD3',
    photo: 'https://theplanetd.com/images/things-to-do-in-dubai-burj.jpg',
  },
  {
    id: '8',
    name: 'Waterfalls',
    state: 'Anywhere',
    emoji: '🌊',
    color: '#A8D8EA',
    photo: 'https://tse3.mm.bing.net/th/id/OIP.VNqnXCrAgL7nihtCmdcj-gHaE7?rs=1&pid=ImgDetMain&o=7&rm=3',
  },
  {
    id: '9',
    name: 'Vaishno Devi',
    state: 'Jammu',
    emoji: '⛰️',
    color: '#AA96DA',
    photo: 'https://images.jansatta.com/2025/08/How-old-is-Vaishno-Devi-temple.jpg',
  },
  {
    id: '10',
    name: 'Jammu & Kashmir',
    state: 'Heaven',
    emoji: '🏔️',
    color: '#FCBAD3',
    photo: 'https://tse3.mm.bing.net/th/id/OIP.dsggD923b34x68HP_yEYdQHaEI?rs=1&pid=ImgDetMain&o=7&rm=3',
  },
];

function PlaceCard({ place, index, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start(() => onPress(place));
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.placeCard}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <ImageBackground
          source={{ uri: place.photo }}
          style={styles.placeImage}
          imageStyle={{ borderRadius: 20 }}
          blurRadius={2}
        >
          <View style={styles.placeOverlay}>
            <Text style={styles.placeEmoji}>{place.emoji}</Text>
            <Text style={styles.placeName}>{place.name}</Text>
            <Text style={styles.placeState}>{place.state}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
}

function PlaceDetail({ place, onClose }) {
  return (
    <Modal visible={true} transparent={true} animationType="fade">
      <View style={styles.detailOverlay}>
        <ImageBackground
          source={{ uri: place.photo }}
          style={styles.detailImage}
          blurRadius={5}
        >
          <View style={styles.detailOverlay}>
            <View style={styles.detailCard}>
              <Text style={styles.detailEmoji}>{place.emoji}</Text>
              <Text style={[styles.detailName, { color: place.color }]}>{place.name}</Text>
              <Text style={styles.detailState}>{place.state}</Text>
              
              <View style={styles.heartBox}>
                <Text style={styles.heartText}>💔 Ab sirf sapna reh gaya...</Text>
              </View>

              <TouchableOpacity style={[styles.closeBtn, { backgroundColor: place.color }]} onPress={onClose}>
                <Text style={styles.closeText}>✕ Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    </Modal>
  );
}

export default function PlacesScreen() {
  const router = useRouter();
  const [selectedPlace, setSelectedPlace] = useState(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📍 Her Places</Text>
        <View style={{ width: 60 }} />
      </View>

      <Text style={styles.subtitle}>Jahan lekar jaane wale the...</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {PLACES.map((place, index) => (
          <PlaceCard
            key={place.id}
            place={place}
            index={index}
            onPress={setSelectedPlace}
          />
        ))}
        <View style={{ height: 50 }} />
      </ScrollView>

      {selectedPlace && (
        <PlaceDetail
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}
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
    marginBottom: 15,
    fontStyle: 'italic',
  },
  scroll: {
    paddingHorizontal: 15,
  },
  placeCard: {
    height: 180,
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(233, 69, 96, 0.3)',
  },
  placeImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  placeOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    alignItems: 'center',
  },
  placeEmoji: {
    fontSize: 40,
    marginBottom: 5,
  },
  placeName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  placeState: {
    color: '#aaa',
    fontSize: 14,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  detailOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailImage: {
    width: width,
    height: height,
  },
  detailCard: {
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderRadius: 25,
    padding: 30,
    width: width - 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e94560',
  },
  detailEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  detailName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailState: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 20,
  },
  heartBox: {
    marginBottom: 20,
  },
  heartText: {
    color: '#e94560',
    fontSize: 16,
    fontStyle: 'italic',
  },
  closeBtn: {
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});