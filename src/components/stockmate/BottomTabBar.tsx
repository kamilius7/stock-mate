import React, { useEffect, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { router, Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamilies, tokens } from '../../theme/stockmateTheme';
import { useShop } from '../../state/ShopProvider';
import { Icon } from './ui';

type Props = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];
const icons = { index: 'home', inventory: 'package', sales: 'file-text', more: 'bar-chart-2' } as const;
export function BottomTabBar({ state, descriptors, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { setCart, setPayment } = useShop();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const shown = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hidden = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => { shown.remove(); hidden.remove(); };
  }, []);
  if (keyboardVisible) return null;
  function sell() { setCart({}); setPayment('Cash'); router.push('/sales/new'); }
  function tab(route: Props['state']['routes'][number], index: number) {
    const selected = state.index === index;
    const label = descriptors[route.key].options.title ?? route.name;
    return <TouchableRipple key={route.key} accessibilityRole="tab" accessibilityLabel={label} accessibilityState={{ selected }} onPress={() => {
      const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (!selected && !event.defaultPrevented) navigation.navigate(route.name);
    }} onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })} style={{ flex: 1, minWidth: 0, borderRadius: 12, marginTop: 20 }} borderless>
      <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2, paddingVertical: 10, minHeight: 64, gap: 5 }}>
        <Icon name={icons[route.name as keyof typeof icons] ?? 'grid'} color={selected ? colors.primary : colors.muted} size={22} />
        <Text style={{ fontFamily: selected ? fontFamilies.number : fontFamilies.body, fontSize: 12, lineHeight: 18, color: selected ? colors.primary : colors.muted, fontWeight: selected ? '700' : '400', textAlign: 'center' }}>{label}</Text>
      </View>
    </TouchableRipple>;
  }
  return <View style={{ backgroundColor: colors.background, paddingTop: 8 }}>
    <View style={{ position: 'absolute', top: 8, bottom: 0, left: 10, right: 10, borderRadius: 24, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }} />
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: '100%', maxWidth: tokens.contentWidth, alignSelf: 'center', paddingHorizontal: 6, paddingBottom: Math.max(8, insets.bottom) }}>
      {state.routes.slice(0, 2).map((route, index) => tab(route, index))}
      <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 2 }}>
        <TouchableRipple accessibilityRole="button" accessibilityLabel="Sell. Start a new sale" onPress={sell} borderless style={{ width: 64, minHeight: 64, borderRadius: 32, backgroundColor: colors.accent, shadowColor: colors.onAccent, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.22, shadowRadius: 5, elevation: 5 }}>
          <View style={{ minHeight: 64, paddingVertical: 9, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center', gap: 3 }}><Icon name="shopping-bag" size={23} color={colors.onAccent} /><Text style={{ color: colors.onAccent, fontFamily: fontFamilies.number, fontSize: 12, lineHeight: 18, textAlign: 'center' }}>Sell</Text></View>
        </TouchableRipple>
      </View>
      {state.routes.slice(2).map((route, index) => tab(route, index + 2))}
    </View>
  </View>;
}
