import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stop } from '@/types';
import { fonts, sf } from '@/constants/theme';

export const STOP_CARD_W = 180;

export function StopCard({ stop, index, isActive }: {
  stop: Stop; index: number; isActive: boolean;
}) {
  return (
    <View style={{
      width: STOP_CARD_W,
      backgroundColor: isActive ? 'rgba(33,34,38,0.92)' : 'rgba(46,47,52,0.82)',
      borderRadius: 14,
      padding: 11,
      borderWidth: 1,
      borderColor: isActive ? sf.orange : 'rgba(255,255,255,0.08)',
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <View style={{
          width: 24, height: 24, borderRadius: 12,
          backgroundColor: isActive ? sf.orange : 'rgba(255,255,255,0.1)',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ color: isActive ? '#fff' : sf.grayDark, fontWeight: '700', fontSize: 11 }}>
            {index + 1}
          </Text>
        </View>
        <Text style={{ fontSize: 14, fontWeight: '700', color: sf.cream, flex: 1, fontFamily: fonts.heading }} numberOfLines={1}>
          {stop.name}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Ionicons name="location-outline" size={11} color={isActive ? sf.orange : sf.grayDark} />
        <Text style={{ fontSize: 10, color: isActive ? sf.orange : sf.grayDark }}>
          {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
        </Text>
      </View>
    </View>
  );
}
