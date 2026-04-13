import React, { useState } from 'react';
import {
  ScrollView, View, Text, Image, TouchableOpacity, Pressable, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { mockPhotos, pastEvents } from '@/services/mockData';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import { fonts, sf } from '@/constants/theme';

const SCREEN_W = Dimensions.get('window').width;
const TILE = (SCREEN_W - 32 - 4) / 3; // 3 columns, 16px padding each side, 4px gaps

const MOCK_USER = {
  name: 'Marco Rossi',
  handle: '@marco.frames',
  avatar: 'https://i.pravatar.cc/150?img=1',
  bio: 'Street photographer · Milan 📸 · Chasing golden light through Navigli.',
  photos: 42,
  events: 17,
  followers: 284,
};

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'featured' | 'events'>('featured');
  const { logout } = useAuthMethods();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: sf.cream }}>

      {/* ── Header ── */}
      <ScreenHeader
        title="PROFILE"
        left={
          <Pressable hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color={sf.black} />
          </Pressable>
        }
        right={
          <Pressable hitSlop={12}>
            <Ionicons name="ellipsis-horizontal" size={24} color={sf.black} />
          </Pressable>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* ── Avatar + name ── */}
        <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 20 }}>
          {/* Avatar with orange ring */}
          <View style={{
            width: 96, height: 96, borderRadius: 48,
            borderWidth: 3, borderColor: sf.orange,
            padding: 3, marginBottom: 14,
          }}>
            <Image
              source={{ uri: MOCK_USER.avatar }}
              style={{ width: '100%', height: '100%', borderRadius: 44 }}
            />
          </View>

          <Text style={{ fontSize: 22, fontWeight: '700', color: sf.black, marginBottom: 2, fontFamily: fonts.heading }}>
            {MOCK_USER.name}
          </Text>
          <Text style={{ fontSize: 13, color: sf.grayDark, marginBottom: 10 }}>
            {MOCK_USER.handle}
          </Text>
          <Text style={{
            fontSize: 13, color: sf.grayDark, textAlign: 'center',
            lineHeight: 20, paddingHorizontal: 40, marginBottom: 20,
          }}>
            {MOCK_USER.bio}
          </Text>

          {/* Stats row */}
          <View style={{ flexDirection: 'row', gap: 36, marginBottom: 20 }}>
            {[
              { label: 'Photos', value: MOCK_USER.photos },
              { label: 'Events', value: MOCK_USER.events },
              { label: 'Followers', value: MOCK_USER.followers },
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
          {(['featured', 'events'] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{ flex: 1, alignItems: 'center', paddingBottom: 12 }}
            >
              <Text style={{
                fontSize: 16, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', fontFamily: fonts.heading,
                color: activeTab === tab ? sf.black : sf.grayDark,
              }}>
                {tab === 'featured' ? 'Featured' : 'My Walks'}
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
            elevation: 2
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

        {/* ── Events tab ── */}
        {activeTab === 'events' && (
          <View style={{ paddingHorizontal: 20, gap: 14,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 5,
            elevation: 2, }}>
            {pastEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
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
                    source={{ uri: event.coverImage }}
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
                        {event.location.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: sf.white, marginBottom: 5, fontFamily: fonts.heading }} numberOfLines={1}>
                      {event.title}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                      <Ionicons name="calendar-outline" size={11} color={sf.cream} style={{ opacity: 0.6 }} />
                      <Text style={{ fontSize: 11, color: sf.cream, opacity: 0.6 }}>
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="people-outline" size={11} color={sf.cream} style={{ opacity: 0.6 }} />
                      <Text style={{ fontSize: 11, color: sf.cream, opacity: 0.6 }}>
                        {event.participantsCount} photographers
                      </Text>
                    </View>
                  </View>
                  <View style={{ justifyContent: 'center', paddingRight: 14 }}>
                    <Ionicons name="chevron-forward" size={16} color={sf.grayDark} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
