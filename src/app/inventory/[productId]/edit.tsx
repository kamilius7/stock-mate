import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ProductForm from '../../../screens/ProductForm';
export default function EditProduct() { const { productId } = useLocalSearchParams<{ productId: string }>(); return <ProductForm productId={productId} />; }
