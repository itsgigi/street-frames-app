import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getWalkGallery } from '@/services/photoService';
import { getUserProfiles } from '@/services/userService';
import { GalleryPhoto, UserProfile } from '@/types';
import { sf, cardBorder } from '@/constants/theme';
import { SectionHeader } from '../ui/SectionHeader';
import { PhotoLightbox } from '../ui/PhotoLightbox';

const GAP = 6;
const MAX_VISIBLE = 4;

interface WalkGalleryProps {
  walkId: string;
  refreshKey?: number;
}

interface UserGroup {
  user: UserProfile | null;
  userId: string;
  photos: GalleryPhoto[];
}

export function WalkGallery({ walkId, refreshKey = 0 }: WalkGalleryProps) {
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [allPhotos, setAllPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    setLoading(true);
    getWalkGallery(walkId).then(async (photos) => {
      setAllPhotos(photos);

      const byUser = new Map<string, GalleryPhoto[]>();
      for (const p of photos) {
        const arr = byUser.get(p.userId) ?? [];
        arr.push(p);
        byUser.set(p.userId, arr);
      }

      const uids = Array.from(byUser.keys());
      const profiles = await getUserProfiles(uids);
      const profileMap = new Map(profiles.map((p) => [p.id, p]));

      setGroups(
        uids.map((uid) => ({
          userId: uid,
          user: profileMap.get(uid) ?? null,
          photos: byUser.get(uid)!,
        }))
      );
    }).finally(() => setLoading(false));
  }, [walkId, refreshKey]);

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
                      <Image
                        source={{ uri: group.user.profilePhoto }}
                        style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: sf.grayLight }}
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
      />
    </View>
  );
}
