import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator, Share, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { EventHeader } from '@/components/features/EventHeader';
import { EventDescription } from '@/components/features/EventDescription';
import { EventMap } from '@/components/features/EventMap';
import { ParticipantsList } from '@/components/features/ParticipantsList';
import { WalkGallery } from '@/components/features/WalkGallery';
import { getEventById } from '@/services/mockData';
import { uploadWalkPhoto } from '@/services/photoService';
import { subscribeToWalkById, joinWalk, leaveWalk } from '@/services/walkService';
import { getUserProfiles } from '@/services/userService';
import { useAuth } from '@/contexts/authContext';
import { Walk, UserProfile } from '@/types';
import { sf } from '@/constants/theme';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  // Try mock data first — if found, it's a past event
  const mockEvent = getEventById(id ?? '');

  // Firestore walk state (only used when mockEvent is null)
  const [walk, setWalk] = useState<Walk | null | undefined>(mockEvent ? null : undefined);
  const [participants, setParticipants] = useState<UserProfile[]>([]);
  const [joining, setJoining] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);

  // Track previous uid list to avoid redundant fetches
  const prevUidsRef = useRef<string>('');

  useEffect(() => {
    if (mockEvent || !id) return;

    const unsub = subscribeToWalkById(id, (w) => {
      setWalk(w);

      if (!w) return;
      const uidsKey = [...w.participantUids].sort().join(',');
      if (uidsKey === prevUidsRef.current) return;
      prevUidsRef.current = uidsKey;

      getUserProfiles(w.participantUids).then(setParticipants);
    });

    return unsub;
  }, [id]);

  const makeShareMessage = (title: string, date: string, location: string) => {
    const dateStr = new Date(date).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    });
    return `Join me at "${title}" on ${dateStr} in ${location}! 📷 #StreetFrames`;
  };

  const handleJoinLeave = async () => {
    if (!user || !walk) return;
    setJoining(true);
    try {
      const alreadyJoined = walk.participantUids.includes(user.uid);
      if (alreadyJoined) {
        await leaveWalk(walk.id, user.uid);
      } else {
        await joinWalk(walk.id, user.uid);
      }
    } finally {
      setJoining(false);
    }
  };

  const handleUploadImage = async (walkId: string) => {

    if (!user) {
      Alert.alert('Sign in required', 'Please sign in to upload an image.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photo library in Settings.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 0.85,
    });

    if (result.canceled) return;

    setUploading(true);
    try {
      await uploadWalkPhoto({
        localUri: result.assets[0].uri,
        userId: user.uid,
        walkId,
        tags: [],
      });
      setUploadCount((c) => c + 1);
      Alert.alert('Uploaded', 'Your image was uploaded successfully.');
    } catch {
      Alert.alert('Upload failed', 'Unable to upload right now. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // ── Mock event (past walks) ──────────────────────────────────────────────
  if (mockEvent) {
    const isUpcoming = new Date(mockEvent.date) > new Date();
    return (
      <View style={{ flex: 1, backgroundColor: sf.cream }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <EventHeader
            title={mockEvent.title}
            date={mockEvent.date}
            location={mockEvent.location}
            coverImage={mockEvent.coverImage}
            onBack={() => router.back()}
            onShare={() => Share.share({
              message: makeShareMessage(mockEvent.title, mockEvent.date, mockEvent.location),
              title: mockEvent.title,
            })}
          />
          <View style={{ paddingHorizontal: 20, paddingTop: 24, gap: 16 }}>
            <View style={shadow}>
              <EventDescription description={mockEvent.description} />
            </View>
            <View style={shadow}>
              <WalkGallery walkId={mockEvent.id} refreshKey={uploadCount} />
            </View>
            <View style={shadow}>
              <ParticipantsList participants={[]} />
            </View>
          </View>
        </ScrollView>
        {isUpcoming && <JoinBar onPress={() => {}} joining={false} isPast={false} joined={false} insetBottom={insets.bottom} />}
        <UploadBar
          onPress={() => handleUploadImage(mockEvent.id)}
          uploading={uploading}
          insetBottom={insets.bottom}
        />
      </View>
    );
  }

  // ── Loading Firestore walk ───────────────────────────────────────────────
  if (walk === undefined) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: sf.cream, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={sf.orange} />
      </SafeAreaView>
    );
  }

  // ── Walk not found ───────────────────────────────────────────────────────
  if (walk === null) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: sf.cream, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: sf.grayDark, fontSize: 16 }}>Walk not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: sf.orange, fontWeight: '600' }}>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── Live Firestore walk ──────────────────────────────────────────────────
  const isPast  = new Date(walk.date) <= new Date();
  const joined  = !!user && walk.participantUids.includes(user.uid);

  return (
    <View style={{ flex: 1, backgroundColor: sf.cream }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <EventHeader
          title={walk.title}
          date={walk.date}
          location={walk.location}
          coverImage={walk.coverImage}
          onBack={() => router.back()}
          onShare={() => Share.share({
            message: makeShareMessage(walk.title, walk.date, walk.location),
            title: walk.title,
          })}
        />
        <View style={{ paddingHorizontal: 20, paddingTop: 24, gap: 16 }}>
          <View style={shadow}>
            <EventDescription description={walk.description} />
          </View>
          <View style={shadow}>
            {isPast ? <WalkGallery walkId={walk.id} refreshKey={uploadCount} /> : <EventMap stops={walk.stops} />}
          </View>
          <View style={shadow}>
            <ParticipantsList participants={participants} />
          </View>
        </View>
      </ScrollView>

      {isPast ? (
        <UploadBar
          onPress={() => handleUploadImage(walk.id)}
          uploading={uploading}
          insetBottom={insets.bottom}
        />
      ) : (
        <JoinBar
          onPress={handleJoinLeave}
          joining={joining}
          joined={joined}
          isPast={false}
          insetBottom={insets.bottom}
        />
      )}
    </View>
  );
}

