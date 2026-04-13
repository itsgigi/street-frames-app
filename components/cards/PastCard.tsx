import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fonts, sf } from '@/constants/theme';

interface PastCardProps {
  imageUri: string;
  title: string;
  date: string;
  participants: number;
  onPress: () => void;
}

export function PastCard({ imageUri, title, date, participants, onPress }: PastCardProps) {
  return (
    <View  style={{
        borderRadius: 35,
        overflow: 'hidden',
        width: 200,
        borderWidth: 6,
        borderColor: 'white'
      }}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.88}
        style={{ borderRadius: 18, overflow: 'hidden' }}
      >
        <Image
          source={{ uri: imageUri }}
          style={{ width: '100%', aspectRatio: 3 / 4 }}
          resizeMode="cover"
        />
        <View style={{
          position: 'absolute', bottom: 10, left: 8, right: 8,
          backgroundColor: 'rgba(33,34,38,0.82)',
          borderRadius: 12, padding: 10,
        }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: 'white', marginBottom: 4, fontFamily: fonts.heading }} numberOfLines={1}>
            {title}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 }}>
            <Ionicons name="calendar-outline" size={11} color={sf.cream} style={{ opacity: 0.6 }} />
            <Text style={{ fontSize: 11, color: 'white', opacity: 0.6 }}>
              {new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="people-outline" size={11} color={sf.cream} style={{ opacity: 0.6 }} />
            <Text style={{ fontSize: 11, color: 'white', opacity: 0.6 }}>{participants} photographers</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
