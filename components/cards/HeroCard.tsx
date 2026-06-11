import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Svg, { ClipPath, Defs, G, Image as SvgImage, Path } from 'react-native-svg';
import { sf, fonts } from '@/constants/theme';

// Original design viewBox
const VB_W = 390;
const VB_H = 250;
const MARGIN = 20;

interface HeroCardProps {
  imageUri: string;
  title: string;
  date: string;
  onPress: () => void;
  participants?: { avatar?: string }[];
  participantsCount?: number;
}

export function HeroCard({ imageUri, title, date, onPress }: HeroCardProps) {
  const { width: screenW } = useWindowDimensions();
  const CARD_W = screenW - MARGIN * 2;
  const CARD_H = Math.round(CARD_W * (VB_H / VB_W));

  const dateObj       = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[styles.outer, { height: CARD_H, width: CARD_W }]}>
      <Svg width={CARD_W} height={CARD_H} viewBox={`0 0 ${VB_W} ${VB_H}`} style={{ shadowColor: 'black', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 5 }}>
        <Defs>
          <ClipPath id="heroClip">
            <Path d="M 42 70 L 130 70 L 130 208 A 32 32 0 0 1 98 240 L 42 240 A 32 32 0 0 1 10 208 L 10 102 A 32 32 0 0 1 42 70 Z" />
            <Path d="M 162 10 L 348 10 A 32 32 0 0 1 380 42 L 380 138 A 32 32 0 0 1 348 170 L 130 170 L 130 42 A 32 32 0 0 1 162 10 Z" />
            <G transform="translate(130, 202)">
              <Path d="M 0 0 C 0 -23.872 5.76 -32 32 -32 H 0 Z" />
            </G>
            <G transform="translate(130, 38)">
              <Path d="M 0 0 C 0 23.872 -5.76 32 -32 32 H 0 Z" />
            </G>
          </ClipPath>
        </Defs>
        {/* Stroke drawn UNDER image — inner half covered by image, only outer border visible */}
        <Path d="M 42 70 L 130 70 L 130 208 A 32 32 0 0 1 98 240 L 42 240 A 32 32 0 0 1 10 208 L 10 102 A 32 32 0 0 1 42 70 Z" fill="none" stroke={sf.creamLight} strokeWidth={4} />
        <Path d="M 162 10 L 348 10 A 32 32 0 0 1 380 42 L 380 138 A 32 32 0 0 1 348 170 L 130 170 L 130 42 A 32 32 0 0 1 162 10 Z" fill="none" stroke={sf.creamLight} strokeWidth={4} />
        <G transform="translate(130, 202)">
          <Path d="M 0 0 C 0 -23.872 5.76 -32 32 -32 H 0 Z" fill="none" stroke={sf.creamLight} strokeWidth={4} />
        </G>
        <G transform="translate(130, 38)">
          <Path d="M 0 0 C 0 23.872 -5.76 32 -32 32 H 0 Z" fill="none" stroke={sf.creamLight} strokeWidth={4} />
        </G>
        <SvgImage
          href={imageUri}
          x="0"
          y="0"
          width={VB_W}
          height={VB_H}
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#heroClip)"
        />
      </Svg>

      {/* Date — top left, inside left blob */}
      <View style={styles.dateBadge} className='rounded-xl px-3 py-1.5'>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <Text style={styles.timeText}>{formattedTime}</Text>
      </View>

      {/* Title + arrow — bottom right, inside right blob */}
      <View style={styles.bottomRow}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <TouchableOpacity onPress={onPress} activeOpacity={0.82} style={styles.ctaBtn}>
          <Ionicons name="arrow-forward" size={18} color={sf.orange} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outer: {
    marginLeft: MARGIN,
    marginBottom: MARGIN,
  },

  dateBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(191, 91, 33,0.8)',
    borderWidth: 2,
    borderColor: sf.creamLight,
    shadowColor: 'black', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5
  },
  dateText: {
    fontSize: 12,
    fontWeight: '700',
    color: sf.white,
    letterSpacing: 0.3,
  },
  timeText: {
    fontSize: 10,
    fontWeight: '400',
    color: sf.white,
    opacity: 0.55,
    marginTop: 0,
  },

  bottomRow: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 0,
    gap: 6,
    right: 14,
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.heading,
    color: sf.black,
    lineHeight: 21,
    textAlign: 'right',
    paddingTop: 1,
  },
  ctaBtn: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    marginRight: 2,
  },
});
