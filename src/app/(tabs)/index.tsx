import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { router } from 'expo-router';
import { useShop } from '../../state/ShopProvider';
import { colors, styles } from '../../theme/stockmateTheme';
import { BrandMark, EmptyState, Heading, Icon, StockMateButton } from '../../components/stockmate/ui';
import { ProductRow, SaleRow } from '../../components/stockmate/rows';
import { SalesSummary } from '../../components/stockmate/SalesSummary';
import { filterSales, needsRestocking } from '../../services/calculations';
export default function Home() {
  const { db, setFilter, setSearch, setCart, setPayment } = useShop();
  const low = db.products.filter(needsRestocking).sort((a, b) => a.quantity - b.quantity);
  const today = filterSales(db.sales, 'today');
  function newSale() { setCart({}); setPayment('Cash'); router.push('/sales/new'); }
  function restocking() { setFilter('low'); setSearch(''); router.navigate('/inventory'); }
  return <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.background }}><ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 32, gap: 28 }}>
    <View style={[styles.row, { justifyContent: 'space-between', flexWrap: 'wrap' }]}><View style={styles.row}><BrandMark /><View><Text variant="titleLarge">{db.shop.name}</Text><Text variant="bodyMedium" style={styles.muted}>Your everyday shop companion</Text></View></View><View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, padding: 9, borderRadius: 9, backgroundColor: colors.sage }}><Icon name="smartphone" size={16} /><Text variant="bodySmall" style={{ color: colors.primary }}>Demo data · on device</Text></View></View>
    <View style={{ gap: 8 }}><Text variant="headlineLarge" accessibilityRole="header">Hello, shopkeeper.</Text><Text variant="bodyLarge" style={styles.muted}>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</Text></View>
    <View style={{ gap: 12 }}><StockMateButton icon="plus" onPress={newSale}>Record sale</StockMateButton><View style={styles.wrap}><View style={{ flex: 1, minWidth: 140 }}><StockMateButton mode="outlined" icon="download" onPress={() => router.push('/inventory/receive')}>Receive stock</StockMateButton></View><View style={{ flex: 1, minWidth: 140 }}><StockMateButton mode="outlined" icon="package" onPress={() => router.push('/inventory/new')}>Add product</StockMateButton></View></View></View>
    <View style={{ gap: 16 }}><Heading>Today at a glance</Heading><SalesSummary sales={today} today /></View>
    <View style={{ gap: 12 }}><Heading action="View all" onPress={restocking} count={low.length}>Needs restocking</Heading><Text variant="bodyMedium" style={styles.muted}>A little attention keeps your shelves ready.</Text>{low.length ? low.slice(0, 3).map(p => <ProductRow key={p.id} product={p} compact />) : <EmptyState kind="inventory" title="Your shelves are looking good" message="No products are below their stock alert threshold." action="View inventory" onPress={() => router.navigate('/inventory')} />}</View>
    <View style={{ gap: 12 }}><Heading action="View all" onPress={() => router.navigate('/sales')}>Recent sales</Heading>{db.sales.length ? db.sales.slice(0, 3).map(s => <SaleRow key={s.id} sale={s} />) : <EmptyState kind="sales" title="Your first sale starts here" message="Record a sale and its receipt will appear here." action="Record sale" onPress={newSale} />}</View>
    <View style={[styles.row, { justifyContent: 'center' }]}><Icon name="check-circle" size={17} color={colors.muted} /><Text variant="bodyMedium" style={styles.muted}>Saved locally. Ready for your day.</Text></View>
  </ScrollView></SafeAreaView>;
}
