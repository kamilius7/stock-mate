import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { PaperProvider, Snackbar } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { ShopProvider, useShop } from '../state/ShopProvider';
import { colors, createTheme, soraFontSource, tokens } from '../theme/stockmateTheme';
import { SkeletonScreen } from '../components/stockmate/SkeletonScreen';

export const unstable_settings = { initialRouteName: '(tabs)' };
function Navigator() {
  const { notice, notify } = useShop();
  return <><Stack screenOptions={{ headerShown: false, animation: 'fade', animationDuration: 220, contentStyle: { backgroundColor: colors.background } }}><Stack.Screen name="(tabs)" /></Stack><Snackbar visible={!!notice} onDismiss={() => notify('')} duration={4500} action={{ label: 'Dismiss', onPress: () => notify('') }} style={{ marginBottom: 100, backgroundColor: colors.text }}>{notice}</Snackbar></>;
}
export default function RootLayout() {
  const [loaded] = useFonts({ Inter: Inter_400Regular, InterSemiBold: Inter_600SemiBold });
  const [headingsLoaded] = useFonts({ SoraSemiBold: soraFontSource });
  if (!loaded || !headingsLoaded) return <SafeAreaProvider style={{ backgroundColor: colors.background }}><SkeletonScreen /></SafeAreaProvider>;
  return <SafeAreaProvider style={{ backgroundColor: colors.background }}><PaperProvider theme={createTheme(loaded, headingsLoaded)}><StatusBar style="dark" backgroundColor={colors.background} /><View style={{ flex: 1, width: '100%', maxWidth: tokens.contentWidth, alignSelf: 'center', backgroundColor: colors.background }}><ShopProvider><Navigator /></ShopProvider></View></PaperProvider></SafeAreaProvider>;
}
