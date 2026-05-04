import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { nextEvent, pastEvents } from '@/services/mockData';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { WalkCard } from '@/components/features/WalkCard';
import { sf } from '@/constants/theme';

const ALL_EVENTS = [nextEvent, ...pastEvents];

export default function WalksScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: sf.cream }}>

      <ScreenHeader
        title="PHOTOWALKS"
        left={
          <TouchableOpacity hitSlop={12} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color={sf.black} />
          </TouchableOpacity>
        }
        right={
          <TouchableOpacity hitSlop={12}>
            <Ionicons name="search-outline" size={24} color={sf.black} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 16, paddingBottom: 40 }}
      >
        {ALL_EVENTS.map((event, idx) => (
          <WalkCard
            key={event.id}
            event={event}
            isUpcoming={idx === 0}
            onPress={() => router.push(`/event/${event.id}`)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
