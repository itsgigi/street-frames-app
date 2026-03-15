import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Container } from '@/components/ui/Container';
import { EventHeader } from '@/components/features/EventHeader';
import { EventDescription } from '@/components/features/EventDescription';
import { EventMap } from '@/components/features/EventMap';
import { ParticipantsList } from '@/components/features/ParticipantsList';
import { getEventById } from '@/services/mockData';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const event = getEventById(id || '');

  if (!event) {
    return (
      <SafeAreaView className="flex-1 bg-brand-main">
        <View className="bg-brand-main border-b border-gray-300">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center px-4 py-3"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#231a13" />
            <Text className="text-brand-text font-semibold ml-2">Back</Text>
          </TouchableOpacity>
        </View>
        <Container>
          <View className="items-center justify-center py-20">
            <Text className="text-xl text-gray-600">Event not found</Text>
          </View>
        </Container>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-brand-main">
      {/* Back Button Header */}
      <View className="bg-brand-main border-b border-gray-300">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center px-4 py-3"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#231a13" />
          <Text className="text-brand-text font-semibold ml-2">Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        <EventHeader
          title={event.title}
          date={event.date}
          location={event.location}
          coverImage={event.coverImage}
        />
        <Container>
          <EventDescription description={event.description} />
          <EventMap stops={event.stops} />
          <ParticipantsList participants={event.participants} />
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
}
