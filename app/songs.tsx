import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  ImageBackground,
  Linking,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const SONGS = [
  { id: '1', title: 'Nannaku', artist: 'Her Favorite', color: '#FF6B6B', emoji: '💝' },
  { id: '2', title: 'Pyar Ka Naghma Hai', artist: 'Her Favorite', color: '#4ECDC4', emoji: '🎶' },
  { id: '3', title: 'Jaadugari', artist: 'Her Favorite', color: '#45B7D1', emoji: '✨' },
  { id: '4', title: 'Sawaar Loon', artist: 'Her Favorite', color: '#96CEB4', emoji: '🌙' },
  { id: '5', title: 'Rozana', artist: 'Her Favorite', color: '#FFEAA7', emoji: '🌸' },
  { id: '6', title: 'Lo Maan Liya', artist: 'Her Favorite', color: '#DDA0DD', emoji: '💔' },
  { id: '7', title: 'Tujhe Bhula Diya', artist: 'Her Favorite', color: '#98D8C8', emoji: '😢' },
  { id: '8', title: 'Hasi (Female)', artist: 'Her Favorite', color: '#F7DC6F', emoji: '😊' },
  { id: '9', title: 'Manohari', artist: 'Her Favorite', color: '#BB8FCE', emoji: '💃' },
  { id: '10', title: 'Tera Mera Rishta Pura', artist: 'Her Favorite', color: '#85C1E9', emoji: '💎' },
  { id: '11', title: 'Hairaani', artist: 'Her Favorite', color: '#F8C471', emoji: '🌟' },
  { id: '12', title: 'O Saathi', artist: 'Her Favorite', color: '#82E0AA', emoji: '🤝' },
  { id: '13', title: 'Mujhse Juda Hokar', artist: 'Her Favorite', color: '#F1948A', emoji: '💔' },
  { id: '14', title: 'Saajna', artist: 'Her Favorite', color: '#AED6F1', emoji: '🌹' },
  { id: '15', title: 'Phir Tumko Chaahunga', artist: 'Her Favorite', color: '#F9E79F', emoji: '❤️' },
  { id: '16', title: 'O Khuda', artist: 'Her Favorite', color: '#FF6B6B', emoji: '🙏' },
  { id: '17', title: 'Jo Tum Mere Ho', artist: 'Her Favorite', color: '#4ECDC4', emoji: '💫' },
  { id: '18', title: 'Ishqa Ve', artist: 'Her Favorite', color: '#45B7D1', emoji: '🔥' },
  { id: '19', title: 'Dooron Dooron', artist: 'Her Favorite', color: '#96CEB4', emoji: '🌊' },
  { id: '20', title: 'Tu Hai Jahan', artist: 'Her Favorite', color: '#FFEAA7', emoji: '🌏' },
  { id: '21', title: 'Choo Lo', artist: 'Her Favorite', color: '#DDA0DD', emoji: '🤲' },
  { id: '22', title: 'Tu', artist: 'Her Favorite', color: '#98D8C8', emoji: '💕' },
  { id: '23', title: 'Sajna Da Dil Torya', artist: 'Her Favorite', color: '#F7DC6F', emoji: '💔' },
  { id: '24', title: 'I Think They Call This Love', artist: 'Her Favorite', color: '#BB8FCE', emoji: '💌' },
  { id: '25', title: 'Boyfriend', artist: 'Her Favorite', color: '#85C1E9', emoji: '👫' },
  { id: '26', title: 'Criminal', artist: 'Her Favorite', color: '#F8C471', emoji: '🎭' },
  { id: '27', title: 'Bulleya', artist: 'Her Favorite', color: '#82E0AA', emoji: '🕊️' },
  { id: '28', title: 'Khuda Jaane', artist: 'Her Favorite', color: '#F1948A', emoji: '🌙' },
  { id: '29', title: 'Fakira', artist: 'Her Favorite', color: '#AED6F1', emoji: '🦋' },
  { id: '30', title: 'Ehsaas', artist: 'Her Favorite', color: '#F9E79F', emoji: '💭' },
  { id: '31', title: 'Beqadra', artist: 'Her Favorite', color: '#FF6B6B', emoji: '😔' },
  { id: '32', title: 'Baatein Ye Kabhi Na (Female)', artist: 'Her Favorite', color: '#4ECDC4', emoji: '🌙' },
  { id: '33', title: 'Haale Dil', artist: 'Her Favorite', color: '#45B7D1', emoji: '💔' },
  { id: '34', title: 'Chand Si Mehbooba', artist: 'Her Favorite', color: '#96CEB4', emoji: '🌙' },
  { id: '35', title: 'Baarish', artist: 'Her Favorite', color: '#FFEAA7', emoji: '🌧️' },
  { id: '36', title: 'Sajde', artist: 'Her Favorite', color: '#DDA0DD', emoji: '🙏' },
  { id: '37', title: 'Gallan 4', artist: 'Her Favorite', color: '#98D8C8', emoji: '🎵' },
  { id: '38', title: 'Dil Dooba', artist: 'Her Favorite', color: '#F7DC6F', emoji: '❤️' },
  { id: '39', title: 'Maa', artist: 'Her Favorite', color: '#BB8FCE', emoji: '👩‍👧' },
  { id: '40', title: 'Why This Kolaveri Di', artist: 'Her Favorite', color: '#85C1E9', emoji: '🎤' },
  { id: '41', title: 'Katchi Sera', artist: 'Her Favorite', color: '#F8C471', emoji: '🌊' },
  { id: '42', title: 'Aasa Kooda', artist: 'Her Favorite', color: '#82E0AA', emoji: '💃' },
  { id: '43', title: 'Halkat Jawani', artist: 'Her Favorite', color: '#F1948A', emoji: '🔥' },
  { id: '44', title: 'Mera Pyar Tera Pyar', artist: 'Her Favorite', color: '#AED6F1', emoji: '💕' },
  { id: '45', title: 'Lag Ja Gale (SANAM)', artist: 'Her Favorite', color: '#F9E79F', emoji: '🌹' },
  { id: '46', title: 'Tujhse Naraz Nahi Zindagi', artist: 'Her Favorite', color: '#FF6B6B', emoji: '😔' },
  { id: '47', title: 'Hona Tha Pyar', artist: 'Her Favorite', color: '#4ECDC4', emoji: '💔' },
  { id: '48', title: 'Tujhe Kitna Chahne Lage', artist: 'Her Favorite', color: '#45B7D1', emoji: '❤️' },
  { id: '49', title: 'Woh Lamhe Woh Baatein', artist: 'Her Favorite', color: '#96CEB4', emoji: '🌙' },
  { id: '50', title: 'Teri Deewani', artist: 'Her Favorite', color: '#FFEAA7', emoji: '🔥' },
  { id: '51', title: 'Afghan Jalebi', artist: 'Her Favorite', color: '#DDA0DD', emoji: '🎭' },
  { id: '52', title: 'Tere Ishq Mein', artist: 'Her Favorite', color: '#98D8C8', emoji: '💕' },
  { id: '53', title: 'Raaj Karega Maalik', artist: 'Her Favorite', color: '#F7DC6F', emoji: '👑' },
  { id: '54', title: 'Tere Hawaale', artist: 'Her Favorite', color: '#BB8FCE', emoji: '🌙' },
  { id: '55', title: 'Hasi (Male)', artist: 'Her Favorite', color: '#85C1E9', emoji: '😊' },
  { id: '56', title: 'Sunn Raha Hai', artist: 'Her Favorite', color: '#F8C471', emoji: '🎵' },
  { id: '57', title: 'Husn', artist: 'Her Favorite', color: '#82E0AA', emoji: '✨' },
  { id: '58', title: 'Tera Zikr', artist: 'Her Favorite', color: '#F1948A', emoji: '💭' },
  { id: '59', title: 'Saiyaara', artist: 'Her Favorite', color: '#AED6F1', emoji: '🌟' },
  { id: '60', title: 'Main Rang Sharbaton Ka', artist: 'Her Favorite', color: '#F9E79F', emoji: '🌈' },
  { id: '61', title: 'Zara Sa', artist: 'Her Favorite', color: '#FF6B6B', emoji: '💕' },
  { id: '62', title: 'Aaja Piya Tohe Pyar Doon', artist: 'Her Favorite', color: '#4ECDC4', emoji: '💃' },
  { id: '63', title: 'Milne Hai Mujhse Aayi', artist: 'Her Favorite', color: '#45B7D1', emoji: '🌙' },
  { id: '64', title: 'Phir Mohabbat', artist: 'Her Favorite', color: '#96CEB4', emoji: '❤️' },
  { id: '65', title: 'Tujhe Main Pyar Karu', artist: 'Her Favorite', color: '#FFEAA7', emoji: '💌' },
  { id: '66', title: 'Ek Tarfa (Reprise)', artist: 'Her Favorite', color: '#DDA0DD', emoji: '😢' },
  { id: '67', title: 'Jeena Jeena', artist: 'Her Favorite', color: '#98D8C8', emoji: '✨' },
  { id: '68', title: 'Maalik (Rap)', artist: 'Her Favorite', color: '#F7DC6F', emoji: '🎤' },
  { id: '69', title: 'Ajib Dastan Hai Yeh', artist: 'Her Favorite', color: '#BB8FCE', emoji: '🎭' },
  { id: '70', title: 'Humnava Mere', artist: 'Her Favorite', color: '#85C1E9', emoji: '💕' },
  { id: '71', title: 'Samjho Na', artist: 'Her Favorite', color: '#F8C471', emoji: '🤔' },
  { id: '72', title: 'Pal Pal Dil Ke Paas', artist: 'Her Favorite', color: '#82E0AA', emoji: '❤️' },
  { id: '73', title: 'Baarishein', artist: 'Her Favorite', color: '#F1948A', emoji: '🌧️' },
  { id: '74', title: 'Chhod Kar Abhi Na Jao', artist: 'Her Favorite', color: '#AED6F1', emoji: '😢' },
  { id: '75', title: 'Itna Na Mujhse Tu Pyar Badha', artist: 'Her Favorite', color: '#F9E79F', emoji: '💔' },
  { id: '76', title: 'Beete Huye Lamhon Ki Kasak', artist: 'Her Favorite', color: '#FF6B6B', emoji: '🌙' },
  { id: '77', title: 'Finding Her', artist: 'Her Favorite', color: '#4ECDC4', emoji: '🔍' },
  { id: '78', title: 'Kanule Kanele', artist: 'Her Favorite', color: '#45B7D1', emoji: '🌊' },
  { id: '79', title: 'Dard Dilo Ke', artist: 'Her Favorite', color: '#96CEB4', emoji: '💔' },
  { id: '80', title: 'Enna Sona', artist: 'Her Favorite', color: '#FFEAA7', emoji: '✨' },
  { id: '81', title: 'Tu Har Lamha', artist: 'Her Favorite', color: '#DDA0DD', emoji: '💕' },
  { id: '82', title: 'Saanson Ko', artist: 'Her Favorite', color: '#98D8C8', emoji: '🌬️' },
  { id: '83', title: 'Judaai', artist: 'Her Favorite', color: '#F7DC6F', emoji: '💔' },
  { id: '84', title: 'Khamoshiyan', artist: 'Her Favorite', color: '#BB8FCE', emoji: '🌙' },
  { id: '85', title: 'Ijazat', artist: 'Her Favorite', color: '#85C1E9', emoji: '💌' },
  { id: '86', title: 'Tera Chehra', artist: 'Her Favorite', color: '#F8C471', emoji: '👤' },
  { id: '87', title: 'Hamari Adhuri Kahani', artist: 'Her Favorite', color: '#82E0AA', emoji: '📖' },
  { id: '88', title: 'Badal Barse Kabhi', artist: 'Her Favorite', color: '#F1948A', emoji: '🌧️' },
  { id: '89', title: 'Saath Ho Agar Tum', artist: 'Her Favorite', color: '#AED6F1', emoji: '🤝' },
  { id: '90', title: 'Main Dhoondne Ko', artist: 'Her Favorite', color: '#F9E79F', emoji: '🔍' },
  { id: '91', title: 'Haan Ho Gayi Galti', artist: 'Her Favorite', color: '#FF6B6B', emoji: '😔' },
  { id: '92', title: 'Soch', artist: 'Her Favorite', color: '#4ECDC4', emoji: '💭' },
  { id: '93', title: 'Chain', artist: 'Her Favorite', color: '#45B7D1', emoji: '☮️' },
  { id: '94', title: 'Channa Mereya', artist: 'Her Favorite', color: '#96CEB4', emoji: '💔' },
  { id: '95', title: 'Uska Hi Banana', artist: 'Her Favorite', color: '#FFEAA7', emoji: '💕' },
  { id: '96', title: 'Arz Kiya Hai', artist: 'Her Favorite', color: '#DDA0DD', emoji: '🎭' },
  { id: '97', title: 'Ae Dil Hai Mushkil', artist: 'Her Favorite', color: '#98D8C8', emoji: '💔' },
  { id: '98', title: 'Paro', artist: 'Her Favorite', color: '#F7DC6F', emoji: '💃' },
  { id: '99', title: 'Tera Ban Jaunga', artist: 'Her Favorite', color: '#BB8FCE', emoji: '💎' },
  { id: '100', title: 'Aashiq Tera', artist: 'Her Favorite', color: '#85C1E9', emoji: '❤️' },
  { id: '101', title: 'Tera Ghata', artist: 'Her Favorite', color: '#F8C471', emoji: '💔' },
  { id: '102', title: 'Tera Mera Rishta', artist: 'Her Favorite', color: '#82E0AA', emoji: '💕' },
  { id: '103', title: 'Tere Bina', artist: 'Her Favorite', color: '#F1948A', emoji: '😢' },
  { id: '104', title: 'Tu Meri Hai', artist: 'Her Favorite', color: '#AED6F1', emoji: '💕' },
  { id: '105', title: 'Todo Na', artist: 'Her Favorite', color: '#F9E79F', emoji: '💔' },
  { id: '106', title: 'Sang Hoon Tere', artist: 'Her Favorite', color: '#FF6B6B', emoji: '🤝' },
  { id: '107', title: 'Aap Ki Nazron Ne Samjha', artist: 'Her Favorite', color: '#4ECDC4', emoji: '👀' },
  { id: '108', title: 'Tumko Chahunga', artist: 'Her Favorite', color: '#45B7D1', emoji: '❤️' },
  { id: '109', title: 'Kaun Tujhe', artist: 'Her Favorite', color: '#96CEB4', emoji: '💔' },
  { id: '110', title: 'Inaam', artist: 'Her Favorite', color: '#FFEAA7', emoji: '🎁' },
];

