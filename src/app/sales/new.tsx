import React, { useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { router } from 'expo-router';
import { useShop } from '../../state/ShopProvider';
import { Card, ConfirmDialog, EmptyState, ErrorMessage, Heading, Icon, Screen, Search, StockMateButton } from '../../components/stockmate/ui';
import { CartLine } from '../../components/stockmate/CartLine';
import { cartLines, money, subtotal } from '../../services/calculations';
import { styles } from '../../theme/stockmateTheme';
import type { SaleLine } from '../../types/models';
export default function NewSale() {
  const { db, cart, setCart } = useShop();
  const [query, setQuery] = useState(''); const [cancel, setCancel] = useState(false);
  const products = db.products.filter(p => `${p.name} ${p.sku}`.toLowerCase().includes(query.trim().toLowerCase()));
  const selected = db.products.filter(p => (cart[p.id] ?? 0) > 0);
  let lines: SaleLine[] = []; let error = '';
  try { lines = cartLines(db.products, cart); subtotal(lines); } catch (e) { error = e instanceof Error ? e.message : 'Please check the sale quantities.'; }
  function update(id: string, quantity: number) {
    const p = db.products.find(p => p.id === id); if (!p || quantity > p.quantity) return;
    setCart(current => { const next = { ...current }; if (quantity <= 0) delete next[id]; else next[id] = quantity; return next; });
  }
  function leave() { setCart({}); setCancel(false); router.canGoBack() ? router.back() : router.replace('/sales'); }
  return <Screen title="Record sale" subtitle="Choose products. Then review together." back footer={<><ErrorMessage message={error} /><View style={[styles.row, { justifyContent: 'space-between', flexWrap: 'wrap' }]}><Text variant="bodyLarge">Subtotal · {selected.reduce((n, p) => n + cart[p.id], 0)} items</Text><Text variant="titleLarge" style={styles.money}>{error ? 'Check cart' : money(subtotal(lines))}</Text></View><StockMateButton icon="arrow-right" disabled={!lines.length || !!error} onPress={() => router.push('/sales/review')}>Review sale</StockMateButton><StockMateButton mode="text" onPress={() => selected.length ? setCancel(true) : leave()}>Cancel sale</StockMateButton></>}>
    <Heading count={selected.length}>Your cart</Heading>{selected.length ? selected.map(p => <CartLine key={p.id} product={p} quantity={cart[p.id]} onChange={q => update(p.id, q)} />) : <Card tone="sage"><View style={styles.row}><Icon name="shopping-bag" /><Text style={styles.grow}>Your cart is ready. Add a product below to begin.</Text></View></Card>}
    <Heading>Find a product</Heading><Search value={query} onChangeText={setQuery} /><View style={{ gap: 12 }}>{products.map(p => <Card key={p.id}><View style={styles.row}><View style={styles.grow}><Text variant="titleMedium">{p.name}</Text><Text variant="bodyMedium" style={styles.muted}>{money(p.price)} · {p.quantity} available</Text></View><Icon name="package" /></View>{cart[p.id] ? <Text variant="bodyMedium">In your cart · {cart[p.id]} units. Adjust above.</Text> : <StockMateButton mode="outlined" icon="plus" disabled={p.quantity === 0} onPress={() => update(p.id, 1)}>{p.quantity === 0 ? 'Out of stock' : 'Add to sale'}</StockMateButton>}</Card>)}{!products.length && <EmptyState kind="inventory" title="No products found" message={db.products.length ? 'Try a different name or SKU.' : 'Add a product before recording your first sale.'} action={db.products.length ? 'Clear search' : 'Add product'} onPress={db.products.length ? () => setQuery('') : () => router.push('/inventory/new')} />}</View>
    <ConfirmDialog visible={cancel} title="Discard this sale?" onCancel={() => setCancel(false)} onConfirm={leave} confirmLabel="Discard sale"><Text>This clears the cart. No sale has been recorded and stock will not change.</Text></ConfirmDialog>
  </Screen>;
}
