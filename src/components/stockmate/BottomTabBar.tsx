import React, { useEffect, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/stockmateTheme';
import { Icon } from './ui';

type Props = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];
const icons = { index: 'home', inventory: 'package', sales: 'bar-chart-2', more: 'grid' } as const;
export function BottomTabBar({ state, descriptors, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const shown = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hidden = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => { shown.remove(); hidden.remove(); };
  }, []);
  if (keyboardVisible) return null;
  return <View style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: Math.max(10, insets.bottom), paddingHorizontal: 12, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface }}>
    {state.routes.map((route, index) => {
      const selected = state.index === index;
      const label = descriptors[route.key].options.title ?? route.name;
      return <TouchableRipple key={route.key} accessibilityRole="tab" accessibilityLabel={label} accessibilityState={{ selected }} onPress={() => {
        const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
        if (!selected && !event.defaultPrevented) navigation.navigate(route.name);
      }} style={{ flex: 1, borderRadius: 12 }} borderless><View style={{ alignItems: 'center', paddingVertical: 8, minHeight: 64, gap: 5 }}><View style={{ backgroundColor: selected ? colors.sage : 'transparent', borderRadius: 10, paddingHorizontal: 17, paddingVertical: 5 }}><Icon name={icons[route.name as keyof typeof icons] ?? 'grid'} color={selected ? colors.primary : colors.muted} size={23} /></View><Text variant="bodySmall" style={{ color: selected ? colors.primary : colors.muted, fontWeight: selected ? '700' : '400', textAlign: 'center' }}>{label}</Text></View></TouchableRipple>;
    })}
  </View>;
}
