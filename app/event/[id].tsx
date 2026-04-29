import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { EventHeader } from '@/components/features/EventHeader';
import { EventDescription } from '@/components/features/EventDescription';
import { EventMap } from '@/components/features/EventMap';
import { ParticipantsList } from '@/components/features/ParticipantsList';
import { getEventById } from '@/services/mockData';
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
          />
          <View style={{ paddingHorizontal: 20, paddingTop: 24, gap: 16 }}>
            <View style={shadow}>
              <EventDescription description={mockEvent.description} />
            </View>
            <View style={shadow}>
              <EventMap stops={mockEvent.stops} />
            </View>
            <View style={shadow}>
              <ParticipantsList participants={[]} />
            </View>
          </View>
        </ScrollView>
        {isUpcoming && <JoinBar onPress={() => {}} joining={false} joined={false} insetBottom={insets.bottom} />}
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
  const isUpcoming = new Date(walk.date) > new Date();
  const joined = !!user && walk.participantUids.includes(user.uid);

  return (
    <View style={{ flex: 1, backgroundColor: sf.cream }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <EventHeader
          title={walk.title}
          date={walk.date}
          location={walk.location}
          coverImage={walk.coverImage}
          onBack={() => router.back()}
        />
        <View style={{ paddingHorizontal: 20, paddingTop: 24, gap: 16 }}>
          <View style={shadow}>
            <EventDescription description={walk.description} />
          </View>
          <View style={shadow}>
            <EventMap stops={walk.stops} />
          </View>
          <View style={shadow}>
            <ParticipantsList participants={participants} />
          </View>
        </View>
      </ScrollView>

      {isUpcoming && (
        <JoinBar
          onPress={handleJoinLeave}
          joining={joining}
          joined={joined}
          insetBottom={insets.bottom}
        />
      )}
    </View>
  );
}

/* ── Join / Leave bar ─────────────────────────────────────────────────────── */

function JoinBar({ onPress, joining, joined, insetBottom }: {
  onPress: () => void;
  joining: boolean;
  joined: boolean;
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
