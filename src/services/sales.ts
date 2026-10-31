import type { Cart, Database, PaymentMethod, Sale, SaleLine, StockMovement } from '../types/models';
import { paymentMethods } from '../types/models';
import { cartLines, subtotal } from './calculations';
import { newId } from './inventory';

export function recordSale(db: Database, cart: Cart, paymentMethod: PaymentMethod, reviewed: SaleLine[]): { db: Database; sale: Sale } {
  if (!paymentMethods.includes(paymentMethod)) throw new Error('Choose a recorded payment method.');
  const lines = cartLines(db.products, cart);
  if (!lines.length) throw new Error('Add at least one product.');
  if (JSON.stringify(lines) !== JSON.stringify(reviewed)) throw new Error('Product prices, costs or cart quantities changed. Please review the sale again.');
  const total = subtotal(lines);
  const sale: Sale = { id: newId(), receiptNumber: `SM-${String(db.nextReceipt).padStart(5, '0')}`, timestamp: new Date().toISOString(), lines, subtotal: total, total, paymentMethod, shop: { ...db.shop }, demo: db.demo };
  const products = db.products.map(p => { const l = lines.find(l => l.productId === p.id); return l ? { ...p, quantity: p.quantity - l.quantity } : p; });
  const movements: StockMovement[] = lines.map(l => ({ id: newId(), productId: l.productId, reason: 'Sale', timestamp: sale.timestamp, delta: -l.quantity, resultingQuantity: products.find(p => p.id === l.productId)!.quantity, note: sale.receiptNumber, saleId: sale.id }));
  return { sale, db: { ...db, products, sales: [sale, ...db.sales], movements: [...db.movements, ...movements], nextReceipt: db.nextReceipt + 1 } };
}
