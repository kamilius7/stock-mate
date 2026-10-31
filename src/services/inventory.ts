import type { Database, MovementReason, ProductInput, StockMovement } from '../types/models';
import { safeAmount } from './calculations';

export const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
export function validateProduct(db: Database, input: ProductInput, productId?: string) {
  if (!input.name.trim()) throw new Error('Enter a product name.');
  if (!input.category.trim()) throw new Error('Enter a category.');
  if (db.products.some(p => p.id !== productId && p.name.trim().toLocaleLowerCase() === input.name.trim().toLocaleLowerCase())) throw new Error('A product with this name already exists. Choose a different name.');
  safeAmount(input.price, 'Selling price', true);
  safeAmount(input.quantity, 'Stock quantity');
  safeAmount(input.threshold, 'Low-stock threshold');
  if (input.cost !== null) safeAmount(input.cost, 'Purchase cost');
}
export function saveProduct(db: Database, input: ProductInput, productId?: string): { db: Database; id: string } {
  validateProduct(db, input, productId);
  const previous = productId ? db.products.find(p => p.id === productId) : undefined;
  if (productId && !previous) throw new Error('Product not found.');
  const id = productId ?? newId();
  const product = { ...input, name: input.name.trim(), category: input.category.trim(), sku: input.sku.trim(), id };
  const delta = product.quantity - (previous?.quantity ?? 0);
  const movement: StockMovement = { id: newId(), productId: id, reason: previous ? 'Count correction' : 'Opening stock', timestamp: new Date().toISOString(), delta, resultingQuantity: product.quantity, note: previous ? 'Quantity updated in product editor' : 'Initial product quantity' };
  return { id, db: { ...db, products: previous ? db.products.map(p => p.id === id ? product : p) : [...db.products, product],
    movements: !previous || delta !== 0 ? [...db.movements, movement] : db.movements } };
}
export function changeStock(db: Database, productId: string, delta: number, reason: Exclude<MovementReason, 'Opening stock' | 'Sale'>, note: string, expectedQuantity: number, cost?: number | null): Database {
  const product = db.products.find(p => p.id === productId);
  if (!product) throw new Error('Product not found.');
  if (product.quantity !== expectedQuantity) throw new Error('Stock changed while you were reviewing. Review the new quantity and try again.');
  if (!Number.isSafeInteger(delta) || delta === 0) throw new Error('Enter a whole-unit stock change greater than zero.');
  if ((reason === 'Delivery' || reason === 'Customer return') && delta < 0) throw new Error('This reason adds stock.');
  if (reason === 'Damaged / expired' && delta > 0) throw new Error('Damaged stock must be removed.');
  const quantity = safeAmount(product.quantity + delta, 'Resulting quantity');
  if (cost !== undefined && cost !== null) safeAmount(cost, 'Purchase cost');
  const movement: StockMovement = { id: newId(), productId, reason, timestamp: new Date().toISOString(), delta, resultingQuantity: quantity, note: note.trim() };
  return { ...db, products: db.products.map(p => p.id === productId ? { ...p, quantity, cost: cost === undefined || cost === null ? p.cost : cost } : p), movements: [...db.movements, movement] };
}
