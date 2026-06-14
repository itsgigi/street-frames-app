import React, { useEffect, useState } from 'react';
import {
  ScrollView, View, Text, Image, TouchableOpacity, Pressable,
  ActivityIndicator, Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getPhotosByUser } from '@/services/photoService';
import { galleryQueryKeys } from '@/services/queryKeys';
import { subscribeToUserWalks } from '@/services/walkService';
import { UserPhotoGrid } from '@/components/features/UserPhotoGrid';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import { useAuth } from '@/contexts/authContext';
import { Walk } from '@/types';
import { fonts, sf, cardBorder } from '@/constants/theme';

const PLACEHOLDER_AVATAR = 'https://i.pravatar.cc/150?img=0';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'walks' | 'admin'>('walks');
  const [userWalks, setUserWalks] = useState<Walk[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuthMethods();
  const { userProfile, user, loading } = useAuth();

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToUserWalks(user.uid, setUserWalks);
    return unsub;
  }, [user]);

  const { data: userPhotos = [] } = useQuery({
    queryKey: galleryQueryKeys.byUser(user?.uid ?? '', 6),
    queryFn: () => getPhotosByUser(user!.uid, 6),
    enabled: !!user,
  });

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: sf.cream, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={sf.orange} />
      </SafeAreaView>
    );
  }

  const displayName   = userProfile?.name ?? '';
  const displayHandle = userProfile?.handle ? `@${userProfile.handle}` : '';
  const displayBio    = userProfile?.biography ?? '';
  const displayAvatar = userProfile?.profilePhoto || PLACEHOLDER_AVATAR;

  const handleShare = () => {
    if (!userProfile) return;
    Share.share({
      message: `Check out ${displayName} (${displayHandle}) on Street Frames! 📷`,
      title: displayName,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: sf.cream }}>

      {/* ── Header ── */}
      <ScreenHeader
        title="PROFILE"
        right={
          <View style={{ position: 'relative' }}>
            <Pressable
              hitSlop={12}
              onPress={() => setMenuOpen(!menuOpen)}
            >
              <Ionicons name="ellipsis-vertical" size={24} color={sf.black} />
            </Pressable>
            {menuOpen && (
              <Pressable
                style={{
                  position: 'absolute', top: 36, right: 0, zIndex: 1000,
                  backgroundColor: sf.white,
                  borderRadius: 8,
                  minWidth: 180,
                  borderWidth: 1, borderColor: 'rgba(33,34,38,0.1)',
                  ...shadow,
                }}
                onPress={() => {}}
              >
                <TouchableOpacity
                  onPress={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  style={{
                    paddingHorizontal: 16, paddingVertical: 12,
                    flexDirection: 'row', alignItems: 'center', gap: 10,
                  }}
                >
                  <Ionicons name="log-out-outline" size={18} color={sf.grayDark} />
                  <Text style={{ fontSize: 13, fontWeight: '600', color: sf.grayDark }}>
                    Sign out
                  </Text>
                </TouchableOpacity>
              </Pressable>
            )}
          </View>
        }
      />
      {menuOpen && (
        <Pressable
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
          onPress={() => setMenuOpen(false)}
        />
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* ── Avatar + name ── */}
        <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 20 }}>
          <View style={{
            width: 96, height: 96, borderRadius: 48,
            borderWidth: 3, borderColor: sf.orange,
            padding: 3, marginBottom: 14,
          }}>
            <Avatar
              source={{ uri: displayAvatar }}
              size={84}
              isVerified={userProfile?.isVerified}
            />
          </View>

          <Text style={{ fontSize: 22, fontWeight: '700', color: sf.black, marginBottom: 2, fontFamily: fonts.heading }}>
            {displayName}
          </Text>
          <Text style={{ fontSize: 13, color: sf.grayDark, marginBottom: 10 }}>
            {displayHandle}
          </Text>
          {displayBio.length > 0 && (
            <Text style={{
              fontSize: 13, color: sf.grayDark, textAlign: 'center',
              lineHeight: 20, paddingHorizontal: 40, marginBottom: 20,
            }}>
              {displayBio}
            </Text>
          )}

          {/* Stats row */}
          <View style={{ flexDirection: 'row', gap: 36, marginBottom: 20 }}>
            {[
              { label: 'Photos', value: userPhotos.length },
              { label: 'Walks',  value: userWalks.length },
            ].map(({ label, value }) => (
              <View key={label} style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: sf.black }}>{value}</Text>
                <Text style={{ fontSize: 12, color: sf.grayDark, marginTop: 2 }}>{label}</Text>
              </View>
            ))}
          </View>

          {/* Action buttons */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              onPress={() => router.push('/edit-profile')}
              style={{
                backgroundColor: sf.orange,
                paddingHorizontal: 28, paddingVertical: 12,
                borderRadius: 100, minWidth: 130, alignItems: 'center',
              }}
              activeOpacity={0.85}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: sf.cream, letterSpacing: 0.3 }}>
                Edit Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShare}
              style={{
                borderWidth: 2, borderColor: sf.orange,
                paddingHorizontal: 24, paddingVertical: 12,
                borderRadius: 100, alignItems: 'center',
              }}
              activeOpacity={0.85}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: sf.orange, letterSpacing: 0.3 }}>
                Share
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Tabs ── */}
        <View style={{
          flexDirection: 'row',
          borderBottomWidth: 1, borderBottomColor: 'rgba(33,34,38,0.10)',
          marginHorizontal: 20, marginBottom: 16,
        }}>
          {(userProfile?.isVerified ? (['walks', 'admin'] as const) : (['walks'] as const)).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{ flex: 1, alignItems: 'center', paddingBottom: 12 }}
            >
              <Text style={{
                fontSize: 16, fontWeight: '700', letterSpacing: 0.8,
                textTransform: 'uppercase', fontFamily: fonts.heading,
                color: activeTab === tab ? sf.black : sf.grayDark,
              }}>
                {tab === 'walks' ? 'Walks' : 'Admin'}
              </Text>
              {activeTab === tab && (
                <View style={{
                  position: 'absolute', bottom: 0,
                  height: 2, width: '60%', backgroundColor: sf.orange, borderRadius: 2,
                }} />
              )}
            </Pressable>
          ))}
        </View>

        {/* ── Walks tab ── */}
        {activeTab === 'walks' && (
          userWalks.length === 0 ? (
            <View style={{ alignItems: 'center', paddingTop: 48, paddingHorizontal: 40 }}>
              <Ionicons name="map-outline" size={40} color={sf.grayDark} style={{ marginBottom: 12, opacity: 0.4 }} />
              <Text style={{ fontSize: 15, fontWeight: '600', color: sf.grayDark, textAlign: 'center' }}>
                No walks yet
              </Text>
              <Text style={{ fontSize: 13, color: sf.grayMid, textAlign: 'center', marginTop: 6 }}>
                Join a walk to see it here
              </Text>
            </View>
          ) : (
            <View style={{
              paddingHorizontal: 20, gap: 14,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.4,
              shadowRadius: 5,
              elevation: 2,
            }}>
              {userWalks.map((walk) => {
                const isPast = new Date(walk.date) <= new Date();
                return (
                  <TouchableOpacity
                    key={walk.id}
                    onPress={() => router.push(`/event/${walk.id}`)}
                    activeOpacity={0.88}
                    style={{
                      backgroundColor: sf.black,
                      borderRadius: 22,
                      ...cardBorder,
                      overflow: 'hidden',
                    }}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      <Image
                        source={{ uri: walk.coverImage }}
                        style={{ width: 120, height: 90 }}
                        resizeMode="cover"
                      />
                      <LinearGradient
                        colors={['rgba(33,34,38,1)', 'rgba(33,34,38,0.7)', 'rgba(33,34,38,0)']}
                        start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}
                        style={{ position: 'absolute', top: 0, left: 70, bottom: 0, width: 50, height: 90, zIndex: 100 }}
                      />
                      <View style={{ flex: 1, padding: 14, justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                          <Ionicons name="location" size={11} color={sf.orange} />
                          <Text style={{ fontSize: 10, color: sf.orange, fontWeight: '700', letterSpacing: 0.5 }}>
                            {walk.location.toUpperCase()}
                          </Text>
                        </View>
                        <Text
                          style={{ fontSize: 14, fontWeight: '700', color: sf.white, marginBottom: 5, fontFamily: fonts.heading }}
                          numberOfLines={1}
                        >
                          {walk.title}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                          <Ionicons name="calendar-outline" size={11} color={sf.cream} style={{ opacity: 0.6 }} />
                          <Text style={{ fontSize: 11, color: sf.cream, opacity: 0.6 }}>
                            {new Date(walk.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Ionicons name="people-outline" size={11} color={sf.cream} style={{ opacity: 0.6 }} />
                          <Text style={{ fontSize: 11, color: sf.cream, opacity: 0.6 }}>
                            {walk.participantUids.length} photographers
                          </Text>
                        </View>
                      </View>
                      <View style={{ justifyContent: 'center', paddingRight: 14, gap: 4 }}>
                        {isPast && (
                          <Ionicons name="checkmark-circle" size={14} color={sf.orange} />
                        )}
                        <Ionicons name="chevron-forward" size={16} color={sf.grayDark} />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )
        )}

        {/* ── Admin tab ── */}
        {activeTab === 'admin' && (
          <View style={{ paddingHorizontal: 20, gap: 14 }}>
            <TouchableOpacity
              onPress={() => router.push('/create-walk' as any)}
              activeOpacity={0.85}
              style={{
                backgroundColor: sf.orange,
                borderRadius: 22,
                paddingVertical: 16,
                alignItems: 'center', justifyContent: 'center',
                flexDirection: 'row', gap: 8,
              }}
            >
              <Ionicons name="add-circle-outline" size={20} color={sf.cream} />
              <Text style={{ fontSize: 14, fontWeight: '700', color: sf.cream, fontFamily: fonts.heading, letterSpacing: 0.5 }}>
                Create Walk
              </Text>
            </TouchableOpacity>
          </View>
        )}


      </ScrollView>
    </SafeAreaView>
  );
}

const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
  elevation: 3,
} as const;