function FloatingBubble({ song, index, onPress }) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const delay = index * 100;
    const duration = 2500 + Math.random() * 1500;

    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    );

    setTimeout(() => float.start(), delay);
    return () => float.stop();
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onPress());
  };

  return (
    <Animated.View
      style={[
        styles.bubbleContainer,
        {
          transform: [
            { translateY },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.bubble, { backgroundColor: song.color + '25', borderColor: song.color }]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text style={styles.bubbleEmoji}>{song.emoji}</Text>
        <Text style={[styles.bubbleTitle, { color: song.color }]} numberOfLines={2}>
          {song.title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function NowPlaying({ song, onClose }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    );
    rotate.start();

    return () => {
      pulse.stop();
      rotate.stop();
    };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const openYouTube = () => {
    const query = encodeURIComponent(`${song.title} song lyrics`);
    Linking.openURL(`https://www.youtube.com/results?search_query=${query}`);
  };

  const openSpotify = () => {
    const query = encodeURIComponent(`${song.title}`);
    Linking.openURL(`https://open.spotify.com/search/${query}`);
  };

  return (
    <View style={styles.nowPlayingOverlay}>
      <View style={styles.nowPlayingCard}>
        <Animated.View style={[styles.nowPlayingOuter, { transform: [{ rotate: spin }] }]}>
          <Animated.View style={[styles.nowPlayingCircle, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.nowPlayingEmoji}>{song.emoji}</Text>
          </Animated.View>
        </Animated.View>

        <Text style={styles.nowPlayingTitle}>{song.title}</Text>
        <Text style={styles.nowPlayingArtist}>Her Favorite Song 💕</Text>

        <View style={styles.musicWaves}>
          {[...Array(7)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.waveBar,
                {
                  height: 15 + Math.random() * 35,
                  backgroundColor: song.color,
                  opacity: 0.7 + Math.random() * 0.3,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.linkButtons}>
          <TouchableOpacity style={[styles.linkBtn, { backgroundColor: '#FF0000' }]} onPress={openYouTube}>
            <Text style={styles.linkText}>▶ YouTube</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.linkBtn, { backgroundColor: '#1DB954' }]} onPress={openSpotify}>
            <Text style={styles.linkText}>🎵 Spotify</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>✕ Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function SongsScreen() {
  const router = useRouter();
  const [selectedSong, setSelectedSong] = useState(null);

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400' }}
      style={styles.container}
      blurRadius={15}
    >
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🎵 Her Songs</Text>
          <View style={{ width: 60 }} />
        </View>

        <Text style={styles.subtitle}>{SONGS.length} songs that remind me of her</Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.bubblesGrid}>
            {SONGS.map((song, index) => (
              <FloatingBubble
                key={song.id}
                song={song}
                index={index}
                onPress={() => setSelectedSong(song)}
              />
            ))}
          </View>
        </ScrollView>

        {selectedSong && (
          <NowPlaying song={selectedSong} onClose={() => setSelectedSong(null)} />
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
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
    fontSize: 26,
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
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  bubblesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  bubbleContainer: {
    margin: 5,
  },
  bubble: {
    width: (width - 60) / 2,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  bubbleEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  bubbleTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 16,
  },
  nowPlayingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  nowPlayingCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 30,
    padding: 35,
    alignItems: 'center',
    width: width - 50,
    borderWidth: 2,
    borderColor: '#e94560',
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  nowPlayingOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#e94560',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  nowPlayingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e94560',
  },
  nowPlayingEmoji: {
    fontSize: 40,
  },
  nowPlayingTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  nowPlayingArtist: {
    fontSize: 13,
    color: '#e94560',
    marginBottom: 25,
    fontStyle: 'italic',
  },
  musicWaves: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 50,
    marginBottom: 25,
    gap: 5,
  },
  waveBar: {
    width: 6,
    borderRadius: 3,
  },
  linkButtons: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  linkBtn: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  linkText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  closeBtn: {
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  closeText: {
    color: '#e94560',
    fontSize: 16,
    fontWeight: '600',
  },
});