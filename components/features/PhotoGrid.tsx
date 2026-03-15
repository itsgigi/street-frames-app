import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Photo } from '@/types';

interface PhotoGridProps {
  photos: Photo[];
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ photos }) => {
  if (photos.length === 0) {
    return (
      <View className="bg-white p-4 mb-4 rounded-lg">
        <Text className="text-gray-500 text-center">No photos yet</Text>
      </View>
    );
  }

  return (
    <View className="bg-white mb-4 rounded-lg p-4">
      <Text className="text-lg font-semibold text-brand-text mb-4">My Photos</Text>
      <View className="flex-row flex-wrap justify-between">
        {photos.map((photo) => (
          <TouchableOpacity
            key={photo.id}
            style={styles.photoItem}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: photo.imageUrl }}
              style={styles.photoImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  photoItem: {
    width: '31%',
    aspectRatio: 1,
    marginBottom: '2%',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});
