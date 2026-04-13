import React from 'react';
import { ScrollView, View, Text, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { nextEvent, pastEvents } from '@/services/mockData';
import { HeroCard } from '@/components/cards/HeroCard';
import { PastCard } from '@/components/cards/PastCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { fonts, sf } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: sf.cream }}>

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 18
      }}>
        <LinearGradient
          colors={[sf.orange, 'rgba(242, 220, 194,1)']}
          locations={[0, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: 'absolute', left: 0, bottom: 10, width: "100%", height: 52, zIndex: 0,
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
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
            style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: sf.orange }}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        className='mt-4'
      >
        {/* Upcoming Walks */}
        <ScreenHeader title="UPCOMING WALKS" style={{ paddingVertical: 0, marginBottom: 20 }} />

        <View style={{ shadowColor: 'black', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 7 }}>
          <HeroCard
            imageUri={nextEvent.coverImage}
            title={nextEvent.title}
            date={nextEvent.date}
            participants={nextEvent.participants}
            participantsCount={nextEvent.participantsCount}
            onPress={() => router.push(`/event/${nextEvent.id}`)}
          />
        </View>

        {/* Past Walks */}
        <ScreenHeader
          title="PAST WALKS"
          style={{ paddingVertical: 0, marginTop: 10, marginBottom: 20 }}
          right={
            <Pressable hitSlop={8}>
              <Text style={{ fontSize: 13, color: sf.orange, fontWeight: '600' }}>See all</Text>
            </Pressable>
          }
        />

        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ shadowColor: 'black', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 }}
            contentContainerStyle={{ paddingHorizontal: 20, paddingRight: 50, gap: 12, paddingBottom: 120, marginTop: 2 }}
          >
            {pastEvents.map((event) => (
              <PastCard
                key={event.id}
                imageUri={event.coverImage}
                title={event.title}
                date={event.date}
                participants={event.participantsCount}
                onPress={() => router.push(`/event/${event.id}`)}
              />
            ))}
          </ScrollView>
          <LinearGradient
            colors={['rgba(	242, 220, 194,0)', 'rgba(	242, 220, 194,0.5)', 'rgba(	242, 220, 194,1)']}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: 60,
              pointerEvents: 'none',
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
