import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { colors, tokens } from '../../theme/stockmateTheme';

function Bone({ width, height = 16, radius = 8 }: { width: `${number}%` | number; height?: number; radius?: number }) {
  const opacity = useRef(new Animated.Value(0.45)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(opacity, { toValue: 0.9, duration: 700, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.45, duration: 700, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return <Animated.View style={{ width, height, borderRadius: radius, backgroundColor: colors.border, opacity }} />;
}

export function SkeletonScreen() {
  return (
    <View accessibilityLabel="Loading StockMate" style={{ flex: 1, padding: tokens.spacing.lg, gap: tokens.spacing.lg, backgroundColor: colors.background }}>
      <View style={{ gap: 10 }}><Bone width="38%" height={14} /><Bone width="72%" height={34} radius={12} /></View>
      <View style={{ flexDirection: 'row', gap: tokens.spacing.md }}>
        <View style={{ flex: 1, gap: 12, padding: tokens.spacing.md, borderRadius: tokens.radius.lg, backgroundColor: colors.surface }}><Bone width="55%" /><Bone width="82%" height={30} radius={10} /><Bone width="42%" height={12} /></View>
        <View style={{ flex: 1, gap: 12, padding: tokens.spacing.md, borderRadius: tokens.radius.lg, backgroundColor: colors.surface }}><Bone width="48%" /><Bone width="68%" height={30} radius={10} /><Bone width="52%" height={12} /></View>
      </View>
      <View style={{ gap: 12, padding: tokens.spacing.md, borderRadius: tokens.radius.lg, backgroundColor: colors.surface }}><Bone width="34%" /><Bone width="100%" height={52} radius={14} /><Bone width="88%" height={52} radius={14} /><Bone width="64%" height={52} radius={14} /></View>
    </View>
  );
}
