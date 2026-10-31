import React from 'react';
import { View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { router } from 'expo-router';
import type { Product, Sale } from '../../types/models';
import { colors, styles } from '../../theme/stockmateTheme';
import { dateTime, money, stockStatus, timeOnly } from '../../services/calculations';
import { Icon } from './ui';

export function StockStatusBadge({ product }: { product: Product }) {
  const status = stockStatus(product); const out = product.quantity === 0; const low = status === 'Low stock';
  return <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 5, paddingHorizontal: 9, borderRadius: 8, backgroundColor: out ? colors.errorBg : low ? colors.warningBg : colors.sage }}><Icon name={out ? 'x-circle' : low ? 'alert-circle' : 'check-circle'} size={16} color={out ? colors.error : low ? colors.warning : colors.primary} /><Text variant="bodySmall" style={{ color: out ? colors.error : low ? colors.warning : colors.primary }}>{status}</Text></View>;
}
const categoryIcons = { Pantry: 'package', Dairy: 'droplet', Drinks: 'coffee', Household: 'sun', Bakery: 'box' } as const;
export function ProductRow({ product, compact = false }: { product: Product; compact?: boolean }) {
  return <TouchableRipple accessibilityRole="button" accessibilityLabel={`${product.name}, ${money(product.price)}, ${product.quantity} units, ${stockStatus(product)}. Open product details.`} onPress={() => router.push(`/inventory/${product.id}`)} style={{ borderRadius: 16, backgroundColor: colors.surface }} borderless><View style={{ padding: 16, gap: 12 }}><View style={styles.row}><View style={{ width: 48, height: 48, borderRadius: 13, backgroundColor: colors.soft, justifyContent: 'center', alignItems: 'center' }}><Icon name={categoryIcons[product.category as keyof typeof categoryIcons] ?? 'package'} /></View><View style={styles.grow}><Text variant="titleMedium">{product.name}</Text><Text variant="bodyMedium" style={styles.muted}>{compact ? `${product.quantity} units remaining` : `${product.category}${product.sku ? ` · ${product.sku}` : ''}`}</Text></View><Icon name="chevron-right" size={20} color={colors.muted} /></View><View style={[styles.row, { justifyContent: 'space-between', flexWrap: 'wrap', paddingLeft: compact ? 60 : 0 }]}><StockStatusBadge product={product} />{!compact && <View style={{ alignItems: 'flex-end', gap: 2 }}><Text variant="titleMedium" style={styles.money}>{money(product.price)}</Text><Text variant="bodyMedium" style={styles.muted}>{product.quantity} in stock</Text></View>}</View></View></TouchableRipple>;
}
export function SaleRow({ sale, today = false }: { sale: Sale; today?: boolean }) {
  const items = sale.lines.reduce((sum, l) => sum + l.quantity, 0);
  return <TouchableRipple onPress={() => router.push(`/sales/${sale.id}`)} accessibilityRole="button" accessibilityLabel={`Receipt ${sale.receiptNumber}, ${dateTime(sale.timestamp)}, ${items} items, ${sale.paymentMethod}, ${money(sale.total)}`} style={{ backgroundColor: colors.surface, borderRadius: 16 }} borderless><View style={{ padding: 16, gap: 8 }}><View style={styles.row}><View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center' }}><Icon name="file-text" /></View><View style={styles.grow}><Text variant="titleMedium">{sale.receiptNumber}</Text><Text variant="bodyMedium" style={styles.muted}>{today ? timeOnly(sale.timestamp) : dateTime(sale.timestamp)} · {sale.paymentMethod}</Text></View><Icon name="chevron-right" size={20} color={colors.muted} /></View><View style={[styles.row, { justifyContent: 'space-between', paddingLeft: 56, flexWrap: 'wrap' }]}><Text variant="bodyMedium" style={styles.muted}>{items} {items === 1 ? 'item' : 'items'}</Text><Text variant="titleMedium" style={styles.money}>{money(sale.total)}</Text></View></View></TouchableRipple>;
}
