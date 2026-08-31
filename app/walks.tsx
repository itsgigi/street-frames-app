import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { subscribeToAllWalks } from '@/services/walkService';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { RefreshableScrollView } from '@/components/ui/RefreshableScrollView';
import { WalkCard } from '@/components/features/WalkCard';
import { sf } from '@/constants/theme';
import { Walk } from '@/types';

export default function WalksScreen() {
  const router = useRouter();
  const [walks, setWalks] = useState<Walk[] | undefined>(undefined);

  useEffect(() => {
    return subscribeToAllWalks(setWalks);
  }, []);

  const now = new Date();

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

      {walks === undefined ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={sf.orange} />
        </View>
      ) : walks.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Text style={{ color: sf.black, fontSize: 18, fontWeight: '600' }}>No walks yet</Text>
        </View>
      ) : (
        <RefreshableScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 16, paddingBottom: 40, shadowColor: 'black', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 5 }}
        >
          {walks.map((walk) => (
            <WalkCard
              key={walk.id}
              walk={walk}
              isUpcoming={new Date(walk.date) > now}
              onPress={() => router.push(`/event/${walk.id}`)}
            />
          ))}
        </RefreshableScrollView>
      )}
    </SafeAreaView>
  );
}
