import React from 'react';
import { View, Image, ImageProps } from 'react-native';

interface AvatarProps {
  source: { uri: string } | number;
  size?: number;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ source, size = 40, className }) => {
  return (
    <View className={`rounded-full overflow-hidden ${className || ''}`} style={{ width: size, height: size }}>
      <Image
        source={source}
        className="w-full h-full"
        resizeMode="cover"
      />
    </View>
  );
};
