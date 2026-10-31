import type { Cart, Product, Sale, SaleLine } from '../types/models';

export const money = (amount: number) => `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount)} XAF`;
export const integer = (value: string) => /^\d+$/.test(value.trim()) && Number.isSafeInteger(Number(value)) ? Number(value) : NaN;
export function safeAmount(value: number, label: string, positive = false) {
  if (!Number.isSafeInteger(value) || value < (positive ? 1 : 0)) throw new Error(`${label} must be ${positive ? 'a positive' : 'a non-negative'} whole number.`);
  return value;
}
export const stockStatus = (p: Product) => p.quantity === 0 ? 'Out of stock' : p.quantity <= p.threshold ? 'Low stock' : 'In stock';
export const needsRestocking = (p: Product) => p.quantity <= p.threshold;
export function cartLines(products: Product[], cart: Cart): SaleLine[] {
  return Object.entries(cart).filter(([, q]) => q > 0).map(([id, quantity]) => {
    const p = products.find(p => p.id === id);
    if (!p) throw new Error('A product is no longer available. Remove it from the cart.');
    safeAmount(quantity, 'Sale quantity', true);
    if (quantity > p.quantity) throw new Error(`${p.name}: only ${p.quantity} units available. Please update the cart.`);
    const lineTotal = safeAmount(p.price * quantity, 'Line total');
    return { productId: id, name: p.name, quantity, unitPrice: p.price, unitCost: p.cost, lineTotal };
  });
}
export function subtotal(lines: SaleLine[]) {
  return safeAmount(lines.reduce((sum, line) => sum + line.lineTotal, 0), 'Sale total');
}
export function summary(sales: Sale[]) {
  const lines = sales.flatMap(s => s.lines);
  const revenue = sales.reduce((sum, s) => sum + s.total, 0);
  const incomplete = lines.some(l => l.unitCost === null);
  return { revenue, count: sales.length, items: lines.reduce((n, l) => n + l.quantity, 0), incomplete,
    profit: incomplete ? null : revenue - lines.reduce((sum, l) => sum + (l.unitCost ?? 0) * l.quantity, 0) };
}
export function filterSales(sales: Sale[], period: string, now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(today);
  if (period === 'week') start.setDate(start.getDate() - 6);
  return sales.filter(s => period === 'all' || (new Date(s.timestamp) >= start && new Date(s.timestamp) <= now));
}
export const dateTime = (date: string) => new Date(date).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
export const timeOnly = (date: string) => new Date(date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
export const largeChange = (quantity: number, current: number) => quantity >= 100 || quantity > Math.max(20, current * 2);
