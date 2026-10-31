import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import type { Sale } from '../../types/models';
import { summary, money } from '../../services/calculations';
import { colors, styles } from '../../theme/stockmateTheme';
import { Card, Icon, Info } from './ui';
export function SalesSummary({ sales, today = false }: { sales: Sale[]; today?: boolean }) {
  const totals = summary(sales);
  return <View style={{ gap: 12 }}>
    <View style={{ padding: 24, borderRadius: 22, backgroundColor: colors.primary, gap: 12 }}><View style={[styles.row, { justifyContent: 'space-between' }]}><Text variant="bodyLarge" style={{ color: '#FFFFFF' }}>{today ? 'Sales revenue today' : 'Sales revenue'}</Text><Icon name="trending-up" color="#FFFFFF" /></View><Text variant="displaySmall" style={[styles.money, { color: '#FFFFFF' }]}>{money(totals.revenue)}</Text><Text variant="bodyMedium" style={{ color: '#FFFFFF' }}>Every sale, accounted for.</Text></View>
    <View style={styles.wrap}><View style={{ flex: 1, minWidth: 140 }}><Card><Icon name="shopping-bag" /><Text variant="bodyMedium" style={styles.muted}>{today ? 'Sales today' : 'Recorded sales'}</Text><Text variant="headlineMedium" style={styles.money}>{totals.count}</Text><Text variant="bodyMedium" style={styles.muted}>{totals.items} items sold</Text></Card></View><View style={{ flex: 1, minWidth: 140 }}><Card><Icon name="pie-chart" /><Text variant="bodyMedium" style={styles.muted}>Estimated gross profit</Text><Text variant={totals.incomplete ? 'titleLarge' : 'headlineMedium'} style={styles.money}>{totals.profit === null ? 'Incomplete' : money(totals.profit)}</Text><Text variant="bodyMedium" style={styles.muted}>Before shop expenses</Text></Card></View></View>
    {totals.incomplete && <Info warning>Purchase costs are missing for some sold items. Gross profit is incomplete; we won’t guess. Adding costs now won’t change past receipts.</Info>}
  </View>;
}
