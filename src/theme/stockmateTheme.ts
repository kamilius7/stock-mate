import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { Platform, StyleSheet } from 'react-native';

export const colors = {
  background: '#F4F7F5', surface: '#FFFFFF', text: '#102A26', muted: '#6B7C78',
  primary: '#123F36', onPrimary: '#FFFFFF', accent: '#FF765F', onAccent: '#2B1712',
  alert: '#D95B4A', info: '#4778A8', infoBg: '#EAF2F8',
  sage: '#E3F0EA', warning: '#D95B4A', warningBg: '#FFF0ED',
  error: '#D95B4A', errorBg: '#FFF0ED', border: '#DCE8E3', soft: '#EEF4F1',
};
export const categoryPalette = {
  Drinks: '#2F73D9', Food: '#E8782A', Household: '#7A4FC4',
  Airtime: '#D9437B', Toiletries: '#14959A',
};
export const categoryColors: Record<string, string> = {
  ...categoryPalette,
  Pantry: categoryPalette.Food, Dairy: categoryPalette.Food, Bakery: categoryPalette.Food,
};
export const fontFamilies = { body: 'Inter', heading: 'SoraSemiBold', number: 'InterSemiBold' };
export const soraFontSource = { uri: 'https://raw.githubusercontent.com/sora-xor/sora-font/master/fonts/ttf/Sora-SemiBold.ttf' };
export const tokens = {
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 8, md: 16, lg: 24 },
  elevation: { flat: 0, raised: 1 },
  type: { body: 18, supporting: 16, section: 22, title: 32, figure: 36 },
  button: { height: 54, radius: 12 },
  contentWidth: 480,
};
export function createTheme(bodyLoaded: boolean, headingsLoaded = bodyLoaded) {
  const system = Platform.select({ ios: 'System', default: 'sans-serif' });
  const body = bodyLoaded ? fontFamilies.body : system;
  const heading = headingsLoaded ? fontFamilies.heading : body;
  return {
    ...MD3LightTheme,
    roundness: 4,
    colors: { ...MD3LightTheme.colors, primary: colors.primary, onPrimary: colors.onPrimary, primaryContainer: colors.sage,
      onPrimaryContainer: colors.primary, secondary: colors.muted, secondaryContainer: colors.sage,
      onSecondaryContainer: colors.text, tertiary: colors.info, tertiaryContainer: colors.infoBg,
      onTertiaryContainer: colors.info, background: colors.background, surface: colors.surface,
      surfaceVariant: colors.soft, onSurface: colors.text, onSurfaceVariant: colors.muted,
      outline: colors.border, outlineVariant: colors.border, error: colors.error, errorContainer: colors.errorBg },
    fonts: { ...configureFonts({ config: {
      bodyLarge: { fontFamily: body, fontSize: 18, lineHeight: 26, letterSpacing: 0 },
      bodyMedium: { fontFamily: body, fontSize: 16, lineHeight: 23, letterSpacing: 0 },
      bodySmall: { fontFamily: body, fontSize: 15, lineHeight: 21, letterSpacing: 0 },
      titleLarge: { fontFamily: heading, fontSize: 22, lineHeight: 30, letterSpacing: -0.4 },
      titleMedium: { fontFamily: heading, fontSize: 18, lineHeight: 26, letterSpacing: -0.2 },
      titleSmall: { fontFamily: heading },
      headlineLarge: { fontFamily: heading, fontSize: 32, lineHeight: 40, letterSpacing: -1 },
      headlineMedium: { fontFamily: heading, fontSize: 28, lineHeight: 36, letterSpacing: -0.7 },
      headlineSmall: { fontFamily: heading },
      displaySmall: { fontFamily: heading, fontSize: 36, lineHeight: 44, letterSpacing: -1 },
      displayMedium: { fontFamily: heading },
      displayLarge: { fontFamily: heading },
      labelLarge: { fontFamily: body, fontSize: 17, lineHeight: 24, letterSpacing: 0 },
      labelMedium: { fontFamily: body, fontSize: 16, lineHeight: 22, letterSpacing: 0 },
      labelSmall: { fontFamily: body, fontSize: 15, lineHeight: 21, letterSpacing: 0 },
    } }), default: { ...MD3LightTheme.fonts.default, fontFamily: body, letterSpacing: 0 } },
    animation: { scale: 0 },
  };
}
export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  grow: { flex: 1, minWidth: 0 },
  muted: { color: colors.muted },
  money: { fontFamily: fontFamilies.number, fontVariant: ['tabular-nums'] },
  divider: { height: 1, backgroundColor: colors.border },
});
