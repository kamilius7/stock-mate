import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { useShop } from '../../../state/ShopProvider';
import { Card, Heading, Screen, StockMateButton, ErrorMessage } from '../../../components/stockmate/ui';
import { StockStatusBadge } from '../../../components/stockmate/rows';
import { colors, styles } from '../../../theme/stockmateTheme';
import { dateTime, money } from '../../../services/calculations';
export default function ProductDetails() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const { db, setCart, setPayment } = useShop();
  const product = db.products.find(p => p.id === productId);
  if (!product) return <Screen title="Product not found" back><ErrorMessage message="This product is not in your local inventory." /></Screen>;
  const movements = db.movements.filter(m => m.productId === productId).slice().reverse();
  const details = [ ['Selling price', money(product.price)], ['Purchase cost / unit', product.cost === null ? 'Not recorded' : money(product.cost)], ['Category', product.category], ['SKU / barcode', product.sku || 'Not recorded'], ['Low-stock threshold', `${product.threshold} units`] ];
  return <Screen title={product.name} subtitle={product.category} back>
    <Card tone="sage"><Text variant="bodyLarge">On your shelves</Text><Text variant="displaySmall" style={styles.money}>{product.quantity} <Text variant="bodyLarge">units</Text></Text><StockStatusBadge product={product} /></Card>
    <View style={styles.wrap}><View style={{ flex: 1, minWidth: 150 }}><StockMateButton icon="download" onPress={() => router.push({ pathname: '/inventory/receive', params: { productId } })}>Receive stock</StockMateButton></View><View style={{ flex: 1, minWidth: 150 }}><StockMateButton icon="shopping-bag" disabled={product.quantity === 0} onPress={() => { setCart({ [product.id]: 1 }); setPayment('Cash'); router.push('/sales/new'); }}>Record sale</StockMateButton></View><View style={{ flex: 1, minWidth: 150 }}><StockMateButton mode="outlined" icon="sliders" onPress={() => router.push(`/inventory/${productId}/adjust`)}>Adjust stock</StockMateButton></View><View style={{ flex: 1, minWidth: 150 }}><StockMateButton mode="outlined" icon="edit-2" onPress={() => router.push(`/inventory/${productId}/edit`)}>Edit product</StockMateButton></View></View>
    <Heading>Product details</Heading><Card>{details.map(([label, value]) => <View key={label} style={[styles.row, { justifyContent: 'space-between', flexWrap: 'wrap' }]}><Text variant="bodyMedium" style={styles.muted}>{label}</Text><Text variant="bodyLarge" style={styles.money}>{value}</Text></View>)}</Card><Text variant="bodyMedium" style={styles.muted}>Purchase cost is the last recorded unit cost used to estimate gross profit on future sales, not a batch valuation.</Text>
    <Heading>Stock history</Heading><Text variant="bodyMedium" style={styles.muted}>Newest first · every change accounted for</Text><Card>{movements.map((m, i) => <View key={m.id} style={{ gap: 8 }}><View style={[styles.row, { justifyContent: 'space-between', flexWrap: 'wrap' }]}><Text variant="titleMedium">{m.reason}</Text><Text variant="titleMedium" style={{ color: m.delta < 0 ? colors.error : colors.primary, fontVariant: ['tabular-nums'] }}>{m.delta > 0 ? '+' : ''}{m.delta} units</Text></View><Text variant="bodyMedium" style={styles.muted}>{dateTime(m.timestamp)} · {m.resultingQuantity} units after</Text>{!!m.note && <Text variant="bodyMedium">{m.note}</Text>}{m.saleId && <StockMateButton mode="text" icon="file-text" onPress={() => router.push(`/sales/${m.saleId}`)}>View receipt</StockMateButton>}{i < movements.length - 1 && <View style={[styles.divider, { marginVertical: 8 }]} />}</View>)}{!movements.length && <Text>No stock changes recorded yet.</Text>}</Card>
  </Screen>;
}
