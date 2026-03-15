import React from 'react';
import { View, Text } from 'react-native';
import { Avatar } from '@/components/ui/Avatar';

interface ProfileHeaderProps {
  name: string;
  surname: string;
  avatar: string;
  email: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  surname,
  avatar,
  email,
}) => {
  return (
    <View className="bg-white p-6 mb-4 items-center">
      <Avatar source={{ uri: avatar }} size={100} className="mb-4" />
      <Text className="text-2xl font-bold text-brand-text mb-1">
        {name} {surname}
      </Text>
      <Text className="text-gray-600 text-base">{email}</Text>
    </View>
  );
};
