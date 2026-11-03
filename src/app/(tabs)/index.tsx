import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TouchableRipple } from 'react-native-paper';
import { router } from 'expo-router';
import { useShop } from '../../state/ShopProvider';
import { colors } from '../../theme/stockmateTheme';
import { EmptyState, Icon, Info, StockMateButton } from '../../components/stockmate/ui';
import { filterSales, money, needsRestocking, summary, timeOnly } from '../../services/calculations';
import { market, MarketAction, MarketHeader, MarketProduct } from '../../screens/MarketDay';
export default function Home() {
  const { db, setFilter, setSearch, setCart, setPayment } = useShop();
  const low = db.products.filter(needsRestocking).sort((a, b) => a.quantity - b.quantity);
  const today = filterSales(db.sales, 'today');
  const totals = summary(today);
  function newSale() { setCart({}); setPayment('Cash'); router.push('/sales/new'); }
  function restocking() { setFilter('low'); setSearch(''); router.navigate('/inventory'); }
  return <SafeAreaView edges={['top', 'left', 'right']} style={market.screen}><ScrollView contentContainerStyle={[market.content, { paddingBottom: 24 }]}>
    <MarketHeader>
      <View style={market.section}><Text style={[market.small, { color: '#FFFFFF' }]}>StockMate · Demo data</Text><Icon name="shopping-bag" color="#FFFFFF" size={20} /></View>
      <View><Text style={[market.heading, { color: '#FFFFFF', fontSize: 23, lineHeight: 32 }]}>{db.shop.name}</Text><Text style={[market.small, { color: '#FFFFFF' }]}>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</Text></View>
      <View><Text style={[market.label, { color: '#FFFFFF' }]}>Today’s sales</Text><Text style={[market.number, { color: '#FFFFFF', fontSize: 38, lineHeight: 48 }]}>{money(totals.revenue)}</Text><Text style={[market.small, { color: '#FFFFFF' }]}>{totals.count} sales · {totals.items} items sold</Text></View>
      {!!today.length && <View accessible={false} style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 48 }}>{today.slice(0, 12).reverse().map(s => <View key={s.id} style={{ flex: 1, height: Math.max(6, s.total / Math.max(...today.map(s => s.total), 1) * 48), backgroundColor: colors.sage, opacity: 0.55, borderRadius: 3 }} />)}</View>}
      <View style={market.section}><Text style={[market.small, { color: '#FFFFFF', flex: 1 }]}>Estimated gross profit</Text><Text style={[market.small, market.number, { color: '#FFFFFF' }]}>{totals.profit === null ? 'Incomplete' : money(totals.profit)}</Text></View>
    </MarketHeader>
    <View style={market.body}>
      {totals.incomplete && <Info warning>Purchase costs are missing for some sold items. Gross profit is incomplete.</Info>}
      <View style={market.section}><Text style={market.heading}>Running low</Text><MarketAction label={`View all · ${low.length}`} icon="alert-circle" onPress={restocking} /></View>
      <View style={{ gap: 6 }}>{low.length ? low.slice(0, 3).map(p => <MarketProduct key={p.id} product={p} compact />) : <EmptyState kind="inventory" title="Your shelves are looking good" message="No products are below their stock alert threshold." action="View inventory" onPress={() => router.navigate('/inventory')} />}</View>
      <View style={market.section}><Text style={market.heading}>Recent sales</Text><MarketAction label="View all" onPress={() => router.navigate('/sales')} /></View>
      <View style={market.panel}>{db.sales.length ? db.sales.slice(0, 3).map((s, i) => <TouchableRipple key={s.id} accessibilityRole="button" onPress={() => router.push(`/sales/${s.id}`)}><View style={{ paddingVertical: 10, gap: 4, borderTopWidth: i ? 1 : 0, borderTopColor: colors.border }}><View style={market.section}><Text style={[market.label, market.number]}>{s.receiptNumber}</Text><Text style={[market.label, market.number, { color: colors.primary }]}>{money(s.total)}</Text></View><Text style={market.small}>{timeOnly(s.timestamp)} · {s.lines.reduce((sum, l) => sum + l.quantity, 0)} items · {s.paymentMethod}</Text></View></TouchableRipple>) : <EmptyState kind="sales" title="Your first sale starts here" message="Record a sale and its receipt will appear here." action="Record sale" onPress={newSale} />}</View>
      <StockMateButton icon="plus" onPress={newSale}>Record sale</StockMateButton>
      <View style={[market.row, { flexWrap: 'wrap' }]}><MarketAction label="Receive stock" icon="download" onPress={() => router.push('/inventory/receive')} /><MarketAction label="Add product" icon="plus" onPress={() => router.push('/inventory/new')} /></View>
    </View>
  </ScrollView></SafeAreaView>;
}
