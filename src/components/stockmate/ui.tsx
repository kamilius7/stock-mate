import React from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Button, Dialog, IconButton, Portal, Text, TextInput, TouchableRipple } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Svg, { Path, Rect } from 'react-native-svg';
import { router } from 'expo-router';
import { colors, styles, tokens } from '../../theme/stockmateTheme';

type IconName = React.ComponentProps<typeof Feather>['name'];
export function Icon({ name, size = 22, color = colors.primary }: { name: IconName; size?: number; color?: string }) {
  return <Feather name={name} size={size} color={color} accessible={false} importantForAccessibility="no" />;
}
export function BrandMark({ size = 44 }: { size?: number }) {
  return <View accessible={false} style={{ width: size, height: size, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}><Svg width={size * .65} height={size * .65} viewBox="0 0 32 32"><Rect x="5" y="12" width="22" height="15" rx="3" stroke="white" strokeWidth="2" fill="none" /><Path d="M4 12L8 5h16l4 7M10 12v4m6-4v4m6-4v4M12 22l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></Svg></View>;
}
export function StockMateButton({ children, onPress, mode = 'contained', icon, disabled, loading }: { children: string; onPress: () => void; mode?: 'contained' | 'outlined' | 'text' | 'contained-tonal'; icon?: IconName; disabled?: boolean; loading?: boolean }) {
  return <Button mode={mode} onPress={onPress} disabled={disabled || loading} loading={loading} accessibilityLabel={children}
    icon={icon ? ({ size, color }) => <Icon name={icon} size={size} color={color} /> : undefined}
    style={{ borderRadius: tokens.button.radius, borderColor: colors.border }} contentStyle={{ minHeight: tokens.button.height, paddingHorizontal: 4 }} labelStyle={{ marginVertical: 12 }}>{children}</Button>;
}
export function Screen({ title, subtitle, back = false, onBack, children, footer }: { title: string; subtitle?: string; back?: boolean; onBack?: () => void; children: React.ReactNode; footer?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return <SafeAreaView edges={['top', 'left', 'right']} style={ui.screen}><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 24, gap: 24, paddingBottom: footer ? 24 : 32 + (back ? insets.bottom : 0) }}>
      <View style={{ gap: 12 }}>{back && <View style={{ alignSelf: 'flex-start' }}><StockMateButton mode="text" icon="arrow-left" onPress={onBack ?? (() => router.canGoBack() ? router.back() : router.replace('/'))}>Back</StockMateButton></View>}
        <Text variant="headlineLarge" accessibilityRole="header">{title}</Text>{subtitle && <Text variant="bodyLarge" style={styles.muted}>{subtitle}</Text>}
      </View>{children}
    </ScrollView>
    {footer && <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: Math.max(16, back ? insets.bottom : 0), gap: 12, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface }}>{footer}</View>}
  </KeyboardAvoidingView></SafeAreaView>;
}
export function Card({ children, tone = 'white' }: { children: React.ReactNode; tone?: 'white' | 'sage' | 'warning' }) {
  return <View style={[ui.card, { backgroundColor: tone === 'sage' ? colors.sage : tone === 'warning' ? colors.warningBg : colors.surface }]}>{children}</View>;
}
export function Heading({ children, action, onPress, count }: { children: string; action?: string; onPress?: () => void; count?: number }) {
  return <View style={[styles.row, { justifyContent: 'space-between', flexWrap: 'wrap' }]}><View style={styles.row}><Text variant="titleLarge" accessibilityRole="header">{children}</Text>{count !== undefined && <Text style={ui.counter}>{count}</Text>}</View>{action && <Button mode="text" onPress={onPress} contentStyle={{ minHeight: 48 }} labelStyle={{ marginHorizontal: 0 }}>{action}</Button>}</View>;
}
export function Info({ children, warning = false }: { children: string; warning?: boolean }) {
  return <View style={{ padding: 16, borderRadius: 12, backgroundColor: warning ? colors.warningBg : colors.sage, gap: 8, flexDirection: 'row' }}><Icon name={warning ? 'alert-circle' : 'info'} color={warning ? colors.warning : colors.primary} /><Text variant="bodyMedium" style={{ flex: 1, color: warning ? colors.warning : colors.text }}>{children}</Text></View>;
}
export function ErrorMessage({ message }: { message: string }) {
  return message ? <Text accessibilityRole="alert" accessibilityLiveRegion="polite" variant="bodyMedium" style={{ color: colors.error, padding: 12, borderRadius: 8, backgroundColor: colors.errorBg }}>{message}</Text> : null;
}
export function Field({ label, value, onChangeText, placeholder, numeric = false, optional = false, error, helper, multiline = false }: { label: string; value: string; onChangeText: (v: string) => void; placeholder?: string; numeric?: boolean; optional?: boolean; error?: string; helper?: string; multiline?: boolean }) {
  const fullLabel = `${label} (${optional ? 'optional' : 'required'})`;
  return <View style={{ gap: 6 }}><Text variant="bodyMedium">{fullLabel}</Text><TextInput mode="outlined" value={value} onChangeText={onChangeText} accessibilityLabel={fullLabel} placeholder={placeholder} keyboardType={numeric ? 'number-pad' : 'default'} inputMode={numeric ? 'numeric' : 'text'} multiline={multiline} error={!!error} style={{ backgroundColor: colors.surface, fontSize: 18 }} outlineStyle={{ borderRadius: 10 }} />{error ? <ErrorMessage message={error} /> : helper ? <Text variant="bodyMedium" style={styles.muted}>{helper}</Text> : null}</View>;
}
export function Search({ value, onChangeText, placeholder = 'Search name or SKU' }: { value: string; onChangeText: (v: string) => void; placeholder?: string }) {
  return <TextInput mode="outlined" value={value} onChangeText={onChangeText} placeholder={placeholder} accessibilityLabel={placeholder} outlineStyle={{ borderRadius: 14 }} style={{ backgroundColor: colors.surface, fontSize: 18 }} left={<TextInput.Icon icon="magnify" />} right={value ? <TextInput.Icon icon="close" accessibilityLabel="Clear search" onPress={() => onChangeText('')} /> : undefined} />;
}
export function Choices<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{options.map(option => <TouchableRipple key={option.value} accessibilityRole="radio" accessibilityLabel={option.label} accessibilityState={{ selected: value === option.value }} onPress={() => onChange(option.value)} style={{ borderRadius: 12, backgroundColor: value === option.value ? colors.sage : colors.surface, borderWidth: 1, borderColor: value === option.value ? colors.primary : colors.border, flexGrow: 1 }} borderless><View style={{ minHeight: 50, padding: 12, alignItems: 'center', justifyContent: 'center' }}><Text variant="bodyMedium" style={{ color: value === option.value ? colors.primary : colors.muted, fontWeight: value === option.value ? '700' : '400' }}>{option.label}</Text></View></TouchableRipple>)}</View>;
}
export function EmptyState({ kind, title, message, action, onPress }: { kind: 'inventory' | 'sales'; title: string; message: string; action?: string; onPress?: () => void }) {
  return <Card><View style={{ alignItems: 'center', gap: 16 }}><Image source={kind === 'inventory' ? require('../../assets/empty-inventory.png') : require('../../assets/empty-sales.png')} resizeMode="contain" accessible={false} style={{ height: 140, width: 210, borderRadius: 16 }} /><Text variant="titleLarge" style={{ textAlign: 'center' }}>{title}</Text><Text variant="bodyLarge" style={{ textAlign: 'center', color: colors.muted }}>{message}</Text>{action && onPress && <StockMateButton onPress={onPress}>{action}</StockMateButton>}</View></Card>;
}
export function ConfirmDialog({ visible, title, children, onCancel, onConfirm, busy, confirmLabel = 'Confirm' }: { visible: boolean; title: string; children: React.ReactNode; onCancel: () => void; onConfirm: () => void; busy?: boolean; confirmLabel?: string }) {
  const { height } = useWindowDimensions();
  return <Portal><Dialog visible={visible} onDismiss={busy ? undefined : onCancel} dismissable={!busy} style={{ backgroundColor: colors.surface, borderRadius: 24, maxWidth: 560, width: '90%', alignSelf: 'center' }}><Dialog.Title>{title}</Dialog.Title><Dialog.ScrollArea style={{ borderTopWidth: 0, borderBottomWidth: 0, maxHeight: Math.min(360, Math.max(100, height - 250)) }}><ScrollView contentContainerStyle={{ gap: 16, paddingVertical: 8 }}>{children}</ScrollView></Dialog.ScrollArea><Dialog.Actions style={{ flexWrap: 'wrap', gap: 8 }}><StockMateButton mode="text" onPress={onCancel} disabled={busy}>Cancel</StockMateButton><StockMateButton onPress={onConfirm} loading={busy}>{confirmLabel}</StockMateButton></Dialog.Actions></Dialog></Portal>;
}
export function QuantityControls({ name, quantity, onDecrease, onIncrease, max }: { name: string; quantity: number; onDecrease: () => void; onIncrease: () => void; max: number }) {
  return <View style={[styles.row, { gap: 8 }]}><IconButton icon="minus" mode="outlined" size={22} style={{ margin: 0, width: 48, height: 48, borderRadius: 12, borderColor: colors.border }} accessibilityLabel={`Remove one ${name}`} onPress={onDecrease} /><Text style={[styles.money, { minWidth: 24, textAlign: 'center' }]} accessibilityLabel={`${quantity} units`}>{quantity}</Text><IconButton icon="plus" mode="outlined" size={22} style={{ margin: 0, width: 48, height: 48, borderRadius: 12, borderColor: colors.border }} accessibilityLabel={`Add one ${name}`} onPress={onIncrease} disabled={quantity >= max} /></View>;
}
export const ui = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  card: { borderWidth: 1, borderColor: colors.border, padding: 20, borderRadius: 20, gap: 16 },
  counter: { backgroundColor: colors.warningBg, color: colors.warning, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, overflow: 'hidden', fontSize: 16 },
});
