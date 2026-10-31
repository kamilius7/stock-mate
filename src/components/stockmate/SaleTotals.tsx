import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { money, subtotal } from '../../services/calculations';
import type { SaleLine } from '../../types/models';
import { styles } from '../../theme/stockmateTheme';
export function SaleTotals({ lines }: { lines: SaleLine[] }) {
  const total = subtotal(lines);
  return <View style={{ gap: 16 }}><View style={[styles.row, { justifyContent: 'space-between', flexWrap: 'wrap' }]}><Text>Subtotal</Text><Text style={styles.money}>{money(total)}</Text></View><View style={styles.divider} /><View style={[styles.row, { justifyContent: 'space-between', flexWrap: 'wrap' }]}><Text variant="titleLarge">Total</Text><Text variant="headlineMedium" style={styles.money}>{money(total)}</Text></View></View>;
}
