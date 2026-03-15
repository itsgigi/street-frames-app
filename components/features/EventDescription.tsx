import React from 'react';
import { View, Text } from 'react-native';

interface EventDescriptionProps {
  description: string;
}

export const EventDescription: React.FC<EventDescriptionProps> = ({ description }) => {
  return (
    <View className="bg-white p-4 mb-4">
      <Text className="text-lg font-semibold text-brand-text mb-2">About this event</Text>
      <Text className="text-gray-700 text-base leading-6">{description}</Text>
    </View>
  );
};
