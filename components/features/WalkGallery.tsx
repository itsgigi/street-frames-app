import React, { useMemo, useState } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWalkGallery, deletePhoto } from '@/services/photoService';
import { getUserProfileMap } from '@/services/userService';
import { galleryQueryKeys, userQueryKeys } from '@/services/queryKeys';
import { GalleryPhoto, UserProfile } from '@/types';
import { sf, cardBorder } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import { SectionHeader } from '../ui/SectionHeader';
import { PhotoLightbox } from '../ui/PhotoLightbox';
import { Avatar } from '../ui/Avatar';

const GAP = 6;
const MAX_VISIBLE = 4;

interface WalkGalleryProps {
  walkId: string;
}

interface UserGroup {
  user: UserProfile | null;
  userId: string;
  photos: GalleryPhoto[];
}

export function WalkGallery({ walkId }: WalkGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: allPhotos = [], isLoading: loadingPhotos } = useQuery({
    queryKey: galleryQueryKeys.walk(walkId),
    queryFn: () => getWalkGallery(walkId),
  });

  const uids = useMemo(
    () => Array.from(new Set(allPhotos.map((p) => p.userId))),
    [allPhotos],
  );

  const { data: profileMap, isLoading: loadingProfiles } = useQuery({
    queryKey: userQueryKeys.profiles(uids),
    queryFn: () => getUserProfileMap(uids),
    enabled: uids.length > 0,
  });

  const loading = loadingPhotos || (uids.length > 0 && loadingProfiles);

  const groups: UserGroup[] = useMemo(() => {
    const byUser = new Map<string, GalleryPhoto[]>();
    for (const p of allPhotos) {
      const arr = byUser.get(p.userId) ?? [];
      arr.push(p);
      byUser.set(p.userId, arr);
    }

    return uids.map((uid) => ({
      userId: uid,
      user: profileMap?.get(uid) ?? null,
      photos: byUser.get(uid)!,
    }));
  }, [allPhotos, uids, profileMap]);

  const deleteMutation = useMutation({
    mutationFn: (photoId: string) => {
      if (!user) throw new Error('Sign in required');
      return deletePhoto(photoId, user.uid);
    },
    onSuccess: () => {
      setSelectedIndex(null);
      void queryClient.invalidateQueries({ queryKey: galleryQueryKeys.walk(walkId) });
      void queryClient.invalidateQueries({ queryKey: galleryQueryKeys.all });
    },
    onError: () => {
      Alert.alert('Delete failed', 'Unable to delete photo right now. Please try again.');
    },
  });

  const handleDeleteRequest = (photoId: string) => {
    Alert.alert('Delete photo', 'This photo will be permanently removed.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMutation.mutate(photoId) },
    ]);
  };

  const itemSize = containerWidth > 0
    ? (containerWidth - GAP * (MAX_VISIBLE - 1)) / MAX_VISIBLE
    : 0;

  return (
    <View style={{ backgroundColor: sf.white, borderRadius: 16, padding: 16 }}>
      <SectionHeader>WALK PHOTOS</SectionHeader>

      {loading ? (
        <ActivityIndicator color={sf.orange} style={{ paddingVertical: 24 }} />
      ) : (
        <View
          onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
          style={{ gap: 20 }}
        >
          {allPhotos.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 32, gap: 8 }}>
              <Ionicons name="images-outline" size={36} color={sf.grayLight} />
              <Text style={{ color: sf.grayDark, fontSize: 14 }}>No photos yet</Text>
            </View>
          ) : itemSize > 0 ? (
            groups.map((group) => {
              return (
                <View key={group.userId} style={{ gap: 10 }}>
                  {/* User header */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    {group.user?.profilePhoto ? (
                      <Avatar
                        source={{ uri: group.user.profilePhoto }}
                        size={28}
                        isVerified={group.user?.isVerified}
                      />
                    ) : (
                      <View style={{
                        width: 28, height: 28, borderRadius: 14,
                        backgroundColor: sf.grayLight,
                        alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Ionicons name="person" size={14} color={sf.grayDark} />
                      </View>
                    )}
                    <View>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: sf.black }}>
                        {group.user?.name ?? 'Unknown'}
                      </Text>
                      {group.user?.handle && (
                        <Text style={{ fontSize: 11, color: sf.grayDark }}>
                          @{group.user.handle}
                        </Text>
                      )}
                    </View>
                    <Text style={{ marginLeft: 'auto', fontSize: 11, color: sf.grayDark }}>
                      {group.photos.length} {group.photos.length === 1 ? 'photo' : 'photos'}
                    </Text>
                  </View>

                  {/* Single-row photo strip */}
                  <View style={{ flexDirection: 'row', gap: GAP }}>
                    {group.photos.slice(0, MAX_VISIBLE).map((photo, idx) => {
                      const globalIndex = allPhotos.findIndex((p) => p.id === photo.id);
                      const isLast = idx === MAX_VISIBLE - 1 && group.photos.length > MAX_VISIBLE;
                      const overflow = group.photos.length - MAX_VISIBLE;
                      return (
                        <TouchableOpacity
                          key={photo.id}
                          activeOpacity={0.85}
                          onPress={() => setSelectedIndex(globalIndex)}
                          style={{ position: 'relative' }}
                        >
                          <Image
                            source={{ uri: photo.imageUrl }}
                            style={{ width: itemSize, height: itemSize, borderRadius: 12, ...cardBorder }}
                            resizeMode="cover"
                          />
                          {isLast && (
                            <View style={{
                              position: 'absolute', inset: 0,
                              borderRadius: 12,
                              backgroundColor: 'rgba(0,0,0,0.5)',
                              alignItems: 'center', justifyContent: 'center',
                            }}>
                              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>
                                +{overflow}
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })
          ) : null}
        </View>
      )}

      <PhotoLightbox
        photos={allPhotos}
        selectedIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onPrev={() => setSelectedIndex((i) => (i !== null ? i - 1 : i))}
        onNext={() => setSelectedIndex((i) => (i !== null ? i + 1 : i))}
        onDelete={handleDeleteRequest}
        currentUserId={user?.uid}
        deleting={deleteMutation.isPending}
      />
    </View>
  );
}
