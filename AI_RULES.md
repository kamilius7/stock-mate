# StockMate native app

- Expo SDK 54, React Native, TypeScript; Expo Go compatible. Metro handles native and web preview. Do not restore Vite or HTML UI.
- Expo Router routes live in src/app/ (four tabs and pushed stack screens). Native screen components live in src/screens/; shared UI in src/components/stockmate/.
- Compose React Native Paper and React Native primitives. No shadcn, Radix, Tailwind CSS or DOM components in native code.
- Central tokens and Paper theming: src/theme/stockmateTheme.ts. Preserve readable scaling text, safe areas, 48dp touch targets and explicit status words.
- Local AsyncStorage single-snapshot repository: src/services/storage.ts. Pure inventory/sale transactions validated and serialized before persistence. No backend, sign-in or payment processor.
- XAF exponent is zero; monetary amounts are safe integers in francs. Prevent case-insensitive duplicate product names and negative inventory; preserve historical sale price/cost/shop snapshots.
- Demo fixtures live outside screens and are explicitly labeled. Tax and discount rules are not configured; do not show controls.
- build runs pure workflow checks followed by Expo export for all three platforms (bundles, not native app-store binaries).
