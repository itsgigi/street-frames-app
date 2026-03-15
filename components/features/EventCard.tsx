import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Event } from '@/types';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(`/event/${event.id}`)}
      className="bg-white rounded-lg overflow-hidden shadow-md mb-3 mr-3"
      style={{ width: 280 }}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: event.coverImage }}
        className="w-full h-40"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text className="text-lg font-semibold text-brand-text mb-1" numberOfLines={2}>
          {event.title}
        </Text>
        <Text className="text-gray-600 text-sm">{formatDate(event.date)}</Text>
      </View>
    </TouchableOpacity>
  );
};
