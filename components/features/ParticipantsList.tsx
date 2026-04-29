import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from '@/types';
import { fonts, sf } from '@/constants/theme';
import { PhotographersModal } from './PhotographersModal';

const MAX_VISIBLE = 6;
const PLACEHOLDER = 'https://i.pravatar.cc/150?img=0';

interface ParticipantsListProps {
  participants: UserProfile[];
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants }) => {
  const [modalVisible, setModalVisible] = useState(false);

  if (participants.length === 0) {
    return (
      <View style={{ backgroundColor: sf.white, borderRadius: 16, padding: 16, alignItems: 'center' }}>
        <Text style={{ color: sf.grayDark, fontSize: 14 }}>No participants yet — be the first!</Text>
      </View>
    );
  }

  const visible = participants.slice(0, MAX_VISIBLE);
  const overflow = participants.length - MAX_VISIBLE;

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setModalVisible(true)}
        style={{ backgroundColor: sf.white, borderRadius: 16, overflow: 'hidden' }}
      >
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: sf.black, letterSpacing: 0.5, opacity: 0.6, fontFamily: fonts.heading }}>
            PHOTOGRAPHERS ({participants.length})
          </Text>
          <Ionicons name="chevron-forward" size={14} color={sf.grayMid} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 14 }}
        >
          {visible.map((p) => (
            <View key={p.id} style={{ alignItems: 'center', gap: 5 }}>
              <View style={{
                width: 52, height: 52, borderRadius: 26,
                borderWidth: 2, borderColor: sf.orange, overflow: 'hidden',
              }}>
                <Image
                  source={{ uri: p.profilePhoto || PLACEHOLDER }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </View>
              <Text style={{ fontSize: 10, color: sf.black, opacity: 0.75, fontWeight: '600', maxWidth: 52 }} numberOfLines={1}>
                {p.name.split(' ')[0]}
              </Text>
            </View>
          ))}

          {overflow > 0 && (
            <View style={{ alignItems: 'center', gap: 5 }}>
              <View style={{
                width: 52, height: 52, borderRadius: 26,
                backgroundColor: sf.grayLight,
                alignItems: 'center', justifyContent: 'center',
                borderWidth: 2, borderColor: sf.orange,
              }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: sf.grayDark }}>+{overflow}</Text>
              </View>
              <Text style={{ fontSize: 10, color: sf.grayDark, maxWidth: 52 }} numberOfLines={1}>more</Text>
            </View>
          )}
        </ScrollView>
      </TouchableOpacity>

      <PhotographersModal
        visible={modalVisible}
        participants={participants}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
};
