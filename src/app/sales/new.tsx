import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, TextInput, TouchableRipple } from 'react-native-paper';
import { router } from 'expo-router';
import { useShop } from '../../state/ShopProvider';
import { ConfirmDialog, EmptyState, ErrorMessage, Icon, QuantityControls, StockMateButton } from '../../components/stockmate/ui';
import { cartLines, money, subtotal } from '../../services/calculations';
import { categoryColors, colors } from '../../theme/stockmateTheme';
import { market, MarketAction } from '../../screens/MarketDay';
import type { SaleLine } from '../../types/models';
export default function NewSale() {
  const { db, cart, setCart } = useShop();
  const [query, setQuery] = useState(''); const [cancel, setCancel] = useState(false);
  const products = db.products.filter(p => `${p.name} ${p.sku}`.toLowerCase().includes(query.trim().toLowerCase()));
  const selected = db.products.filter(p => (cart[p.id] ?? 0) > 0);
  const { height, width, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  let lines: SaleLine[] = []; let error = '';
  try { lines = cartLines(db.products, cart); subtotal(lines); } catch (e) { error = e instanceof Error ? e.message : 'Please check the sale quantities.'; }
  function update(id: string, quantity: number) {
    const p = db.products.find(p => p.id === id); if (!p || quantity > p.quantity) return;
    setCart(current => { const next = { ...current }; if (quantity <= 0) delete next[id]; else next[id] = quantity; return next; });
  }
  function leave() { setCart({}); setCancel(false); router.canGoBack() ? router.back() : router.replace('/sales'); }
  return <SafeAreaView edges={['top', 'left', 'right']} style={market.screen}><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[market.content, market.body, { paddingTop: 8 }]}>
      <View style={market.section}><View style={[market.row, { flex: 1 }]}><TouchableRipple accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={{ borderRadius: 24 }}><View style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}><Icon name="chevron-left" /></View></TouchableRipple><Text accessibilityRole="header" style={[market.heading, { flex: 1 }]}>New sale</Text></View><Text style={[market.small, { backgroundColor: colors.sage, color: colors.primary, borderRadius: 6, padding: 6 }]}>Demo data</Text></View>
      <TextInput mode="outlined" value={query} onChangeText={setQuery} placeholder="Search a product" accessibilityLabel="Search product name or SKU" left={<TextInput.Icon icon="magnify" />} right={query ? <TextInput.Icon icon="close" accessibilityLabel="Clear search" onPress={() => setQuery('')} /> : undefined} style={{ backgroundColor: colors.surface, fontSize: 14 }} outlineStyle={{ borderRadius: 12 }} />
      <View style={market.section}><Text style={market.label}>All products</Text><Text style={market.small}>Tap to add to your ticket</Text></View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>{products.map(p => {
        const tone = categoryColors[p.category] ?? colors.primary;
        const quantity = cart[p.id] ?? 0;
        return <TouchableRipple key={p.id} onPress={() => update(p.id, 1)} disabled={p.quantity === 0 || quantity > 0} accessibilityRole="button" accessibilityLabel={`${p.name}, ${money(p.price)}, ${p.quantity} available. ${quantity ? `In cart: ${quantity}. Adjust in ticket below.` : p.quantity === 0 ? 'Out of stock' : 'Add to sale'}`} accessibilityState={{ disabled: p.quantity === 0 || quantity > 0 }} borderless style={{ width: width < 340 || fontScale > 1.4 ? '100%' : '48%', flexGrow: 1, maxWidth: width < 340 || fontScale > 1.4 ? '100%' : '49%', borderRadius: 14, borderWidth: quantity ? 2 : 1, borderColor: quantity ? colors.accent : colors.border, backgroundColor: colors.surface }}>
          <View style={{ padding: 10, gap: 6 }}><View style={{ backgroundColor: tone, borderRadius: 10, minHeight: 72, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 38, lineHeight: 48, color: '#FFFFFF' }}>{p.name.charAt(0).toUpperCase()}</Text>{quantity > 0 && <View style={{ position: 'absolute', top: 4, right: 4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, backgroundColor: colors.accent }}><Text style={[market.small, market.number, { color: colors.onAccent }]}>{quantity}</Text></View>}</View>
          <Text style={[market.label, { fontWeight: '600' }]}>{p.name}</Text><Text style={[market.label, market.number]}>{money(p.price)}</Text><Text style={market.small}>{p.category} · {p.quantity} available</Text><Text style={[market.small, { color: p.quantity === 0 ? colors.alert : colors.primary }]}>{p.quantity === 0 ? 'Out of stock' : quantity ? 'In cart · Adjust below' : '+ Add to sale'}</Text></View>
        </TouchableRipple>;
      })}</View>
      {!products.length && <EmptyState kind="inventory" title="No products found" message={db.products.length ? 'Try a different name or SKU.' : 'Add a product before recording your first sale.'} action={db.products.length ? 'Clear search' : 'Add product'} onPress={db.products.length ? () => setQuery('') : () => router.push('/inventory/new')} />}
    </ScrollView>
    <View style={[market.content, { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTopWidth: 1, borderColor: colors.border, maxHeight: height * 0.48 }]}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, paddingBottom: Math.max(16, insets.bottom), gap: 12 }}>
        <View style={market.section}><Text style={market.heading}>Ticket</Text><Text style={market.small}>{selected.reduce((n, p) => n + cart[p.id], 0)} items</Text></View>
        {selected.length ? selected.map(p => <View key={p.id} style={{ borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 8, gap: 6 }}><View style={market.section}><Text style={[market.label, { flex: 1 }]}>{cart[p.id]} × {p.name}</Text><Text style={[market.label, market.number]}>{money(p.price * cart[p.id])}</Text></View><View style={[market.section, { gap: 4 }]}><QuantityControls name={p.name} quantity={cart[p.id]} max={p.quantity} onDecrease={() => update(p.id, cart[p.id] - 1)} onIncrease={() => update(p.id, cart[p.id] + 1)} /><MarketAction label="Remove" onPress={() => update(p.id, 0)} /></View></View>) : <Text style={market.small}>Your ticket is ready. Add a product above to begin.</Text>}
        <ErrorMessage message={error} /><View style={market.section}><Text style={market.label}>Total</Text><Text style={[market.number, { color: colors.primary, fontSize: 24, lineHeight: 32 }]}>{error ? 'Check cart' : money(subtotal(lines))}</Text></View>
        <StockMateButton icon="arrow-right" disabled={!lines.length || !!error} onPress={() => router.push('/sales/review')}>Review sale</StockMateButton>
        <MarketAction label="Cancel sale" onPress={() => selected.length ? setCancel(true) : leave()} />
      </ScrollView>
    </View>
    <ConfirmDialog visible={cancel} title="Discard this sale?" onCancel={() => setCancel(false)} onConfirm={leave} confirmLabel="Discard sale"><Text>This clears the cart. No sale has been recorded and stock will not change.</Text></ConfirmDialog>
  </KeyboardAvoidingView></SafeAreaView>;
}
