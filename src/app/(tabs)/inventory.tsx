import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { router } from 'expo-router';
import { useShop } from '../../state/ShopProvider';
import { Screen, Search, Choices, EmptyState, StockMateButton } from '../../components/stockmate/ui';
import { ProductRow } from '../../components/stockmate/rows';
import { colors } from '../../theme/stockmateTheme';
export default function Inventory() {
  const { db, search, setSearch, filter, setFilter } = useShop();
  const query = search.trim().toLowerCase();
  const products = db.products.filter(p => (!query || `${p.name} ${p.sku}`.toLowerCase().includes(query)) && (filter === 'all' || (filter === 'out' ? p.quantity === 0 : p.quantity <= p.threshold))).sort((a, b) => a.name.localeCompare(b.name));
  return <Screen title="Inventory" subtitle="Know what’s on your shelves." footer={<StockMateButton icon="plus" onPress={() => router.push('/inventory/new')}>Add product</StockMateButton>}>
    <Search value={search} onChangeText={setSearch} /><Choices value={filter} onChange={setFilter} options={[{ value: 'all', label: 'All' }, { value: 'low', label: 'Low stock' }, { value: 'out', label: 'Out of stock' }]} />
    <Text variant="bodyMedium" style={{ color: colors.muted }}>{products.length} {products.length === 1 ? 'product' : 'products'}{filter === 'low' ? ' needing attention (including out of stock)' : ''} · Demo inventory</Text>
    <View style={{ gap: 12 }}>{products.map(p => <ProductRow key={p.id} product={p} />)}{!products.length && <EmptyState kind="inventory" title={db.products.length ? 'No matching products' : 'Make room for your first product'} message={db.products.length ? 'Try another name or SKU, or change the stock filter.' : 'Add a product to start keeping track of your shelves.'} action={db.products.length ? 'Clear filters' : 'Add product'} onPress={db.products.length ? () => { setSearch(''); setFilter('all'); } : () => router.push('/inventory/new')} />}</View>
  </Screen>;
}
