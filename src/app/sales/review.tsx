import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { router } from 'expo-router';
import { useShop } from '../../state/ShopProvider';
import { Card, Choices, EmptyState, ErrorMessage, Heading, Info, Screen, StockMateButton } from '../../components/stockmate/ui';
import { SaleTotals } from '../../components/stockmate/SaleTotals';
import { cartLines, money } from '../../services/calculations';
import { recordSale } from '../../services/sales';
import { paymentMethods, type SaleLine } from '../../types/models';
import { styles } from '../../theme/stockmateTheme';
export default function ReviewSale() {
  const { db, cart, setCart, payment, setPayment, transact, notify } = useShop();
  const [reviewed] = useState<SaleLine[]>(() => { try { return cartLines(db.products, cart); } catch { return []; } });
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const saving = useRef(false);
  async function confirm() {
    if (saving.current) return;
    saving.current = true; setBusy(true); setError('');
    try {
      const sale = await transact(current => { const result = recordSale(current, cart, payment, reviewed); return { db: result.db, result: result.sale }; });
      setCart({}); notify('Sale recorded. Receipt and stock saved together.');
      router.dismissAll();
      router.push(`/sales/${sale.id}`);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to save on this device. No sale was recorded.'); }
    finally { saving.current = false; setBusy(false); }
  }
  return <Screen title="Review sale" subtitle="One last check before you record it." back footer={reviewed.length ? <><ErrorMessage message={error} /><StockMateButton icon="check" onPress={() => void confirm()} loading={busy}>Confirm sale</StockMateButton><StockMateButton mode="text" disabled={busy} onPress={() => router.canGoBack() ? router.back() : router.replace('/sales/new')}>Back to cart</StockMateButton></> : undefined}>
    {!reviewed.length ? <EmptyState kind="sales" title="Your cart needs a check" message="Add products and make sure their quantities are available before reviewing." action="Back to cart" onPress={() => router.canGoBack() ? router.back() : router.replace('/sales/new')} /> : <>
      <Heading>Items in this sale</Heading><Card>{reviewed.map((l, i) => <View key={l.productId} style={{ gap: 8 }}><Text variant="titleMedium">{l.name}</Text><View style={[styles.row, { justifyContent: 'space-between', flexWrap: 'wrap' }]}><Text variant="bodyMedium" style={styles.muted}>{l.quantity} × {money(l.unitPrice)}</Text><Text variant="titleMedium" style={styles.money}>{money(l.lineTotal)}</Text></View>{i < reviewed.length - 1 && <View style={[styles.divider, { marginVertical: 8 }]} />}</View>)}</Card><Card><SaleTotals lines={reviewed} /></Card>
      <Heading>Recorded payment method</Heading><Text variant="bodyLarge">How did the customer pay?</Text><Choices value={payment} onChange={setPayment} options={paymentMethods.map(value => ({ value, label: value }))} />
      <Info>StockMate only records the payment method. Collect or verify payment separately before confirming. The app does not take or process payments.</Info>
      {reviewed.some(l => l.unitCost === null) && <Info warning>Some items have no recorded purchase cost. Estimated gross profit for this sale will be incomplete.</Info>}
      <Text variant="bodyMedium" style={styles.muted}>Confirming creates a receipt and deducts these units from stock. No tax or discount rule is configured.</Text>
    </>}
  </Screen>;
}
