import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { EventHeader } from '@/components/features/EventHeader';
import { EventDescription } from '@/components/features/EventDescription';
import { EventMap } from '@/components/features/EventMap';
import { ParticipantsList } from '@/components/features/ParticipantsList';
import { getEventById } from '@/services/mockData';
import { sf } from '@/constants/theme';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const event = getEventById(id || '');

  if (!event) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: sf.cream, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: sf.grayDark, fontSize: 16 }}>Event not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: sf.orange, fontWeight: '600' }}>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isUpcoming = new Date(event.date) > new Date();

  return (
    <View style={{ flex: 1, backgroundColor: sf.cream }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <EventHeader
          title={event.title}
          date={event.date}
          location={event.location}
          coverImage={event.coverImage}
          onBack={() => router.back()}
        />

        <View style={{ paddingHorizontal: 20, paddingTop: 24, gap: 16 }}>
          <View         
            style={{ shadowColor: 'black', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 5 }}
          >
            <EventDescription description={event.description} />
          </View>
          <View         
            style={{ shadowColor: 'black', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 5 }}
          >
            <EventMap stops={event.stops} />
          </View>
          <View         
            style={{ shadowColor: 'black', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 5 }}
          >
            <ParticipantsList participants={event.participants} />
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      {isUpcoming && (
        <View style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 12,
          paddingTop: 12,
          backgroundColor: sf.cream,
          borderTopWidth: 1,
          borderTopColor: 'rgba(33,34,38,0.08)',
        }}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={{
              backgroundColor: sf.orange,
              borderRadius: 100,
              paddingVertical: 16,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: '700', color: sf.cream, letterSpacing: 0.3 }}>
              Join this walk
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
