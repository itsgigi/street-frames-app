import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Walk } from '@/types';
import { fonts, sf } from '@/constants/theme';
import { getValidParticipantUids } from '@/services/participantUtils';

const CARD_PAD = 18;
const CARD_H = 110;

export function WalkCard({ walk, isUpcoming, onPress }: {
  walk: Walk; isUpcoming: boolean; onPress: () => void;
}) {
  const participantsCount = getValidParticipantUids(walk.participantUids).length;

  return (
    <View style={{
      backgroundColor: sf.black,
      borderRadius: 35,
      borderColor: sf.creamLight,
      borderWidth: 3,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    }}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>

        <View style={{
          flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
          paddingHorizontal: CARD_PAD, paddingTop: CARD_PAD, paddingBottom: 14,
        }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 }}>
              <Ionicons name="location" size={12} color={sf.orange} />
              <Text style={{ fontSize: 11, color: sf.orange, fontWeight: '700', letterSpacing: 0.5 }}>
                {walk.location.toUpperCase()}
              </Text>
            </View>
            <Text style={{ fontSize: 17, fontWeight: '700', color: sf.white, marginBottom: 4, fontFamily: fonts.heading }}>
              {walk.title}
            </Text>
            <Text style={{ fontSize: 12, color: sf.grayDark }}>
              {new Date(walk.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              {' · '}{participantsCount} photographers
            </Text>
          </View>
          {isUpcoming && (
            <View style={{
              backgroundColor: sf.orange + '22',
              paddingHorizontal: 9, paddingVertical: 4, borderRadius: 100,
              borderWidth: 1, borderColor: sf.orange, marginLeft: 10,
            }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: sf.orange, letterSpacing: 0.5 }}>UPCOMING</Text>
            </View>
          )}
        </View>

        <View style={{
          height: CARD_H,
          paddingLeft: CARD_PAD,
          paddingRight: CARD_PAD,
          paddingBottom: CARD_PAD,
        }}>
          <View style={{
            flex: 1, borderRadius: 12,
            shadowColor: sf.grayDark, shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15, shadowRadius: 3, elevation: 3,
          }}>
            <Image source={{ uri: walk.coverImage }} style={{ flex: 1, borderRadius: 12 }} resizeMode="cover" />
          </View>
        </View>

      </TouchableOpacity>
    </View>
  );
}
