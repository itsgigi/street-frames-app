import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';
import { User } from '@/types';

interface ParticipantsListProps {
  participants: User[];
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants }) => {
  if (participants.length === 0) {
    return (
      <View className="bg-white p-4 mb-4 rounded-lg">
        <Text className="text-gray-500 text-center">No participants yet</Text>
      </View>
    );
  }

  return (
    <View className="bg-white mb-4 rounded-lg">
      <View className="p-4 border-b border-gray-200">
        <Text className="text-lg font-semibold text-brand-text">
          Participants ({participants.length})
        </Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-4">
        {participants.map((participant) => (
          <View key={participant.id} className="items-center mr-4">
            <Avatar
              source={{ uri: participant.avatar }}
              size={60}
              className="mb-2"
            />
            <Text className="text-sm font-medium text-brand-text text-center" numberOfLines={1}>
              {participant.name}
            </Text>
            <Text className="text-xs text-gray-600 text-center" numberOfLines={1}>
              {participant.surname}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
