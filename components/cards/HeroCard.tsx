import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, G, Line, Path, Rect } from 'react-native-svg';
import { sf, fonts } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

const CARD_H   = 500;
const PANEL_H  = 175;   // fixed panel height
const MAP_W    = 140;   // right map column width

const BTN_SIZE = 50;
const BTN_PAD  = 10;    // button inset from panel bottom-right corner
// Distance from panel corner to button center
const BTN_CX   = BTN_PAD + BTN_SIZE / 2;   // 35
// Concave arc radius = button center distance + gap so the arc hugs the button
const BITE_R   = BTN_CX + 24;               // 44

// SVG clip-path: rectangle with a concave quarter-circle cut from bottom-right.
// Arc is centered at the exact bottom-right corner of the map (MAP_W, PANEL_H).
// It leaves the right edge at y = PANEL_H - BITE_R and arrives at the bottom at x = MAP_W - BITE_R.
// sweep-flag = 0 → counter-clockwise → concave (inward) curve.
const CLIP_D = `M0,0 L${MAP_W},0 L${MAP_W},${PANEL_H - BITE_R} A${BITE_R},${BITE_R} 0 0,0 ${MAP_W - BITE_R},${PANEL_H} L0,${PANEL_H} Z`;

const MAX_VISIBLE_AVATARS = 3;

interface HeroCardProps {
  imageUri: string;
  title: string;
  date: string;
  onPress: () => void;
  participants?: { avatar?: string }[];
  participantsCount?: number;
}

