import React from 'react';
import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useQuery} from '@tanstack/react-query';
import {getPhotosByUser} from '@/services/photoService';
import {galleryQueryKeys} from '@/services/queryKeys';
import {GalleryPhoto} from '@/types';
import {cardBorder, sf} from '@/constants/theme';

const GRID_COLUMNS = 3;
const GRID_COUNT = 6;
const SCREEN_W = Dimensions.get('window').width;
const TILE = (SCREEN_W - 32 - 4) / GRID_COLUMNS;

interface UserPhotoGridProps {
  uid: string;
  onPhotoPress?: (photo: GalleryPhoto, index: number) => void;
}

export function UserPhotoGrid({ uid, onPhotoPress }: UserPhotoGridProps) {
  const { data: photos = [] } = useQuery({
    queryKey: galleryQueryKeys.byUser(uid, GRID_COUNT),
    queryFn: () => getPhotosByUser(uid, GRID_COUNT),
    enabled: !!uid,
  });

  if (photos.length === 0) {
    return (
      <View style={{ alignItems: 'center', paddingTop: 32, paddingBottom: 16, paddingHorizontal: 40 }}>
        <Ionicons name="images-outline" size={36} color={sf.grayMid} style={{ marginBottom: 10, opacity: 0.5 }} />
        <Text style={{ fontSize: 14, fontWeight: '600', color: sf.grayDark, textAlign: 'center' }}>
          No photos yet
        </Text>
        <Text style={{ fontSize: 12, color: sf.grayMid, textAlign: 'center', marginTop: 6, lineHeight: 18 }}>
          Photos will appear here after uploading them from an attended photowalk.
        </Text>
      </View>
    );
  }

  return (
    <View style={{
      flexDirection: 'row', flexWrap: 'wrap',
      paddingHorizontal: 16, gap: 2,
    }}>
      {photos.map((photo, index) => (
        <TouchableOpacity
          key={photo.id}
          activeOpacity={0.88}
          onPress={() => onPhotoPress?.(photo, index)}
          style={{
            width: TILE, height: TILE,
            borderRadius: 16,
            overflow: 'hidden',
            ...cardBorder,
            backgroundColor: sf.grayLight,
          }}
        >
          <Image
            source={{ uri: photo.imageUrl }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}
