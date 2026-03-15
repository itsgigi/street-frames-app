import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Event } from '@/types';

interface ProfileEventCardProps {
  event: Event;
}

export const ProfileEventCard: React.FC<ProfileEventCardProps> = ({ event }) => {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(`/event/${event.id}`)}
      className="bg-white rounded-lg overflow-hidden shadow-md mr-3"
      style={{ width: 200 }}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: event.coverImage }}
        className="w-full h-32"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text className="text-base font-semibold text-brand-text mb-1" numberOfLines={2}>
          {event.title}
        </Text>
        <Text className="text-gray-600 text-xs">{formatDate(event.date)}</Text>
      </View>
    </TouchableOpacity>
  );
};
