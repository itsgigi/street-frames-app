import React from 'react';
import { View, Text } from 'react-native';
import { fonts, sf } from '@/constants/theme';

interface EventDescriptionProps {
  description: string;
}

export const EventDescription: React.FC<EventDescriptionProps> = ({ description }) => {
  return (
    <View style={{ backgroundColor: sf.white, borderRadius: 16, padding: 16 }}>
      <Text style={{ fontSize: 13, fontWeight: '700', color: sf.black, letterSpacing: 0.5, marginBottom: 10, opacity: 0.6, fontFamily: fonts.heading }}>
        ABOUT THIS WALK
      </Text>
      <Text style={{ fontSize: 14, color: sf.black, lineHeight: 22, opacity: 0.85 }}>
        {description}
      </Text>
    </View>
  );
};
