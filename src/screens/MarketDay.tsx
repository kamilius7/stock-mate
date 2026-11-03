import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import Svg, { Circle, Rect } from 'react-native-svg';
import { router } from 'expo-router';
import { categoryColors, colors, fontFamilies } from '../theme/stockmateTheme';
import { Icon } from '../components/stockmate/ui';
import { money, stockStatus } from '../services/calculations';
import type { Product } from '../types/models';

// Presentation used only by Home, Stock and New sale.
export const market = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { width: '100%', maxWidth: 480, alignSelf: 'center' },
  body: { padding: 20, gap: 16 },
  heading: { fontFamily: fontFamilies.heading, fontSize: 18, lineHeight: 26, color: colors.text },
  label: { fontFamily: fontFamilies.body, fontSize: 14, lineHeight: 20, color: colors.text },
  small: { fontFamily: fontFamilies.body, fontSize: 12, lineHeight: 18, color: colors.muted },
  number: { fontFamily: fontFamilies.number, fontVariant: ['tabular-nums'] },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  section: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  panel: { backgroundColor: colors.surface, borderRadius: 12, padding: 12, gap: 10 },
  pill: { borderRadius: 24, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  action: { minHeight: 48, paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
});
export function MarketHeader({ children }: { children: React.ReactNode }) {
  return <View style={{ backgroundColor: colors.primary, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, padding: 20, overflow: 'hidden', gap: 12 }}>
    <View pointerEvents="none" accessible={false} style={StyleSheet.absoluteFill}><Svg width="100%" height="100%">{Array.from({ length: 48 }, (_, i) => {
      const x = (i % 8) * 62 + 14; const y = Math.floor(i / 8) * 55 + 12;
      return <React.Fragment key={i}><Circle cx={x} cy={y} r={18} fill="none" stroke={colors.accent} strokeOpacity={0.14} /><Rect x={x - 5} y={y - 6} width={10} height={12} rx={2} fill="none" stroke="#FFFFFF" strokeOpacity={0.12} /></React.Fragment>;
    })}</Svg></View>{children}
  </View>;
}
export function MarketAction({ label, onPress, filled = false, icon }: { label: string; onPress: () => void; filled?: boolean; icon?: React.ComponentProps<typeof Icon>['name'] }) {
  return <TouchableRipple accessibilityRole="button" accessibilityLabel={label} onPress={onPress} borderless style={[market.pill, filled && { backgroundColor: colors.primary, borderColor: colors.primary }]}><View style={market.action}>{icon && <Icon name={icon} size={16} color={filled ? colors.onPrimary : colors.primary} />}<Text style={[market.small, { color: filled ? colors.onPrimary : colors.primary, fontFamily: fontFamilies.number }]}>{label}</Text></View></TouchableRipple>;
}
export function MarketProduct({ product, compact = false }: { product: Product; compact?: boolean }) {
  const tone = categoryColors[product.category] ?? colors.primary;
  const status = stockStatus(product);
  const warning = status !== 'In stock';
  return <TouchableRipple accessibilityRole="button" accessibilityLabel={`${product.name}, ${money(product.price)}, ${product.quantity} units, ${status}. Open product details.`} onPress={() => router.push(`/inventory/${product.id}`)} borderless style={{ backgroundColor: colors.surface, borderRadius: 12 }}>
    <View style={{ padding: 12, gap: 8 }}><View style={market.row}>
      <View style={{ width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: tone }}><Text style={{ color: '#FFFFFF', fontFamily: fontFamilies.heading, fontSize: 24 }}>{product.name.charAt(0).toUpperCase()}</Text></View>
      <View style={{ flex: 1, minWidth: 0 }}><Text style={[market.label, { fontFamily: fontFamilies.number }]}>{product.name}</Text><Text style={market.small}>{compact ? `${product.quantity} units remaining` : `${money(product.price)} · ${product.category}`}</Text></View>
      {!compact && <Text style={[market.label, market.number]}>{product.quantity}</Text>}
    </View><View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingLeft: 52, flexWrap: 'wrap' }}>
      {!compact && <View accessible={false} style={{ flex: 1, minWidth: 40, height: 4, borderRadius: 4, backgroundColor: colors.soft }}><View style={{ height: 4, borderRadius: 4, width: `${Math.min(100, product.quantity / Math.max(1, product.threshold * 3) * 100)}%`, backgroundColor: warning ? colors.alert : colors.primary }} /></View>}
      <View style={{ backgroundColor: warning ? colors.warningBg : colors.sage, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 }}><Text style={[market.small, { color: warning ? colors.alert : colors.primary }]}>{status}</Text></View>
    </View></View>
  </TouchableRipple>;
}
