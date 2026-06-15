import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Image, Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRouter} from 'expo-router';
import {LinearGradient} from 'expo-linear-gradient';
import {subscribeToLatestWalk, subscribeToPastWalks} from '@/services/walkService';
import {getUserProfiles} from '@/services/userService';
import {HeroCard} from '@/components/cards/HeroCard';
import {PastCard} from '@/components/cards/PastCard';
import {ScreenHeader} from '@/components/ui/ScreenHeader';
import {Avatar } from '@/components/ui/Avatar';
import {useAuth} from '@/contexts/authContext';
import {cardBorder, fonts, sf} from '@/constants/theme';
import {UserProfile, Walk} from '@/types';

const PLACEHOLDER_AVATAR = 'https://i.pravatar.cc/150?img=0';

export default function HomeScreen() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [latestWalk, setLatestWalk] = useState<Walk | null | undefined>(undefined);
  const [previewProfiles, setPreviewProfiles] = useState<UserProfile[]>([]);
  const [pastWalks, setPastWalks] = useState<Walk[] | undefined>(undefined);
  const prevUidsKeyRef = useRef('');

  useEffect(() => {
    const unsubLatest = subscribeToLatestWalk((walk) => {
      setLatestWalk(walk);

      const validUids = (walk?.participantUids ?? [])
        .filter(uid => uid?.trim().length > 0)
        .slice(0, 3);
      const uidsKey = validUids.join(',');

      if (uidsKey === prevUidsKeyRef.current) return;
      prevUidsKeyRef.current = uidsKey;

      if (validUids.length === 0) {
        setPreviewProfiles([]);
      } else {
        getUserProfiles(validUids).then(setPreviewProfiles);
      }
    });

    const unsubPast = subscribeToPastWalks(setPastWalks);

    return () => {
      unsubLatest();
      unsubPast();
    };
  }, []);

  const avatarUri = userProfile?.profilePhoto || PLACEHOLDER_AVATAR;
  const validParticipantUids = latestWalk
    ? latestWalk.participantUids.filter(uid => uid?.trim().length > 0)
    : [];

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: sf.cream }}>

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 18,
      }}>
        <LinearGradient
          colors={[sf.orange, 'rgba(242, 220, 194,1)']}
          locations={[0, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: 'absolute', left: 0, bottom: 10, width: '100%', height: 52, zIndex: 0,
            pointerEvents: 'none',
          }}
        />
        <Image
          source={require('@/assets/images/sf_logo.jpg')}
          style={{ width: 32, height: 32, borderRadius: 8 }}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 22, fontWeight: '700', color: sf.black, letterSpacing: 1, fontFamily: fonts.heading }}>
          STREET FRAMES
        </Text>
        <Pressable onPress={() => router.push('/(tabs)/profile')} hitSlop={12}>
          <View style={{ borderRadius: 18, borderWidth: 2, borderColor: sf.orange, padding: 1 }}>
            <Avatar
              source={{ uri: avatarUri }}
              size={32}
              isVerified={userProfile?.isVerified}
            />
          </View>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} className='mt-4'>

        {/* Upcoming Walk */}
        <ScreenHeader title="UPCOMING WALKS" style={{ paddingVertical: 0, marginBottom: 14 }} />

        <View >
          {latestWalk === undefined ? (
            <View style={{
              marginHorizontal: 20, marginBottom: 20, borderRadius: 32,
              height: 500, ...cardBorder,
              backgroundColor: sf.grayLight,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <ActivityIndicator size="large" color={sf.orange} />
            </View>
          ) : latestWalk === null ? (
            <View style={{
              marginHorizontal: 20, marginBottom: 20, paddingVertical: 40,
              alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <Text style={{ color: sf.black, fontSize: 20, fontWeight: '600', fontFamily: fonts.heading }}>No upcoming walks yet</Text>
              <Text style={{ color: sf.grayDark, fontSize: 16 }}>Stay tuned</Text>
            </View>
          ) : (
            <HeroCard
              imageUri={latestWalk.coverImage}
              title={latestWalk.title}
              date={latestWalk.date}
              participants={previewProfiles.map(p => ({ avatar: p.profilePhoto || undefined }))}
              participantsCount={validParticipantUids.length}
              onPress={() => router.push(`/event/${latestWalk.id}`)}
            />
          )}
        </View>

        {/* Past Walks */}
        <ScreenHeader
          title="PAST WALKS"
          style={{ paddingVertical: 0, marginTop: 0, marginBottom: 20 }}
          right={
            <Pressable hitSlop={8} onPress={() => router.push('/walks')}>
              <Text style={{ fontSize: 13, color: sf.orange, fontWeight: '600' }}>See all</Text>
            </Pressable>
          }
        />

        <View>
          {pastWalks === undefined ? (
            // Loading skeleton row
            <View style={{ height: 220, alignItems: 'center', justifyContent: 'center', paddingBottom: 120 }}>
              <ActivityIndicator size="small" color={sf.orange} />
            </View>
          ) : pastWalks.length === 0 ? (
            <View style={{
              marginHorizontal: 20, paddingBottom: 120,
              height: 120,
              alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <Text style={{ color: sf.grayDark, fontSize: 14, fontWeight: '600' }}>No past walks yet</Text>
              <Text style={{ color: sf.grayMid, fontSize: 12 }}>Completed walks will appear here</Text>
            </View>
          ) : (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ shadowColor: 'black', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 }}
                contentContainerStyle={{ paddingHorizontal: 20, paddingRight: 50, gap: 12, paddingBottom: 120, marginTop: 2 }}
              >
                {pastWalks.map((walk) => (
                  <PastCard
                    key={walk.id}
                    imageUri={walk.coverImage}
                    title={walk.title}
                    date={walk.date}
                    participants={walk.participantUids.filter(u => u?.trim().length > 0).length}
                    onPress={() => router.push(`/event/${walk.id}`)}
                  />
                ))}
              </ScrollView>
              <LinearGradient
                colors={['rgba(242, 220, 194,0)', 'rgba(242, 220, 194,0.5)', 'rgba(242, 220, 194,1)']}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  position: 'absolute', right: 0, top: 0, bottom: 0, width: 60,
                  pointerEvents: 'none',
                }}
              />
            </>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
