import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getWalkGallery } from '@/services/photoService';
import { getUserProfiles } from '@/services/userService';
import { GalleryPhoto, UserProfile } from '@/types';
import { sf } from '@/constants/theme';
import { SectionHeader } from '../ui/SectionHeader';
import { PhotoLightbox } from '../ui/PhotoLightbox';

const GAP = 4;
const COLS = 3;

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
    ? (containerWidth - GAP * (COLS - 1)) / COLS
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
              const rows: GalleryPhoto[][] = [];
              for (let i = 0; i < group.photos.length; i += COLS) {
                rows.push(group.photos.slice(i, i + COLS));
              }

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

                  {/* Photo grid for this user */}
                  <View style={{ gap: GAP }}>
                    {rows.map((row, ri) => (
                      <View key={ri} style={{ flexDirection: 'row', gap: GAP }}>
                        {row.map((photo) => {
                          const globalIndex = allPhotos.findIndex((p) => p.id === photo.id);
                          return (
                            <TouchableOpacity
                              key={photo.id}
                              activeOpacity={0.85}
                              onPress={() => setSelectedIndex(globalIndex)}
                            >
                              <Image
                                source={{ uri: photo.imageUrl }}
                                style={{ width: itemSize, height: itemSize, borderRadius: 8 }}
                                resizeMode="cover"
                              />
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    ))}
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
