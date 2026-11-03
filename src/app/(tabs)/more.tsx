import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TouchableRipple } from 'react-native-paper';
import { router } from 'expo-router';
import { useShop } from '../../state/ShopProvider';
import { BrandMark, Icon } from '../../components/stockmate/ui';
import { colors } from '../../theme/stockmateTheme';
import { market, MarketHeader } from '../../screens/MarketDay';

export default function More() {
  const { db, setFilter, setSearch } = useShop();
  const actions = [
    { title: 'Add product', description: 'Give a new item a place on your shelves', icon: 'plus' as const, onPress: () => router.push('/inventory/new') },
    { title: 'Receive stock', description: 'Record a delivery and update quantities', icon: 'download' as const, onPress: () => router.push('/inventory/receive') },
    { title: 'Low-stock items', description: 'See which shelves need attention', icon: 'alert-circle' as const, onPress: () => { setFilter('low'); setSearch(''); router.navigate('/inventory'); } },
    { title: 'Shop details', description: 'Name, contact and receipt details', icon: 'home' as const, onPress: () => router.push('/settings/shop') },
  ];
  return <SafeAreaView edges={['top', 'left', 'right']} style={market.screen}>
    <ScrollView contentContainerStyle={[market.content, { paddingBottom: 24 }]}>
      <MarketHeader>
        <View style={market.section}><Text accessibilityRole="header" style={[market.heading, { fontSize: 24, lineHeight: 32, color: colors.onPrimary }]}>More</Text><Icon name="grid" size={22} color={colors.onPrimary} /></View>
        <Text style={[market.small, { color: colors.onPrimary }]}>The little things that keep your shop going.</Text>
      </MarketHeader>
      <View style={market.body}>
        <View style={market.panel}><View style={market.row}><BrandMark size={48} /><View style={{ flex: 1, minWidth: 0 }}><Text style={market.heading}>{db.shop.name}</Text><Text style={market.small}>One shop · XAF · on-device storage</Text></View></View><View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 6, backgroundColor: colors.sage }}><Icon name="smartphone" size={14} /><Text style={[market.small, { color: colors.primary }]}>Demo data · Saved on device</Text></View></View>
        <Text accessibilityRole="header" style={market.heading}>Your shop</Text>
        <View style={{ gap: 6 }}>{actions.map(a => <TouchableRipple key={a.title} onPress={a.onPress} accessibilityRole="button" accessibilityLabel={`${a.title}. ${a.description}`} style={{ borderRadius: 12, backgroundColor: colors.surface }} borderless>
          <View style={{ padding: 12, gap: 10, flexDirection: 'row', alignItems: 'center', minHeight: 72 }}><View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: a.title === 'Low-stock items' ? colors.warningBg : colors.sage, alignItems: 'center', justifyContent: 'center' }}><Icon name={a.icon} size={21} color={a.title === 'Low-stock items' ? colors.alert : colors.primary} /></View><View style={{ flex: 1, minWidth: 0, gap: 2 }}><Text style={[market.label, market.number]}>{a.title}</Text><Text style={market.small}>{a.description}</Text></View><Icon name="chevron-right" size={18} color={colors.muted} /></View>
        </TouchableRipple>)}</View>
        <Text accessibilityRole="header" style={market.heading}>Made for the everyday</Text>
        <View style={market.panel}><View style={market.row}><Icon name="smartphone" size={19} /><Text style={[market.label, market.number, { flex: 1 }]}>Your shop stays on this device</Text></View><Text style={market.small}>This shop contains demo products and sales. Changes are saved only on this device. Removing the app or clearing its storage deletes this data. There is no cloud backup or account.</Text></View>
        <View style={market.panel}><View style={market.row}><Icon name="info" size={19} color={colors.info} /><Text style={[market.label, market.number, { flex: 1 }]}>Stock and sales, not payments</Text></View><Text style={market.small}>StockMate records stock and sales, not payments. Taxes and discounts are not configured in this version. Estimated gross profit does not include shop expenses.</Text></View>
        <View style={[market.row, { justifyContent: 'center', paddingVertical: 8 }]}><Icon name="check-circle" size={16} /><Text style={[market.small, { color: colors.primary }]}>StockMate · Version 1.0</Text></View>
      </View>
    </ScrollView>
  </SafeAreaView>;
}
