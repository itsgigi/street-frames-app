import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { mdiCameraIris } from '@mdi/js';
import { fonts, sf } from '@/constants/theme';

interface ScreenHeaderProps {
  title: string;
  /** Node rendered to the left of the title (e.g. back button). When omitted, the title starts at the left edge. */
  left?: React.ReactNode;
  /** Node rendered to the right of the title (e.g. search icon). */
  right?: React.ReactNode;
  /** Override container style (e.g. to remove vertical padding for section headings). */
  style?: ViewStyle;
}

export function ScreenHeader({ title, left, right, style }: ScreenHeaderProps) {
  return (
    <View style={[{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 14,
    }, style]}>

      {/* Left slot — only rendered when provided */}
      {left != null && (
        <View style={{ width: 40, alignItems: 'flex-start' }}>
          {left}
        </View>
      )}

      {/* Title + camera icon — grows to fill */}
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <Svg width={18} height={18} viewBox="0 0 24 24" style={{ marginRight: 8 }}>
          <Path d={mdiCameraIris} fill={sf.orange} />
        </Svg>
        <Text style={{
          fontSize: 22,
          fontWeight: '700',
          color: sf.black,
          letterSpacing: 0.3,
          fontFamily: fonts.heading,
        }}>
          {title}
        </Text>
      </View>

      {/* Right slot — only rendered when provided */}
      {right != null && (
        <View style={{ alignItems: 'flex-end' }}>
          {right}
        </View>
      )}
    </View>
  );
}
