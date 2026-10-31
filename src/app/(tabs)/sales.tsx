import React, { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { useShop } from '../../state/ShopProvider';
import { Screen, Choices, EmptyState, Heading, StockMateButton } from '../../components/stockmate/ui';
import { SaleRow } from '../../components/stockmate/rows';
import { SalesSummary } from '../../components/stockmate/SalesSummary';
import { filterSales } from '../../services/calculations';
export default function Sales() {
  const { db, setCart, setPayment } = useShop();
  const [period, setPeriod] = useState('today');
  const sales = filterSales(db.sales, period);
  function start() { setCart({}); setPayment('Cash'); router.push('/sales/new'); }
  return <Screen title="Sales" subtitle="Every sale has a story. Keep it here." footer={<StockMateButton icon="plus" onPress={start}>Record sale</StockMateButton>}>
    <Choices value={period} onChange={setPeriod} options={[{ value: 'today', label: 'Today' }, { value: 'week', label: 'Last 7 days' }, { value: 'all', label: 'All time' }]} />
    <SalesSummary sales={sales} today={period === 'today'} /><Heading>Receipts</Heading><View style={{ gap: 12 }}>{sales.map(s => <SaleRow key={s.id} sale={s} today={period === 'today'} />)}{!sales.length && <EmptyState kind="sales" title="No sales in this period" message="Choose another period or record your next sale." action="Record sale" onPress={start} />}</View>
  </Screen>;
}
