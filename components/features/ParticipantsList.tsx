import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { User } from '@/types';
import { fonts, sf } from '@/constants/theme';

interface ParticipantsListProps {
  participants: User[];
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants }) => {
  if (participants.length === 0) {
    return (
      <View style={{ backgroundColor: sf.white, borderRadius: 16, padding: 16, alignItems: 'center' }}>
        <Text style={{ color: sf.grayDark, fontSize: 14 }}>No participants yet</Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: sf.white, borderRadius: 16, overflow: 'hidden' }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: sf.black, letterSpacing: 0.5, opacity: 0.6,  fontFamily: fonts.heading }}>
          PHOTOGRAPHERS ({participants.length})
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 16 }}
      >
        {participants.map((p) => (
          <View key={p.id} style={{ alignItems: 'center', gap: 6 }}>
            <View style={{
              width: 56, height: 56, borderRadius: 28,
              borderWidth: 2, borderColor: sf.orange, overflow: 'hidden',
            }}>
              <Image source={{ uri: p.avatar }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            </View>
            <Text style={{ fontSize: 11, color: sf.black, opacity: 0.8, fontWeight: '600' }} numberOfLines={1}>
              {p.name}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
