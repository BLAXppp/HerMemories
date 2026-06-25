import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');

const VOICE_NOTES = [
  { id: '1', title: 'Kaun tujhe', date: '2026-06-02', duration: '0:23', source: require('../assets/voice-1.mp3') },
  { id: '2', title: 'saiyara', date: '2026-06-02', duration: '0:15', source: require('../assets/voice-2.mp3') },
  { id: '3', title: 'baate je kabhi na p2', date: '2026-06-02', duration: '0:08', source: require('../assets/voice-3.mp3') },
  { id: '4', title: 'meow meow', date: '2026-06-02', duration: '1:45', source: require('../assets/voice-4.mp3') },
  { id: '5', title: 'hum to chupke', date: '2026-06-02', duration: '0:30', source: require('../assets/voice-5.mp3') },
  { id: '6', title: 'baate je kabhi na pi', date: '2026-06-02', duration: '0:45', source: require('../assets/voice-6.mp3') },
  { id: '7', title: 'baate je kabhi na p3', date: '2026-06-02', duration: '2:10', source: require('../assets/voice-7.mp3') },
  { id: '8', title: 'jaana tu ata ni', date: '2026-06-02', duration: '0:50', source: require('../assets/voice-8.mp3') },
  { id: '9', title: 'ik tum hi ni', date: '2026-06-02', duration: '3:20', source: require('../assets/voice-9.mp3') },
  { id: '10', title: 'tera mera pyar amar', date: '2026-06-02', duration: '1:00', source: require('../assets/voice-10.mp3') },
];

function RotatingDisc({ isPlaying }) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let spinAnim;
    if (isPlaying) {
      spinAnim = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      );
      spinAnim.start();
    } else {
      spinValue.setValue(0);
    }
    return () => {
      if (spinAnim) spinAnim.stop();
    };
  }, [isPlaying]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.disc,
        { transform: [{ rotate: spin }] },
      ]}
    >
      <View style={styles.discInner}>
        <Text style={styles.discIcon}>🎵</Text>
      </View>
    </Animated.View>
  );
}

export default function VoiceScreen() {
  const router = useRouter();
  const [playingId, setPlayingId] = useState(null);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playVoice = async (note) => {
    // If same song is playing, pause it
    if (playingId === note.id) {
      if (sound) {
        await sound.pauseAsync();
      }
      setPlayingId(null);
      return;
    }

    // Stop previous song if playing
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(note.source);
      setSound(newSound);
      setPlayingId(note.id);
      await newSound.playAsync();

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingId(null);
        }
      });
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🎙️ Her Voice</Text>
        <View style={{ width: 60 }} />
      </View>

      <Text style={styles.subtitle}>Her voice is my favorite sound</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {VOICE_NOTES.map((note) => {
          const isPlaying = playingId === note.id;
          return (
            <View key={note.id} style={styles.voiceCard}>
              <View style={styles.voiceInfo}>
                <RotatingDisc isPlaying={isPlaying} />
                <View style={styles.textInfo}>
                  <Text style={styles.voiceTitle}>{note.title}</Text>
                  <Text style={styles.voiceDate}>{note.date} • {note.duration}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.playBtn,
                  isPlaying && styles.playBtnActive,
                ]}
                onPress={() => playVoice(note)}
              >
                <Text style={styles.playText}>
                  {isPlaying ? '⏸ Pause' : '▶ Play'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
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
  scroll: {
    paddingHorizontal: 15,
  },
  voiceCard: {
    backgroundColor: 'rgba(22, 33, 62, 0.8)',
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#0f3460',
  },
  voiceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  disc: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    borderWidth: 2,
    borderColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  discInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discIcon: {
    fontSize: 20,
  },
  textInfo: {
    flex: 1,
  },
  voiceTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  voiceDate: {
    color: '#aaa',
    fontSize: 12,
  },
  playBtn: {
    backgroundColor: '#0f3460',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  playBtnActive: {
    backgroundColor: '#e94560',
  },
  playText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});