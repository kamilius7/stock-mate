import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { Platform, StyleSheet } from 'react-native';

export const colors = {
  background: '#F6F7F2', surface: '#FFFFFF', text: '#172B2A', muted: '#52615D',
  primary: '#176B57', sage: '#E6F1EB', warning: '#805500', warningBg: '#FFF3D9',
  error: '#9E332A', errorBg: '#FDEEEB', border: '#D9E2DC', soft: '#EFF2EC',
};
export const tokens = {
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 8, md: 16, lg: 24 },
  elevation: { flat: 0, raised: 1 },
  type: { body: 18, supporting: 16, section: 22, title: 32, figure: 36 },
  button: { height: 54, radius: 12 },
};
export function createTheme(fontsLoaded: boolean) {
  const body = fontsLoaded ? 'Atkinson' : Platform.select({ ios: 'System', default: 'sans-serif' });
  const heading = fontsLoaded ? 'InterSemiBold' : body;
  return {
    ...MD3LightTheme,
    roundness: 4,
    colors: { ...MD3LightTheme.colors, primary: colors.primary, onPrimary: '#FFFFFF', primaryContainer: colors.sage,
      onPrimaryContainer: colors.primary, secondary: colors.muted, secondaryContainer: colors.sage,
      onSecondaryContainer: colors.text, background: colors.background, surface: colors.surface,
      surfaceVariant: colors.soft, onSurface: colors.text, onSurfaceVariant: colors.muted,
      outline: colors.border, outlineVariant: colors.border, error: colors.error, errorContainer: colors.errorBg },
    fonts: configureFonts({ config: {
      bodyLarge: { fontFamily: body, fontSize: 18, lineHeight: 26, letterSpacing: 0 },
      bodyMedium: { fontFamily: body, fontSize: 16, lineHeight: 23, letterSpacing: 0 },
      bodySmall: { fontFamily: body, fontSize: 15, lineHeight: 21, letterSpacing: 0 },
      titleLarge: { fontFamily: heading, fontSize: 22, lineHeight: 30, letterSpacing: -0.4 },
      titleMedium: { fontFamily: heading, fontSize: 18, lineHeight: 26, letterSpacing: -0.2 },
      headlineLarge: { fontFamily: heading, fontSize: 32, lineHeight: 40, letterSpacing: -1 },
      headlineMedium: { fontFamily: heading, fontSize: 28, lineHeight: 36, letterSpacing: -0.7 },
      displaySmall: { fontFamily: heading, fontSize: 36, lineHeight: 44, letterSpacing: -1 },
      labelLarge: { fontFamily: heading, fontSize: 17, lineHeight: 24, letterSpacing: 0 },
      labelMedium: { fontFamily: body, fontSize: 16, lineHeight: 22, letterSpacing: 0 },
      labelSmall: { fontFamily: body, fontSize: 15, lineHeight: 21, letterSpacing: 0 },
    } }),
    animation: { scale: 0 },
  };
}
export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  grow: { flex: 1, minWidth: 0 },
  muted: { color: colors.muted },
  money: { fontVariant: ['tabular-nums'] },
  divider: { height: 1, backgroundColor: colors.border },
});
