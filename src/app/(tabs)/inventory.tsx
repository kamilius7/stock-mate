import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, TouchableRipple } from 'react-native-paper';
import { router } from 'expo-router';
import { useShop } from '../../state/ShopProvider';
import { EmptyState, Icon } from '../../components/stockmate/ui';
import { colors } from '../../theme/stockmateTheme';
import { market, MarketAction, MarketHeader, MarketProduct } from '../../screens/MarketDay';
export default function Inventory() {
  const { db, search, setSearch, filter, setFilter } = useShop();
  const query = search.trim().toLowerCase();
  const products = db.products.filter(p => (!query || `${p.name} ${p.sku}`.toLowerCase().includes(query)) && (filter === 'all' || (filter === 'out' ? p.quantity === 0 : p.quantity <= p.threshold))).sort((a, b) => a.name.localeCompare(b.name));
  return <SafeAreaView edges={['top', 'left', 'right']} style={market.screen}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[market.content, { paddingBottom: 16 }]}>
      <MarketHeader><View style={market.section}><Text accessibilityRole="header" style={[market.heading, { fontSize: 24, lineHeight: 32, color: '#FFFFFF' }]}>Stock</Text><Text style={[market.small, { color: '#FFFFFF' }]}>{db.products.length} products</Text></View><Text style={[market.small, { color: '#FFFFFF' }]}>Demo inventory · Saved on device</Text></MarketHeader>
      <View style={[market.body, { gap: 12 }]}>
        <TextInput mode="outlined" value={search} onChangeText={setSearch} placeholder="Search a product" accessibilityLabel="Search product name or SKU" left={<TextInput.Icon icon="magnify" />} right={search ? <TextInput.Icon icon="close" accessibilityLabel="Clear search" onPress={() => setSearch('')} /> : undefined} style={{ backgroundColor: colors.surface, fontSize: 14 }} outlineStyle={{ borderRadius: 12 }} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{([{ value: 'all', label: 'All', icon: 'grid' }, { value: 'low', label: 'Low stock', icon: 'alert-circle' }, { value: 'out', label: 'Out of stock', icon: 'x-circle' }] as const).map(option => <TouchableRipple key={option.value} accessibilityRole="radio" accessibilityLabel={option.label} accessibilityState={{ selected: filter === option.value }} onPress={() => setFilter(option.value)} borderless style={[market.pill, filter === option.value && { backgroundColor: colors.primary, borderColor: colors.primary }]}><View style={market.action}><Icon name={option.icon} size={14} color={filter === option.value ? '#FFFFFF' : option.value === 'all' ? colors.primary : colors.alert} /><Text style={[market.small, { color: filter === option.value ? '#FFFFFF' : colors.text }]}>{option.label}</Text></View></TouchableRipple>)}</View>
        <Text style={market.small}>{products.length} {products.length === 1 ? 'product' : 'products'}{filter === 'low' ? ' needing attention (including out of stock)' : ''}</Text>
        <View style={{ gap: 6 }}>{products.map(p => <MarketProduct key={p.id} product={p} />)}{!products.length && <EmptyState kind="inventory" title={db.products.length ? 'No matching products' : 'Make room for your first product'} message={db.products.length ? 'Try another name or SKU, or change the stock filter.' : 'Add a product to start keeping track of your shelves.'} action={db.products.length ? 'Clear filters' : 'Add product'} onPress={db.products.length ? () => { setSearch(''); setFilter('all'); } : () => router.push('/inventory/new')} />}</View>
      </View>
    </ScrollView>
    <View style={[market.content, { paddingHorizontal: 20, paddingVertical: 10, alignItems: 'flex-end' }]}><MarketAction label="Add product" icon="plus" filled onPress={() => router.push('/inventory/new')} /></View>
  </SafeAreaView>;
}
