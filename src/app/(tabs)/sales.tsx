import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TouchableRipple } from 'react-native-paper';
import { router } from 'expo-router';
import { useShop } from '../../state/ShopProvider';
import { EmptyState, Icon, StockMateButton } from '../../components/stockmate/ui';
import { dateTime, filterSales, money, summary, timeOnly } from '../../services/calculations';
import { colors } from '../../theme/stockmateTheme';
import { market, MarketHeader } from '../../screens/MarketDay';

export default function Sales() {
  const { db, setCart, setPayment } = useShop();
  const [period, setPeriod] = useState('today');
  const sales = filterSales(db.sales, period);
  const totals = summary(sales);
  function start() { setCart({}); setPayment('Cash'); router.push('/sales/new'); }
  return <SafeAreaView edges={['top', 'left', 'right']} style={market.screen}>
    <ScrollView contentContainerStyle={[market.content, { paddingBottom: 16 }]}>
      <MarketHeader>
        <View style={market.section}><Text accessibilityRole="header" style={[market.heading, { fontSize: 24, lineHeight: 32, color: colors.onPrimary }]}>Sales</Text><Icon name="file-text" size={22} color={colors.onPrimary} /></View>
        <Text style={[market.small, { color: colors.onPrimary }]}>Demo sales · Saved on device</Text>
        <View style={{ gap: 4 }}><Text style={[market.label, { color: colors.onPrimary }]}>{period === 'today' ? 'Sales revenue today' : period === 'week' ? 'Sales revenue · Last 7 days' : 'Sales revenue · All time'}</Text><Text style={[market.number, { color: colors.onPrimary, fontSize: 38, lineHeight: 48 }]}>{money(totals.revenue)}</Text><Text style={[market.small, { color: colors.onPrimary }]}>Every sale, accounted for.</Text></View>
      </MarketHeader>
      <View style={market.body}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{[{ value: 'today', label: 'Today' }, { value: 'week', label: 'Last 7 days' }, { value: 'all', label: 'All time' }].map(option => <TouchableRipple key={option.value} accessibilityRole="radio" accessibilityLabel={option.label} accessibilityState={{ selected: period === option.value }} onPress={() => setPeriod(option.value)} borderless style={[market.pill, period === option.value && { backgroundColor: colors.primary, borderColor: colors.primary }]}><View style={market.action}><Text style={[market.small, market.number, { color: period === option.value ? colors.onPrimary : colors.text }]}>{option.label}</Text></View></TouchableRipple>)}</View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <View style={[market.panel, { flex: 1, minWidth: 140 }]}><Icon name="shopping-bag" size={20} /><Text style={market.label}>{period === 'today' ? 'Sales today' : 'Recorded sales'}</Text><Text style={[market.number, { fontSize: 26, lineHeight: 34, color: colors.primary }]}>{totals.count}</Text><Text style={market.small}>{totals.items} items sold</Text></View>
          <View style={[market.panel, { flex: 1, minWidth: 140 }]}><Icon name="pie-chart" size={20} /><Text style={market.label}>Estimated gross profit</Text><Text style={[market.number, { fontSize: 22, lineHeight: 30, color: colors.primary }]}>{totals.profit === null ? 'Incomplete' : money(totals.profit)}</Text><Text style={market.small}>Before shop expenses</Text></View>
        </View>
        {totals.incomplete && <View style={[market.panel, { backgroundColor: colors.warningBg }]}><View style={market.row}><Icon name="alert-circle" size={18} color={colors.alert} /><Text style={[market.label, { color: colors.alert, flex: 1 }]}>Gross profit is incomplete</Text></View><Text style={market.small}>Purchase costs are missing for some sold items. We won’t guess. Adding costs now won’t change past receipts.</Text></View>}
        <View style={market.section}><Text accessibilityRole="header" style={market.heading}>Receipts</Text><Text style={market.small}>{sales.length} {sales.length === 1 ? 'receipt' : 'receipts'}</Text></View>
        <View style={{ gap: 6 }}>{sales.map(s => {
          const items = s.lines.reduce((sum, line) => sum + line.quantity, 0);
          return <TouchableRipple key={s.id} accessibilityRole="button" accessibilityLabel={`Receipt ${s.receiptNumber}, ${dateTime(s.timestamp)}, ${items} items, ${s.paymentMethod}, ${money(s.total)}. Open receipt.`} onPress={() => router.push(`/sales/${s.id}`)} borderless style={{ backgroundColor: colors.surface, borderRadius: 12 }}>
            <View style={{ padding: 12, gap: 8 }}><View style={market.row}><View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center' }}><Icon name="file-text" size={21} /></View><View style={{ flex: 1, minWidth: 0 }}><Text style={[market.label, market.number]}>{s.receiptNumber}</Text><Text style={market.small}>{period === 'today' ? timeOnly(s.timestamp) : dateTime(s.timestamp)}</Text></View><Icon name="chevron-right" size={18} color={colors.muted} /></View><View style={[market.section, { paddingLeft: 52 }]}><Text style={market.small}>{items} {items === 1 ? 'item' : 'items'} · {s.paymentMethod}</Text><Text style={[market.label, market.number, { color: colors.primary }]}>{money(s.total)}</Text></View></View>
          </TouchableRipple>;
        })}{!sales.length && <EmptyState kind="sales" title="No sales in this period" message="Choose another period or record your next sale." action="Record sale" onPress={start} />}</View>
      </View>
    </ScrollView>
    <View style={[market.content, { paddingHorizontal: 20, paddingVertical: 10 }]}><StockMateButton icon="plus" onPress={start}>Record sale</StockMateButton></View>
  </SafeAreaView>;
}