export function HeroCard({
  imageUri,
  title,
  date,
  onPress,
  participants = [],
  participantsCount = 0,
}: HeroCardProps) {
  const dateObj       = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const visibleAvatars = participants.slice(0, MAX_VISIBLE_AVATARS);
  const overflowCount  = participantsCount - visibleAvatars.length;

  return (
    <View style={styles.card}>

      {/* ── Full-bleed photo ── */}
      <Image
        source={{ uri: imageUri }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      {/* ── Heart button — top left ── */}
      <View style={styles.heartBtn}>
        <BlurView tint="light" intensity={28} style={styles.blurBtn}>
          <Ionicons name="heart-outline" size={18} color="#fff" />
        </BlurView>
      </View>

      {/* ── Date/time badge — top right ── */}
      <View style={styles.timeBadge}>
        <Ionicons name="flame" size={13} color="white" />
        <Text style={styles.timeBadgeText}>{formattedDate} · {formattedTime}</Text>
      </View>

      {/* ── Floating white panel — bottom ── */}
      <View style={styles.panel}>
        <LinearGradient
          start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}
          colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0)']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 40 }}
        />

        {/* Left: label + title + avatars */}
        <View style={styles.panelLeft}>
          <Text style={styles.panelLabel}>NEXT WALK</Text>
          <Text style={styles.panelTitle} numberOfLines={2}>{title}</Text>

          <View style={styles.avatarRow}>
            {visibleAvatars.map((p, i) => (
              <Image
                key={i}
                source={{ uri: p.avatar ?? `https://i.pravatar.cc/150?img=${i + 1}` }}
                style={[styles.avatar, i > 0 && styles.avatarOffset]}
              />
            ))}
            {overflowCount > 0 && (
              <View style={[styles.avatar, styles.avatarOffset, styles.avatarOverflow]}>
                <Text style={styles.avatarOverflowText}>+{overflowCount}</Text>
              </View>
            )}
          </View>
        </View>

        {/*
          Right: SVG map with concave bottom-right corner baked via ClipPath.
          The clip path is a rectangle with a circular arc cut from the bottom-right.
        */}
        <Svg width={MAP_W} height={PANEL_H}>
          <Defs>
            <ClipPath id="mapShape">
              <Path d={CLIP_D}/>
            </ClipPath>
          </Defs>

          <G clipPath="url(#mapShape)">
            {/* Map base */}
            <Rect x="0" y="0" width={MAP_W} height={PANEL_H} fill="#EDE0C4" />

            {/* Green patches */}
            <Rect x="8"  y="10" width="38" height="22" rx="7" fill="#C8D8A8" fillOpacity="0.6" />
            <Rect x="80" y="55" width="46" height="28" rx="6" fill="#C8D8A8" fillOpacity="0.5" />
            <Rect x="22" y="88" width="28" height="16" rx="4" fill="#D4C090" fillOpacity="0.7" />

            {/* Grid */}
            <Path d={`M0,${PANEL_H * 0.33} H${MAP_W}`}  stroke="#D0BC98" strokeWidth="0.7" />
            <Path d={`M0,${PANEL_H * 0.66} H${MAP_W}`}  stroke="#D0BC98" strokeWidth="0.7" />
            <Path d={`M${MAP_W * 0.33},0 V${PANEL_H}`}  stroke="#D0BC98" strokeWidth="0.7" />
            <Path d={`M${MAP_W * 0.66},0 V${PANEL_H}`}  stroke="#D0BC98" strokeWidth="0.7" />

            {/* Route — dashed orange path */}
            <Path
              d="M22,130 Q36,100 58,78 Q80,57 90,22"
              stroke={sf.orange}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              strokeDasharray="7,5"
            />

            {/* Destination */}
            <Circle cx="90" cy="22" r="6"  fill={sf.orange} />
            <Circle cx="90" cy="22" r="11" fill={sf.orange} fillOpacity="0.2" />

            {/* Origin */}
            <Circle cx="22" cy="130" r="4"  fill={sf.grayDark} />
            <Circle cx="22" cy="130" r="7"  fill={sf.grayDark} fillOpacity="0.15" />
          </G>
        </Svg>

        {/* Gradient fade over map left edge */}
        <LinearGradient
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0)']}
          style={{ position: 'absolute', top: 0, right: MAP_W - 90, width: 90, height: PANEL_H }}
        />

        {/* CTA button — absolute inside panel, bottom-right, nestled in the arc */}
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.82}
          style={styles.ctaBtn}
        >
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 45,
    overflow: 'hidden',
    height: CARD_H,
    borderWidth: 12,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.45,
    shadowRadius: 30,
    elevation: 14,
  },

  heartBtn: {
    position: 'absolute',
    top: 16, left: 16,
  },
  blurBtn: {
    width: 40, height: 40, borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
  },

  timeBadge: {
    position: 'absolute',
    top: 16, right: 16,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: sf.orange,
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 100,
  },
  timeBadgeText: {
    fontSize: 13, fontWeight: '700',
    color: 'white', letterSpacing: 0.2,
  },

  panel: {
    position: 'absolute',
    bottom: 16, left: 16, right: 16,
    height: PANEL_H,
    backgroundColor: 'white',
    borderRadius: 28,
    flexDirection: 'row',
    overflow: 'hidden',   // clips map SVG to panel's rounded corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
  },

  panelLeft: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 0,
    paddingLeft: 18,
    paddingRight: 10,
  },
  panelLabel: {
    fontSize: 10, fontWeight: '700',
    color: sf.grayDark, letterSpacing: 1.2,
    marginBottom: 4,
    marginTop: 12,
  },
  panelTitle: {
    fontSize: 21, fontFamily: fonts.heading,
    color: sf.black, lineHeight: 26,
    marginBottom: 5,
  },

  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 30, height: 30, borderRadius: 15,
    borderWidth: 2, borderColor: 'white',
  },
  avatarOffset: {
    marginLeft: -8,
  },
  avatarOverflow: {
    backgroundColor: sf.grayLight,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarOverflowText: {
    fontSize: 9, fontWeight: '700',
    color: sf.grayDark,
  },

  // Button sits at bottom-right of the panel, centered inside the concave arc
  ctaBtn: {
    position: 'absolute',
    bottom: BTN_PAD,
    right: BTN_PAD,
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: BTN_SIZE / 2,
    backgroundColor: sf.orange,
    alignItems: 'center',
    justifyContent: 'center',
    // Lift above the SVG layer
    zIndex: 1,
  },
});
