import React, { useRef, useState } from 'react';
import { Text } from 'react-native-paper';
import { router } from 'expo-router';
import { useShop } from '../state/ShopProvider';
import { Card, ConfirmDialog, ErrorMessage, Field, Heading, Info, Screen, StockMateButton } from '../components/stockmate/ui';
import { integer, largeChange, money } from '../services/calculations';
import { saveProduct } from '../services/inventory';
import type { ProductInput } from '../types/models';
import { styles } from '../theme/stockmateTheme';
export default function ProductForm({ productId }: { productId?: string }) {
  const { db, transact, notify } = useShop();
  const existing = db.products.find(p => p.id === productId);
  const initialQuantity = useRef(existing?.quantity);
  const [values, setValues] = useState({ name: existing?.name ?? '', category: existing?.category ?? '', price: existing ? String(existing.price) : '', quantity: String(existing?.quantity ?? 0), threshold: String(existing?.threshold ?? 5), cost: existing?.cost != null ? String(existing.cost) : '', sku: existing?.sku ?? '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const saving = useRef(false);
  const [review, setReview] = useState<ProductInput | null>(null);
  const set = (field: keyof typeof values) => (value: string) => { setValues(v => ({ ...v, [field]: value })); setErrors(e => ({ ...e, [field]: '' })); setError(''); };
  function validate(): ProductInput | null {
    const e: Record<string, string> = {};
    if (!values.name.trim()) e.name = 'Enter a product name.';
    else if (db.products.some(p => p.id !== productId && p.name.trim().toLowerCase() === values.name.trim().toLowerCase())) e.name = 'This name already exists. Choose a different name.';
    if (!values.category.trim()) e.category = 'Enter a category, for example Pantry.';
    if (!(integer(values.price) > 0)) e.price = 'Enter a positive whole-franc price, for example 1500.';
    if (!(integer(values.quantity) >= 0)) e.quantity = 'Enter zero or a positive whole-unit quantity.';
    if (!(integer(values.threshold) >= 0)) e.threshold = 'Enter zero or a positive whole-unit threshold.';
    if (values.cost.trim() && !(integer(values.cost) >= 0)) e.cost = 'Enter a non-negative whole-franc cost, or leave blank.';
    setErrors(e);
    if (Object.keys(e).length) { setError('Check the highlighted fields before saving.'); return null; }
    return { name: values.name, category: values.category, price: integer(values.price), quantity: integer(values.quantity), threshold: integer(values.threshold), cost: values.cost.trim() ? integer(values.cost) : null, sku: values.sku };
  }
  async function save(input: ProductInput) {
    if (saving.current) return;
    saving.current = true; setBusy(true); setError('');
    try {
      const id = await transact(current => {
        if (productId && current.products.find(p => p.id === productId)?.quantity !== initialQuantity.current) throw new Error('Stock has changed since this form opened. Cancel and reopen the product before editing.');
        const result = saveProduct(current, input, productId);
        return { db: result.db, result: result.id };
      });
      notify(productId ? 'Product changes saved on this device.' : 'Product added. Opening stock recorded.');
      router.dismissTo(`/inventory/${id}`);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to save on this device. Please try again.'); setReview(null); }
    finally { saving.current = false; setBusy(false); }
  }
  function submit() { const input = validate(); if (!input) return; if (largeChange(Math.abs(input.quantity - (existing?.quantity ?? 0)), existing?.quantity ?? 0)) setReview(input); else void save(input); }
  if (productId && !existing) return <Screen title="Product not found" back><ErrorMessage message="This product is not available." /></Screen>;
  return <Screen title={productId ? 'Edit product' : 'Add product'} subtitle={productId ? 'Keep your product details up to date.' : 'A new addition to your shelves.'} back footer={<><ErrorMessage message={error} /><StockMateButton icon="check" onPress={submit} loading={busy}>Save product</StockMateButton><StockMateButton mode="text" disabled={busy} onPress={() => router.canGoBack() ? router.back() : router.replace('/inventory')}>Cancel</StockMateButton></>}>
    <Heading>Basic details</Heading><Field label="Product name" value={values.name} onChangeText={set('name')} placeholder="For example, Jasmine rice · 1 kg" error={errors.name} /><Field label="Category" value={values.category} onChangeText={set('category')} placeholder="For example, Pantry" error={errors.category} /><Field label="Selling price (XAF)" value={values.price} onChangeText={set('price')} placeholder="1500" numeric error={errors.price} helper="Whole francs only. XAF has no decimal places." />
    <Heading>Stock</Heading><Field label={productId ? 'Counted quantity' : 'Opening quantity'} value={values.quantity} onChangeText={set('quantity')} numeric error={errors.quantity} helper={productId ? 'Sets the total stock count. A change is recorded as a count correction.' : 'Number of whole units currently on your shelves.'} /><Field label="Low-stock alert threshold" value={values.threshold} onChangeText={set('threshold')} numeric error={errors.threshold} helper="Shows Low stock when quantity reaches this number or below." />
    {productId && <Card tone="sage"><Text variant="bodyLarge">Stock preview</Text><Text variant="titleLarge" style={styles.money}>{existing?.quantity} → {Number.isFinite(integer(values.quantity)) ? integer(values.quantity) : '—'} units</Text></Card>}
    <Heading>Optional details</Heading><Field label="Purchase cost per unit (XAF)" optional value={values.cost} onChangeText={set('cost')} placeholder="1100" numeric error={errors.cost} helper="Leave blank if unknown. Future gross profit will be marked incomplete." /><Field label="SKU / barcode" optional value={values.sku} onChangeText={set('sku')} placeholder="For example, PAN-001" />
    <Info>Product names must be unique. Purchase costs are estimates for future sales; past receipts keep their original costs.</Info>
    <ConfirmDialog visible={!!review} title="Check this large stock entry" busy={busy} onCancel={() => setReview(null)} onConfirm={() => review && void save(review)} confirmLabel="Save product"><Text variant="bodyLarge">{review?.name}</Text><Text>{existing?.quantity ?? 0} → {review?.quantity} units</Text><Text>This is an unusually large change. Check the number of whole units before saving.</Text><Text>Selling price: {money(review?.price ?? 0)}</Text></ConfirmDialog>
  </Screen>;
}
