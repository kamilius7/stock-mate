import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import type { Product } from '../../types/models';
import { money } from '../../services/calculations';
import { Card, QuantityControls } from './ui';
import { styles } from '../../theme/stockmateTheme';
export function CartLine({ product, quantity, onChange }: { product: Product; quantity: number; onChange: (q: number) => void }) {
  return <Card><Text variant="titleMedium">{product.name}</Text><View style={[styles.row, { justifyContent: 'space-between', flexWrap: 'wrap' }]}><Text variant="bodyMedium" style={styles.muted}>{money(product.price)} × {quantity}</Text><Text variant="titleMedium" style={styles.money}>{money(product.price * quantity)}</Text></View><View style={[styles.row, { justifyContent: 'space-between', flexWrap: 'wrap' }]}><QuantityControls name={product.name} quantity={quantity} max={product.quantity} onDecrease={() => onChange(quantity - 1)} onIncrease={() => onChange(quantity + 1)} /><Button onPress={() => onChange(0)} accessibilityLabel={`Remove ${product.name} from sale`} contentStyle={{ minHeight: 48 }}>Remove</Button></View></Card>;
}
