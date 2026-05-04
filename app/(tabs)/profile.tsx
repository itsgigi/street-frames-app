import React, { useEffect, useState } from 'react';
import {
  ScrollView, View, Text, Image, TouchableOpacity, Pressable,
  Dimensions, ActivityIndicator, Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { mockPhotos } from '@/services/mockData';
import { subscribeToUserWalks } from '@/services/walkService';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import { useAuth } from '@/contexts/authContext';
import { Walk } from '@/types';
import { fonts, sf } from '@/constants/theme';

const SCREEN_W = Dimensions.get('window').width;
const TILE = (SCREEN_W - 32 - 4) / 3;

const PLACEHOLDER_AVATAR = 'https://i.pravatar.cc/150?img=0';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'featured' | 'walks'>('featured');
  const [userWalks, setUserWalks] = useState<Walk[]>([]);
  const { logout } = useAuthMethods();
  const { userProfile, user, loading } = useAuth();

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToUserWalks(user.uid, setUserWalks);
    return unsub;
  }, [user]);

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
          <Pressable hitSlop={12}>
            <Ionicons name="ellipsis-horizontal" size={24} color={sf.black} />
          </Pressable>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* ── Avatar + name ── */}
        <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 20 }}>
          <View style={{
            width: 96, height: 96, borderRadius: 48,
            borderWidth: 3, borderColor: sf.orange,
            padding: 3, marginBottom: 14,
          }}>
            <Image
              source={{ uri: displayAvatar }}
              style={{ width: '100%', height: '100%', borderRadius: 44 }}
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
              { label: 'Photos', value: mockPhotos.length },
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
          {(['featured', 'walks'] as const).map((tab) => (
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
                {tab === 'featured' ? 'Featured' : 'Walks'}
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

        {/* ── Featured: photo grid ── */}
        {activeTab === 'featured' && (
          <View style={{
            flexDirection: 'row', flexWrap: 'wrap',
            paddingHorizontal: 16, gap: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 2,
          }}>
            {mockPhotos.map((photo) => (
              <TouchableOpacity
                key={photo.id}
                activeOpacity={0.88}
                style={{
                  width: TILE, height: TILE,
                  borderRadius: 20,
                  overflow: 'hidden',
                  borderWidth: 3,
                  borderColor: sf.white,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.12,
                  shadowRadius: 6,
                  elevation: 4,
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
        )}

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
                      borderRadius: 28,
                      borderWidth: 4,
                      borderColor: sf.white,
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

        {/* ── Logout ── */}
        <TouchableOpacity
          onPress={logout}
          style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
            marginHorizontal: 20, marginTop: 32,
            paddingVertical: 14, borderRadius: 100,
            borderWidth: 1.5, borderColor: 'rgba(33,34,38,0.10)',
            backgroundColor: sf.white,
            marginBottom: 60,
          }}
          activeOpacity={0.75}
        >
          <Ionicons name="log-out-outline" size={18} color={sf.grayDark} />
          <Text style={{ fontSize: 13, fontWeight: '600', color: sf.grayDark }}>Sign out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
