import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { ClipPath, Defs, G, Image as SvgImage, Path } from 'react-native-svg';
import { sf, fonts } from '@/constants/theme';

// Card display size
const CARD_H = 220;
const CARD_W = 360;

// Original SVG size (for coordinate calculations)
const SVG_W = 400;

// Original design viewBox
const VB_W = 410;
const VB_H = 230;

interface HeroCardProps {
  imageUri: string;
  title: string;
  date: string;
  onPress: () => void;
  participants?: { avatar?: string }[];
  participantsCount?: number;
}

export function HeroCard({ imageUri, title, date, onPress }: HeroCardProps) {
  const dateObj       = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.outer}>
      {/* SVG renders image clipped to the puzzle shape */}
      <Svg width={CARD_W} height={CARD_H} viewBox={`0 0 ${VB_W} ${VB_H}`}>
        <Defs>
          <ClipPath id="heroClip">
            <Path d="M 42 60 L 200 60 L 200 60 L 200 188 A 32 32 0 0 1 168 220 L 42 220 A 32 32 0 0 1 10 188 L 10 92 A 32 32 0 0 1 42 60 Z" />
            <Path d="M 300 10 L 368 10 A 32 32 0 0 1 400 42 L 400 138 A 32 32 0 0 1 368 170 L 300 170 L 300 170 L 300 10 L 300 10 Z" />
            <Path d="M 122 10 L 300 10 L 300 10 L 300 60 L 300 60 L 100 60 L 100 60 L 100 32 A 22 22 0 0 1 122 10 Z" />
            <Path d="M 200 60 L 300 60 L 300 60 L 300 170 L 300 170 L 200 170 L 200 170 L 200 60 L 200 60 Z" />
            <G transform="translate(100, 38)">
              <Path d="M 0 0 C 0 16.412 -3.96 22 -22 22 H 0 Z" />
            </G>
            <G transform="translate(200, 202)">
              <Path d="M 0 0 C 0 -23.872 5.76 -32 32 -32 H 0 Z" />
            </G>
            <G transform="translate(300, 82)">
              <Path d="M 0 0 C 0 -16.412 -3.96 -22 -22 -22 H 0 Z" />
            </G>
            <G transform="translate(300, 28)">
              <Path d="M 0 0 C 0 23.872 -5.76 32 -32 32 H 0 Z" />
            </G>
            <G transform="translate(200, 82)">
              <Path d="M 0 0 C 0 -16.412 3.96 -22 22 -22 H 0 Z" />
            </G>
            <G transform="translate(200, 82)">
              <Path d="M 0 0 C 0 -16.412 -3.96 -22 -22 -22 H 0 Z" />
            </G>
          </ClipPath>
        </Defs>
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
      <View style={styles.dateBadge}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    marginLeft: 20,
    marginBottom: 20,
    height: CARD_H,
    width: CARD_W,
  },

  dateBadge: {
    position: 'absolute',
    top: 20,
    left: 18,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '700',
    color: sf.black,
    letterSpacing: 0.3,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '400',
    color: sf.black,
    opacity: 0.55,
    marginTop: 2,
  },

  

  bottomRow: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    // inside right panel bottom area — right panel bottom ~y=170, right ~x=400
    bottom: 0,
    gap: 6,
    right: Math.round((SVG_W - 400) * (CARD_W / SVG_W)) + 14,
  },
  title: {
    fontSize: 17,
    fontFamily: fonts.heading,
    color: sf.black,
    lineHeight: 21,
    textAlign: 'right',
    marginBottom: 10,
  },
  ctaBtn: {
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:35,
    marginRight: 2,
  },
});
