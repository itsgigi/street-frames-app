import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';

interface EventHeaderProps {
  title: string;
  date: string;
  location: string;
  coverImage: string;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  title,
  date,
  location,
  coverImage,
}) => {
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
    <View className="bg-white">
      <Image
        source={{ uri: coverImage }}
        className="w-full h-64"
        resizeMode="cover"
      />
      <View className="p-4">
        <Text className="text-3xl font-bold text-brand-text mb-3">{title}</Text>
        <View className="mb-2">
          <Text className="text-gray-600 text-base">📅 {formatDate(date)}</Text>
        </View>
        <View>
          <Text className="text-gray-600 text-base">📍 {location}</Text>
        </View>
      </View>
    </View>
  );
};
