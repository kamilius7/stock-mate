import React from 'react';
import { View } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { router } from 'expo-router';
import { useShop } from '../../state/ShopProvider';
import { BrandMark, Card, Heading, Icon, Info, Screen } from '../../components/stockmate/ui';
import { colors, styles } from '../../theme/stockmateTheme';
export default function More() {
  const { db, setFilter, setSearch } = useShop();
  const actions = [
    { title: 'Add product', description: 'Give a new item a place on your shelves', icon: 'plus' as const, onPress: () => router.push('/inventory/new') },
    { title: 'Receive stock', description: 'Record a delivery and update quantities', icon: 'download' as const, onPress: () => router.push('/inventory/receive') },
    { title: 'Low-stock items', description: 'See which shelves need attention', icon: 'alert-circle' as const, onPress: () => { setFilter('low'); setSearch(''); router.navigate('/inventory'); } },
    { title: 'Shop details', description: 'Name, contact and receipt details', icon: 'home' as const, onPress: () => router.push('/settings/shop') },
  ];
  return <Screen title="More" subtitle="The little things that keep your shop going."><Card><View style={styles.row}><BrandMark size={52} /><View style={styles.grow}><Text variant="titleLarge">{db.shop.name}</Text><Text variant="bodyMedium" style={styles.muted}>One shop · XAF · on-device storage</Text></View></View></Card><Heading>Your shop</Heading><View style={{ gap: 12 }}>{actions.map(a => <TouchableRipple key={a.title} onPress={a.onPress} accessibilityRole="button" accessibilityLabel={`${a.title}. ${a.description}`} style={{ borderRadius: 16, backgroundColor: colors.surface }} borderless><View style={{ padding: 20, gap: 14, flexDirection: 'row', alignItems: 'center' }}><Icon name={a.icon} /><View style={styles.grow}><Text variant="titleMedium">{a.title}</Text><Text variant="bodyMedium" style={styles.muted}>{a.description}</Text></View><Icon name="chevron-right" color={colors.muted} /></View></TouchableRipple>)}</View><Heading>Made for the everyday</Heading><Info>This shop contains demo products and sales. Changes are saved only on this device. Removing the app or clearing its storage deletes this data. There is no cloud backup or account.</Info><Text variant="bodyMedium" style={styles.muted}>StockMate records stock and sales, not payments. Taxes and discounts are not configured in this version. Estimated gross profit does not include shop expenses.</Text><Text variant="bodyMedium" style={{ color: colors.primary }}>StockMate · Version 1.0</Text></Screen>;
}
