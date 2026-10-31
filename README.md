# StockMate

A native iOS and Android application built with **Expo SDK 54, React Native 0.81, TypeScript, Expo Router and React Native Paper**. Metro also renders the same native components through React Native Web for Dyad's browser preview. No Vite, HTML screens, web dashboard, shadcn or Radix is used by the app.

## Preview and run

Open the exported project in an Expo-capable development environment with Node 20.19+ and install its package dependencies using that environment's package manager UI. Launch the **start** package script to open Expo's development server and QR code. On a phone, use an **Expo Go version supporting SDK 54** and scan the QR code (iOS Camera / Android Expo Go). Phone and development computer need reachable network access. SDK-specific Android and simulator versions are available from expo.dev/go; a physical iPhone may need a development build if the App Store Expo Go no longer supports SDK 54.

The **dev** script starts Metro's web preview on port 8080 for Dyad. The **android** and **ios** scripts open connected emulators/simulators; the **web** script opens the same app in a browser. A browser preview alone is not proof of an Expo Go device test.

The **typecheck**, **lint**, **test** and **doctor** package scripts provide their respective checks. **build** runs the workflow tests and exports production JavaScript/assets for Android, iOS and web into `dist`. Export does not create an APK, IPA or App Store submission; signing and native release builds are separate deployment steps.

## Included workflows

- Four tabs: Home, Inventory, Sales, More; details/forms/review/receipts are stack routes under `src/app`.
- Add/edit products; case-insensitive duplicate-name prevention; name/SKU search and All/Low/Out filters preserved while navigating.
- Receive deliveries; damage/expiry, resellable returns and counted-total corrections. Live previews, review, large-change warnings and negative-stock prevention.
- Product movement history with every stock change and links to sale receipts.
- Sale cart, quantity controls, review and recorded payment method. Confirmation stores the receipt and inventory movements as one complete local snapshot. Stale reviewed stock/prices are checked again.
- Unique sequential receipt numbers, snapshot product prices/costs/shop details, native iOS/Android text sharing via the system share sheet.
- Today, Last 7 days (today plus preceding six calendar days) and All time revenue, sales/items and estimated gross profit.
- Editable shop name/contact/address. Shop: Stockmate; currency: XAF (exponent zero, safe integer whole francs).

## Local data and calculations

AsyncStorage persists one versioned typed shop snapshot. Repository transactions are serialized and published only after the complete write succeeds. An invalid saved snapshot is not silently overwritten with demo data. This is on-device storage, not an encrypted backup or multi-device database. Deleting the app or clearing storage can remove it permanently.

Demo products, sales and movements are created once on first launch outside screen components. All records in this demo shop remain demo-labeled. No authentication, account actions, notifications, tax/discount configuration, printer integration, barcode scanning, exports, cloud sync, multiple stores, refunds or payment processing are claimed. Returns adjust physical stock only. Undo is not offered; a further explicit count correction can record a mistake transparently.

Money is stored as safe integer currency minor units; for XAF one minor unit is one franc. Line totals are unit price × quantity and subtotal equals total because no tax/discount rules are configured. Gross profit uses the last recorded unit cost captured on each sale line, not FIFO/batch valuation or net profit. Missing cost on any included line makes the period's profit **Incomplete**. Later cost edits never fill historical unknowns.

## Accessibility and design

Central theme tokens, Inter headings, Atkinson Hyperlegible body with system fallback, 18-point body and 15–16-point supporting text. Native font scaling is enabled; stock states use words and icons; primary controls are at least 48dp. Safe-area-aware tabs, keyboard-aware forms, scrollable confirmation dialogs, wrapping rows and a centered maximum-width tablet layout. Nonessential animation is disabled. Original empty-state illustrations are bundled locally; the brand mark is an original vector composition.

## Verification

`src/tests/workflows.ts` exercises add → receive → adjust → sell → receipt, invalid inputs, duplicate names, overselling, missing costs, immutable sale snapshots, all movement balances, integer formatting, search/empty results, transaction serialization, failed writes, reload and corrupt-data protection. It runs as part of the production export.

Implementation-session results: project-wide TypeScript checks passed. The automated workflow/repository tests passed during the isolated production check. That check reached the environment's ten-minute limit after spending about nine minutes installing clean dependencies, leaving insufficient time to verify lint completion or the Android/iOS/web production export. Expo Doctor was not executed. The native-compatible source is implemented, but a successful production export and Expo Go device launch are not claimed.

Manual device checks still required: Expo Go launch on iOS/Android, VoiceOver/TalkBack reading order, large accessibility font sizes, 360dp phones, rotation/tablets, keyboard reachability, hardware back navigation and system receipt sharing. No native device simulator or browser automation is assumed available in this workspace.
