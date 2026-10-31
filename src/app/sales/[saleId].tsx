import React, { useState } from 'react';
import { Platform, Share, View } from 'react-native';
import { Text } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { useShop } from '../../state/ShopProvider';
import { BrandMark, Card, ErrorMessage, Icon, Info, Screen, StockMateButton } from '../../components/stockmate/ui';
import { SaleTotals } from '../../components/stockmate/SaleTotals';
import { dateTime, money } from '../../services/calculations';
import { colors, styles } from '../../theme/stockmateTheme';
export default function Receipt() {
  const { saleId } = useLocalSearchParams<{ saleId: string }>();
  const { db, setCart, setPayment } = useShop(); const [error, setError] = useState('');
  const sale = db.sales.find(s => s.id === saleId);
  function sales() { router.dismissAll(); router.navigate('/sales'); }
  if (!sale) return <Screen title="Receipt not found" back onBack={sales}><ErrorMessage message="This receipt is not in your local shop data." /><StockMateButton onPress={sales}>Return to sales</StockMateButton></Screen>;
  async function share() {
    if (!sale) return;
    const message = [sale.shop.name, sale.shop.contact, sale.shop.address, `Receipt ${sale.receiptNumber}`, dateTime(sale.timestamp), sale.demo ? 'DEMO RECEIPT — sample shop data' : '', '', ...sale.lines.map(l => `${l.name}\n${l.quantity} × ${money(l.unitPrice)} = ${money(l.lineTotal)}`), '', `Subtotal: ${money(sale.subtotal)}`, `Total: ${money(sale.total)}`, `Recorded payment method: ${sale.paymentMethod}`, 'StockMate recorded this sale. It did not process payment.'].filter(Boolean).join('\n');
    try { await Share.share({ message, title: `Receipt ${sale.receiptNumber}` }); } catch { setError('The receipt could not be shared. Please try again.'); }
  }
  return <Screen title="Receipt" subtitle="A clear record of your sale." back onBack={sales} footer={<><StockMateButton icon="plus" onPress={() => { setCart({}); setPayment('Cash'); router.dismissAll(); router.push('/sales/new'); }}>Record another sale</StockMateButton><StockMateButton mode="outlined" onPress={sales}>Return to sales</StockMateButton></>}>
    <View style={{ alignItems: 'center', gap: 10 }}><View style={{ padding: 16, backgroundColor: colors.sage, borderRadius: 50 }}><Icon name="check" size={30} /></View><Text variant="titleLarge">Sale recorded</Text><Text variant="bodyMedium" style={styles.muted}>Receipt and stock saved on this device</Text></View>
    <Card><View style={{ alignItems: 'center', gap: 12 }}><BrandMark size={40} /><Text variant="headlineMedium" style={{ textAlign: 'center' }}>{sale.shop.name}</Text>{!!sale.shop.contact && <Text variant="bodyMedium" style={{ textAlign: 'center' }}>{sale.shop.contact}</Text>}{!!sale.shop.address && <Text variant="bodyMedium" style={{ textAlign: 'center' }}>{sale.shop.address}</Text>}<Text variant="titleMedium">{sale.receiptNumber}</Text><Text variant="bodyMedium" style={styles.muted}>{dateTime(sale.timestamp)}</Text>{sale.demo && <Text variant="bodyMedium" style={{ color: colors.warning }}>Demo receipt · sample shop data</Text>}</View><View style={styles.divider} />{sale.lines.map(l => <View key={l.productId} style={{ gap: 6 }}><Text variant="titleMedium">{l.name}</Text><View style={[styles.row, { justifyContent: 'space-between', flexWrap: 'wrap' }]}><Text variant="bodyMedium" style={styles.muted}>{l.quantity} × {money(l.unitPrice)}</Text><Text variant="titleMedium" style={styles.money}>{money(l.lineTotal)}</Text></View></View>)}<View style={styles.divider} /><SaleTotals lines={sale.lines} /><View style={styles.divider} /><Text variant="bodyMedium" style={styles.muted}>Recorded payment method</Text><Text variant="titleMedium">{sale.paymentMethod}</Text><Text variant="bodyLarge" style={{ textAlign: 'center', paddingTop: 12 }}>Thank you for shopping local.</Text></Card>
    <Info>StockMate recorded the payment method, but did not take or process payment.</Info><ErrorMessage message={error} />{Platform.OS !== 'web' && <StockMateButton mode="outlined" icon="share-2" onPress={() => void share()}>Share receipt</StockMateButton>}
  </Screen>;
}
