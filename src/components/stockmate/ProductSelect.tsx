import React, { useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { Button, Dialog, Portal, Text, TouchableRipple } from 'react-native-paper';
import type { Product } from '../../types/models';
import { Search, StockMateButton } from './ui';
import { colors, styles } from '../../theme/stockmateTheme';

export function ProductSelect({ products, value, onChange }: { products: Product[]; value: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { height } = useWindowDimensions();
  const selected = products.find(p => p.id === value);
  const filtered = products.filter(p => `${p.name} ${p.sku}`.toLowerCase().includes(query.toLowerCase()));
  return <View style={{ gap: 8 }}>
    <Text variant="bodyMedium">Product (required)</Text>
    <StockMateButton mode="outlined" icon="chevron-down" onPress={() => setOpen(true)}>{selected?.name ?? 'Choose a product'}</StockMateButton>
    <Portal><Dialog visible={open} onDismiss={() => setOpen(false)} style={{ backgroundColor: colors.surface, maxWidth: 560, width: '90%', alignSelf: 'center' }}>
      <Dialog.Title>Choose a product</Dialog.Title>
      <Dialog.Content><Search value={query} onChangeText={setQuery} /></Dialog.Content>
      <Dialog.ScrollArea style={{ maxHeight: Math.min(340, Math.max(100, height - 280)) }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          {filtered.map(p => <TouchableRipple key={p.id} accessibilityRole="button" accessibilityLabel={`${p.name}, ${p.quantity} in stock`} onPress={() => { onChange(p.id); setOpen(false); }}>
            <View style={{ paddingVertical: 18, gap: 4, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <Text variant="titleMedium">{p.name}</Text><Text variant="bodyMedium" style={styles.muted}>{p.quantity} units in stock · {p.sku || p.category}</Text>
            </View>
          </TouchableRipple>)}
          {!filtered.length && <Text style={{ paddingVertical: 20 }}>No matching products. Try another name or SKU.</Text>}
        </ScrollView>
      </Dialog.ScrollArea>
      <Dialog.Actions><Button onPress={() => setOpen(false)} contentStyle={{ minHeight: 48 }}>Cancel</Button></Dialog.Actions>
    </Dialog></Portal>
  </View>;
}
