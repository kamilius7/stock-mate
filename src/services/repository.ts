import type { Database } from '../types/models';
import { createDemo } from './demo';

export interface LocalStorageAdapter { getItem(key: string): Promise<string | null>; setItem(key: string, value: string): Promise<void> }
const key = 'stockmate.database.v1';
function validateSnapshot(value: unknown): asserts value is Database {
  if (!value || typeof value !== 'object') throw new Error('Saved shop data is unreadable. It has not been overwritten.');
  const db = value as Database;
  const whole = (n: unknown) => typeof n === 'number' && Number.isSafeInteger(n) && n >= 0;
  if (db.version !== 1 || typeof db.demo !== 'boolean' || !db.shop || typeof db.shop.name !== 'string' || !db.shop.name.trim() || db.shop.currency !== 'XAF' || typeof db.shop.contact !== 'string' || typeof db.shop.address !== 'string' || !Array.isArray(db.products) || !Array.isArray(db.sales) || !Array.isArray(db.movements) || !whole(db.nextReceipt)) throw new Error('Saved shop data is invalid. It has not been overwritten.');
  const ids = new Set<string>(); const names = new Set<string>();
  for (const p of db.products) {
    if (!p || typeof p.id !== 'string' || ids.has(p.id) || typeof p.name !== 'string' || !p.name.trim() || names.has(p.name.trim().toLowerCase()) || typeof p.category !== 'string' || !p.category.trim() || typeof p.sku !== 'string' || !whole(p.price) || p.price === 0 || !whole(p.quantity) || !whole(p.threshold) || (p.cost !== null && !whole(p.cost))) throw new Error('Saved product data is invalid. It has not been overwritten.');
    ids.add(p.id); names.add(p.name.trim().toLowerCase());
  }
  const receipts = new Set<string>();
  for (const sale of db.sales) {
    if (!sale || typeof sale.id !== 'string' || typeof sale.receiptNumber !== 'string' || receipts.has(sale.receiptNumber) || !Number.isFinite(Date.parse(sale.timestamp)) || !Array.isArray(sale.lines) || !sale.lines.length || !whole(sale.total) || sale.total !== sale.subtotal || !sale.shop || sale.shop.currency !== 'XAF' || typeof sale.shop.name !== 'string' || typeof sale.paymentMethod !== 'string' || typeof sale.demo !== 'boolean') throw new Error('Saved receipt data is invalid. It has not been overwritten.');
    let total = 0;
    for (const l of sale.lines) {
      if (!l || !ids.has(l.productId) || typeof l.name !== 'string' || !whole(l.quantity) || l.quantity === 0 || !whole(l.unitPrice) || (l.unitCost !== null && !whole(l.unitCost)) || !whole(l.lineTotal) || l.lineTotal !== l.unitPrice * l.quantity) throw new Error('Saved sale line is invalid. It has not been overwritten.');
      total += l.lineTotal;
    }
    if (sale.total !== total) throw new Error('Saved sale total is invalid. It has not been overwritten.');
    receipts.add(sale.receiptNumber);
  }
  for (const m of db.movements) {
    if (!m || !ids.has(m.productId) || typeof m.id !== 'string' || !Number.isFinite(Date.parse(m.timestamp)) || !Number.isSafeInteger(m.delta) || !whole(m.resultingQuantity) || typeof m.reason !== 'string' || typeof m.note !== 'string') throw new Error('Saved stock history is invalid. It has not been overwritten.');
  }
}
export function createRepository(storage: LocalStorageAdapter) {
  let snapshot: Database | null = null;
  let queue: Promise<unknown> = Promise.resolve();
  return {
    async load(): Promise<Database> {
      const raw = await storage.getItem(key);
      if (raw === null) {
        const demo = createDemo();
        await storage.setItem(key, JSON.stringify(demo));
        snapshot = demo;
      } else {
        const parsed: unknown = JSON.parse(raw); validateSnapshot(parsed); snapshot = parsed;
      }
      return snapshot;
    },
    transact<T>(change: (db: Database) => { db: Database; result: T }): Promise<{ db: Database; result: T }> {
      const operation = queue.then(async () => {
        if (!snapshot) throw new Error('Shop data is not loaded.');
        const next = change(snapshot);
        validateSnapshot(next.db);
        // Commit one complete snapshot before publishing any UI changes.
        await storage.setItem(key, JSON.stringify(next.db));
        snapshot = next.db;
        return next;
      });
      queue = operation.catch(() => undefined);
      return operation;
    },
  };
}