function UploadBar({ onPress, uploading, insetBottom }: {
  onPress: () => void;
  uploading: boolean;
  insetBottom: number;
}) {
  return (
    <View style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingHorizontal: 20,
      paddingBottom: insetBottom + 12,
      paddingTop: 12,
      backgroundColor: sf.cream,
      borderTopWidth: 1,
      borderTopColor: 'rgba(33,34,38,0.08)',
    }}>
      <TouchableOpacity
        onPress={onPress}
        disabled={uploading}
        activeOpacity={0.85}
        style={{
          backgroundColor: sf.orange,
          borderRadius: 100,
          paddingVertical: 16,
          alignItems: 'center',
        }}
      >
        {uploading ? (
          <ActivityIndicator color={sf.cream} />
        ) : (
          <Text style={{
            fontSize: 15, fontWeight: '700',
            color: sf.cream,
            letterSpacing: 0.3,
          }}>
            Upload an image
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

/* ── Join / Leave bar ─────────────────────────────────────────────────────── */

function JoinBar({ onPress, joining, joined, isPast, insetBottom }: {
  onPress: () => void;
  joining: boolean;
  joined: boolean;
  isPast: boolean;
  insetBottom: number;
}) {
  // Past event + already joined → read-only "attended" badge
  if (isPast && joined) {
    return (
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        paddingHorizontal: 20,
        paddingBottom: insetBottom + 12,
        paddingTop: 12,
        backgroundColor: sf.cream,
        borderTopWidth: 1,
        borderTopColor: 'rgba(33,34,38,0.08)',
      }}>
        <View style={{
          backgroundColor: sf.white,
          borderRadius: 100,
          paddingVertical: 16,
          alignItems: 'center',
          borderWidth: 2,
          borderColor: sf.grayLight,
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
        }}>
          <Ionicons name="checkmark-circle" size={18} color={sf.orange} />
          <Text style={{ fontSize: 15, fontWeight: '700', color: sf.grayDark, letterSpacing: 0.3 }}>
            You attended this walk
          </Text>
        </View>
      </View>
    );
  }

  // Past event + not joined → show nothing
  if (isPast) return null;

  // Upcoming event → join / leave
  return (
    <View style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingHorizontal: 20,
      paddingBottom: insetBottom + 12,
      paddingTop: 12,
      backgroundColor: sf.cream,
      borderTopWidth: 1,
      borderTopColor: 'rgba(33,34,38,0.08)',
    }}>
      <TouchableOpacity
        onPress={onPress}
        disabled={joining}
        activeOpacity={0.85}
        style={{
          backgroundColor: joined ? sf.white : sf.orange,
          borderRadius: 100,
          paddingVertical: 16,
          alignItems: 'center',
          borderWidth: joined ? 2 : 0,
          borderColor: sf.orange,
        }}
      >
        {joining ? (
          <ActivityIndicator color={joined ? sf.orange : sf.cream} />
        ) : (
          <Text style={{
            fontSize: 15, fontWeight: '700',
            color: joined ? sf.orange : sf.cream,
            letterSpacing: 0.3,
          }}>
            {joined ? 'Leave this walk' : 'Join this walk'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const shadow = {
  shadowColor: 'black',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.1,
  shadowRadius: 5,
} as const;
