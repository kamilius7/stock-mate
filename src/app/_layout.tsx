import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { PaperProvider, Snackbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Inter_600SemiBold } from '@expo-google-fonts/inter';
import { AtkinsonHyperlegible_400Regular } from '@expo-google-fonts/atkinson-hyperlegible';
import { ShopProvider, useShop } from '../state/ShopProvider';
import { colors, createTheme } from '../theme/stockmateTheme';

export const unstable_settings = { initialRouteName: '(tabs)' };
function Navigator() {
  const { notice, notify } = useShop();
  return <><Stack screenOptions={{ headerShown: false, animation: 'none', contentStyle: { backgroundColor: colors.background } }}><Stack.Screen name="(tabs)" /></Stack><Snackbar visible={!!notice} onDismiss={() => notify('')} duration={4500} action={{ label: 'Dismiss', onPress: () => notify('') }} style={{ marginBottom: 100, backgroundColor: colors.text }}>{notice}</Snackbar></>;
}
export default function RootLayout() {
  const [loaded] = useFonts({ InterSemiBold: Inter_600SemiBold, Atkinson: AtkinsonHyperlegible_400Regular });
  return <SafeAreaProvider><PaperProvider theme={createTheme(loaded)}><StatusBar style="dark" /><View style={{ flex: 1, width: '100%', maxWidth: 900, alignSelf: 'center', backgroundColor: colors.background }}><ShopProvider><Navigator /></ShopProvider></View></PaperProvider></SafeAreaProvider>;
}
