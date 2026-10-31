import React, { useRef, useState } from 'react';
import { Text } from 'react-native-paper';
import { router } from 'expo-router';
import { useShop } from '../state/ShopProvider';
import type { MovementReason } from '../types/models';
import { changeStock } from '../services/inventory';
import { integer, largeChange, money } from '../services/calculations';
import { Card, Choices, ConfirmDialog, EmptyState, ErrorMessage, Field, Heading, Info, Screen, StockMateButton } from '../components/stockmate/ui';
import { ProductSelect } from '../components/stockmate/ProductSelect';
import { styles } from '../theme/stockmateTheme';

type StockReason = Exclude<MovementReason, 'Opening stock' | 'Sale'>;
type Review = { productId: string; name: string; current: number; delta: number; reason: StockReason; cost?: number; note: string };
export default function StockForm({ mode, initialProductId }: { mode: 'receive' | 'adjust'; initialProductId?: string }) {
  const { db, transact, notify } = useShop();
  const [productId, setProductId] = useState(initialProductId ?? '');
  const product = db.products.find(p => p.id === productId);
  const [quantity, setQuantity] = useState(''); const [cost, setCost] = useState(''); const [note, setNote] = useState('');
  const [reason, setReason] = useState<StockReason>(mode === 'receive' ? 'Delivery' : 'Damaged / expired');
  const [errors, setErrors] = useState<Record<string, string>>({}); const [error, setError] = useState('');
  const [review, setReview] = useState<Review | null>(null); const [busy, setBusy] = useState(false); const saving = useRef(false);
  const counted = reason === 'Count correction';
  const amount = integer(quantity);
  const delta = counted ? amount - (product?.quantity ?? 0) : reason === 'Damaged / expired' ? -amount : amount;
  const after = (product?.quantity ?? 0) + delta;
  function prepare() {
    const e: Record<string, string> = {};
    if (!product) e.product = 'Choose a product.';
    if (!Number.isFinite(amount) || amount < (counted ? 0 : 1)) e.quantity = counted ? 'Enter the counted total, zero or more whole units.' : 'Enter a positive number of whole units.';
    else if (!Number.isSafeInteger(after) || after < 0) e.quantity = 'You cannot remove more than the current stock.';
    else if (delta === 0) e.quantity = 'The count already matches. No stock change is needed.';
    if (mode === 'receive' && cost.trim() && !Number.isFinite(integer(cost))) e.cost = 'Enter a non-negative whole-franc cost or leave blank.';
    setErrors(e); setError(Object.keys(e).length ? 'Check the highlighted fields.' : '');
    if (!Object.keys(e).length && product) setReview({ productId, name: product.name, current: product.quantity, delta, reason, note, cost: mode === 'receive' && cost.trim() ? integer(cost) : undefined });
  }
  async function confirm() {
    if (!review || saving.current) return;
    saving.current = true; setBusy(true);
    try {
      await transact(current => ({ db: changeStock(current, review.productId, review.delta, review.reason, review.note, review.current, review.cost), result: undefined }));
      notify(mode === 'receive' ? 'Delivery saved. Stock and history updated.' : 'Stock adjustment saved with its reason.');
      router.dismissTo(`/inventory/${review.productId}`);
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to save on this device. Try again.'); setReview(null); }
    finally { saving.current = false; setBusy(false); }
  }
  return <Screen title={mode === 'receive' ? 'Receive stock' : 'Adjust stock'} subtitle={mode === 'receive' ? 'A delivery today. Ready shelves tomorrow.' : 'Make a clear, traceable stock change.'} back footer={db.products.length ? <><ErrorMessage message={error} /><StockMateButton icon="arrow-right" onPress={prepare}>Review stock change</StockMateButton><StockMateButton mode="text" onPress={() => router.canGoBack() ? router.back() : router.replace('/inventory')}>Cancel</StockMateButton></> : undefined}>
    {!db.products.length ? <EmptyState kind="inventory" title="Add a product first" message="A stock change needs a product to belong to." action="Add product" onPress={() => router.push('/inventory/new')} /> : <>
      <ProductSelect products={db.products} value={productId} onChange={id => { setProductId(id); setErrors({}); setError(''); }} /><ErrorMessage message={errors.product ?? ''} />
      {mode === 'adjust' && <><Heading>Why is stock changing?</Heading><Choices value={reason} onChange={v => { setReason(v); setErrors({}); setError(''); }} options={[{ value: 'Damaged / expired', label: 'Damaged / expired' }, { value: 'Customer return', label: 'Resellable return' }, { value: 'Count correction', label: 'Count correction' }]} /><Info>{reason === 'Damaged / expired' ? 'Removes units that cannot be sold. Enter how many units to remove.' : reason === 'Customer return' ? 'Adds returned units that can be sold again. This records stock only, not a refund.' : 'Sets stock to the number you physically counted. Enter the complete new total, not the difference.'}</Info></>}
      <Field label={counted ? 'Counted quantity (new total)' : mode === 'receive' ? 'Quantity delivered' : reason === 'Damaged / expired' ? 'Quantity to remove' : 'Quantity to add'} value={quantity} onChangeText={v => { setQuantity(v); setErrors(e => ({ ...e, quantity: '' })); setError(''); }} numeric placeholder={counted ? 'For example, 12' : 'For example, 6'} error={errors.quantity} />
      {product && <Card tone="sage"><Text variant="bodyLarge">Stock after {mode === 'receive' ? 'delivery' : 'adjustment'}</Text><Text variant="displaySmall" style={styles.money}>{product.quantity} → {Number.isFinite(after) && after >= 0 ? after : '—'}</Text><Text variant="bodyMedium">{product.quantity} units now{Number.isFinite(delta) ? ` · ${delta >= 0 ? '+' : ''}${delta} units change` : ''}</Text></Card>}
      {product && Number.isFinite(delta) && largeChange(Math.abs(delta), product.quantity) && <Info warning>This is an unusually large stock change. Double-check the units before confirming.</Info>}
      {mode === 'receive' && <Field label="Purchase cost per unit (XAF)" optional value={cost} onChangeText={v => { setCost(v); setErrors(e => ({ ...e, cost: '' })); }} numeric placeholder="For example, 1100" error={errors.cost} helper="Updates the last recorded unit cost for future sales. Leave blank to keep the existing cost." />}
      <Field label={mode === 'receive' ? 'Supplier / reference note' : 'Adjustment note'} optional value={note} onChangeText={setNote} placeholder={mode === 'receive' ? 'For example, delivery INV-104 from local wholesaler' : 'For example, two items damaged in storage'} multiline />
      <ConfirmDialog visible={!!review} title={mode === 'receive' ? 'Confirm delivery' : 'Confirm adjustment'} busy={busy} onCancel={() => setReview(null)} onConfirm={() => void confirm()} confirmLabel="Confirm and save"><Text variant="titleLarge">{review?.name}</Text><Text variant="bodyLarge">{review?.reason}</Text><Text variant="headlineMedium" style={styles.money}>{review?.current} → {review ? review.current + review.delta : 0} units</Text><Text>{review && review.delta > 0 ? '+' : ''}{review?.delta} units change</Text>{review?.cost !== undefined && <Text>New unit purchase cost: {money(review.cost)}</Text>}{!!review?.note && <Text>{review.note}</Text>}{review && largeChange(Math.abs(review.delta), review.current) && <Info warning>Large entry: check this quantity carefully. Confirming writes this change to stock history.</Info>}<Text variant="bodyMedium">Saved only on this device. Cancel to go back without changing stock.</Text></ConfirmDialog>
    </>}
  </Screen>;
}
