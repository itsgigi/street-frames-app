import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Event } from '@/types';

interface NextEventCardProps {
  event: Event;
}

export const NextEventCard: React.FC<NextEventCardProps> = ({ event }) => {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(`/event/${event.id}`)}
      className="bg-white rounded-xl overflow-hidden shadow-lg mb-4"
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: event.coverImage }}
        className="w-full h-48"
        resizeMode="cover"
      />
      <View className="p-4">
        <Text className="text-xl font-bold text-brand-text mb-2">{event.title}</Text>
        <View className="flex-row items-center mb-2">
          <Text className="text-gray-700 text-sm">📅 {formatDate(event.date)}</Text>
        </View>
        <View className="flex-row items-center mb-2">
          <Text className="text-gray-700 text-sm">📍 {event.location}</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-brand-secondary font-semibold text-sm">
            👥 {event.participantsCount} participants
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
