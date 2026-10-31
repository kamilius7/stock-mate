import React from 'react';
import { router } from 'expo-router';
import { Screen, StockMateButton, Info } from '../components/stockmate/ui';
export default function NotFound() { return <Screen title="Let’s get you back to the shop"><Info>This screen isn’t available. Your stock and sales are still saved.</Info><StockMateButton onPress={() => router.replace('/')}>Go home</StockMateButton></Screen>; }
