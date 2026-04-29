import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts, sf } from '@/constants/theme';

interface EventHeaderProps {
  title: string;
  date: string;
  location: string;
  coverImage: string;
  onBack: () => void;
  onShare?: () => void;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  title, date, location, coverImage, onBack, onShare,
}) => {
  const insets = useSafeAreaInsets();

  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <View style={{ height: 380 }}>
      <Image
        source={{ uri: coverImage }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />

      {/* Gradient overlay */}
      <LinearGradient
        colors={['rgba(242, 220, 194,0)', 'rgba(242, 220, 194,0.6)', 'rgba(242, 220, 194,1)']}
        locations={[0, 0.5, 1]}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 260 }}
      />

      {/* Back button */}
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.8}
        style={{
          position: 'absolute',
          top: insets.top + 12,
          left: 16,
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: 'rgba(33,34,38,0.55)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="chevron-back" size={22} color={sf.cream} />
      </TouchableOpacity>

      {/* Share button */}
      {onShare && (
        <TouchableOpacity
          onPress={onShare}
          activeOpacity={0.8}
          style={{
            position: 'absolute',
            top: insets.top + 12,
            right: 16,
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: 'rgba(33,34,38,0.55)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="share-outline" size={20} color={sf.cream} />
        </TouchableOpacity>
      )}

      {/* Text overlay */}
      <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 }}>
          <Ionicons name="location" size={12} color={sf.orange} />
          <Text style={{ fontSize: 11, color: sf.orange, fontWeight: '700', letterSpacing: 0.5 }}>
            {location.toUpperCase()}
          </Text>
        </View>

        <Text style={{ fontSize: 26, fontWeight: '800', color: sf.black, lineHeight: 32, marginBottom: 10, fontFamily: fonts.heading }}>
          {title}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Ionicons name="calendar-outline" size={13} color={sf.grayDark} style={{ opacity: 0.7 }} />
            <Text style={{ fontSize: 12, color: sf.black, opacity: 0.7 }}>{formattedDate}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Ionicons name="time-outline" size={13} color={sf.grayDark} style={{ opacity: 0.7 }} />
            <Text style={{ fontSize: 12, color: sf.black, opacity: 0.7 }}>{formattedTime}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
