import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, ScrollView, Pressable, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { getUserProfile } from '@/services/userService';
import { UserProfile } from '@/types';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { sf, fonts } from '@/constants/theme';

const PLACEHOLDER_AVATAR = 'https://i.pravatar.cc/150?img=0';

export default function UserProfileScreen() {
  const { uid } = useLocalSearchParams<{ uid: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!uid) return;
    getUserProfile(uid).then((result) => {
      if (result) {
        setProfile(result);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    });
  }, [uid]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: sf.cream, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={sf.orange} />
      </SafeAreaView>
    );
  }

  if (notFound || !profile) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: sf.cream }}>
        <ScreenHeader
          title="PROFILE"
          left={
            <Pressable onPress={() => router.back()} hitSlop={12}>
              <Ionicons name="chevron-back" size={24} color={sf.black} />
            </Pressable>
          }
        />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
          <Ionicons name="person-outline" size={48} color={sf.grayMid} style={{ marginBottom: 16 }} />
          <Text style={{ fontSize: 16, color: sf.grayDark, textAlign: 'center' }}>
            User not found.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const avatarUri = profile.profilePhoto || PLACEHOLDER_AVATAR;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: sf.cream }}>
      <ScreenHeader
        title={profile.handle ? `@${profile.handle}` : 'PROFILE'}
        left={
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color={sf.black} />
          </Pressable>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
        <View style={{ alignItems: 'center', paddingTop: 24, paddingBottom: 24 }}>
          <View style={{
            width: 96, height: 96, borderRadius: 48,
            borderWidth: 3, borderColor: sf.orange,
            padding: 3, marginBottom: 14,
          }}>
            <Image
              source={{ uri: avatarUri }}
              style={{ width: '100%', height: '100%', borderRadius: 44 }}
            />
          </View>

          <Text style={{ fontSize: 22, fontWeight: '700', color: sf.black, marginBottom: 2, fontFamily: fonts.heading }}>
            {profile.name}
          </Text>
          <Text style={{ fontSize: 13, color: sf.grayDark, marginBottom: 12 }}>
            @{profile.handle}
          </Text>

          {profile.biography.length > 0 && (
            <Text style={{
              fontSize: 13, color: sf.grayDark, textAlign: 'center',
              lineHeight: 20, paddingHorizontal: 40,
            }}>
              {profile.biography}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
