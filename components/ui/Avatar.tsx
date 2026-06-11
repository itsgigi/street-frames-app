import React from 'react';
import { View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sf } from '@/constants/theme';

interface AvatarProps {
  source: { uri: string } | number;
  size?: number;
  className?: string;
  isVerified?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ source, size = 40, className, isVerified }) => {
  const badgeSize = Math.max(12, Math.round(size * 0.32));

  return (
    <View style={{ width: size, height: size }}>
      <View className={`rounded-full overflow-hidden ${className || ''}`} style={{ width: size, height: size }}>
        <Image
          source={source}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      {isVerified && (
        <View style={{
          position: 'absolute', bottom: -2, right: -2,
          backgroundColor: sf.cream, borderRadius: badgeSize / 2,
        }}>
          <Ionicons name="checkmark-circle" size={badgeSize} color={sf.orange} />
        </View>
      )}
    </View>
  );
};
