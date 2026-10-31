import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import StockForm from '../../screens/StockForm';
export default function ReceiveStock() { const { productId } = useLocalSearchParams<{ productId?: string }>(); return <StockForm mode="receive" initialProductId={productId} />; }
