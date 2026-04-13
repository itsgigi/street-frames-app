import React from 'react';
import { View } from 'react-native';

const MergedShape = ({
  fill = '#F2DCC2',
  width = 335,
  humpH = 32,
  bodyH = 108,
  humpW,
  children,
  style: containerStyle,
  ...props
}) => {
  const totalH   = humpH + bodyH;
  const _humpW   = humpW ?? width * 0.28;
  const humpX    = (width - _humpW) / 2;
  const OVERLAP  = 40; // hump extends into body to hide seam

  return (
    <View
      style={{ position: 'relative', width, height: totalH, ...containerStyle }}
      {...props}
    >
      {/* Body — flat top so the hump merges cleanly */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: humpH,
          width,
          height: bodyH,
          backgroundColor: fill,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      />

      {/* Hump — overlaps body to hide join */}
      <View
        style={{
          position: 'absolute',
          left: humpX,
          top: 0,
          width: _humpW,
          height: humpH + OVERLAP,
          backgroundColor: fill,
          borderRadius: 18,
        }}
      />

      {children}
    </View>
  );
};

export default MergedShape;
