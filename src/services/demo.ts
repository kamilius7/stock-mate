import type { Database, Product } from '../types/models';
import { recordSale } from './sales';
import { cartLines } from './calculations';
import { changeStock } from './inventory';

export function createDemo(): Database {
  const now = new Date();
  const timestamp = (days: number, hours: number, minutes = 0) => {
    const d = new Date(now); d.setDate(d.getDate() - days); d.setHours(hours, minutes, 0, 0);
    return d > now ? now.toISOString() : d.toISOString();
  };
  const products: Product[] = [
    { id: 'rice', name: 'Jasmine rice · 1 kg', category: 'Pantry', price: 1500, cost: 1100, quantity: 35, threshold: 8, sku: 'PAN-001' },
    { id: 'oil', name: 'Cooking oil · 1 L', category: 'Pantry', price: 2200, cost: 1650, quantity: 7, threshold: 6, sku: 'PAN-002' },
    { id: 'milk', name: 'Whole milk · 1 L', category: 'Dairy', price: 1200, cost: 850, quantity: 9, threshold: 8, sku: 'DAI-001' },
    { id: 'sugar', name: 'White sugar · 1 kg', category: 'Pantry', price: 1000, cost: 720, quantity: 20, threshold: 5, sku: 'PAN-003' },
    { id: 'soap', name: 'Natural bar soap', category: 'Household', price: 500, cost: 300, quantity: 6, threshold: 5, sku: 'HOM-001' },
    { id: 'water', name: 'Drinking water · 1.5 L', category: 'Drinks', price: 500, cost: 325, quantity: 48, threshold: 12, sku: 'DRK-001' },
    { id: 'bread', name: 'Fresh sliced bread', category: 'Bakery', price: 800, cost: 550, quantity: 2, threshold: 4, sku: 'BAK-001' },
    { id: 'eggs', name: 'Eggs · pack of 6', category: 'Dairy', price: 1500, cost: 1000, quantity: 0, threshold: 5, sku: 'DAI-002' },
    { id: 'coffee', name: 'Ground coffee · 250 g', category: 'Pantry', price: 2500, cost: null, quantity: 14, threshold: 4, sku: 'PAN-004' },
    { id: 'tea', name: 'Breakfast tea · 25 bags', category: 'Drinks', price: 1800, cost: 1250, quantity: 18, threshold: 4, sku: 'DRK-002' },
  ];
  let db: Database = { version: 1, demo: true, shop: { name: 'Stockmate', currency: 'XAF', contact: '', address: '' }, products,
    sales: [], nextReceipt: 1001, movements: products.map(p => ({ id: `opening-${p.id}`, productId: p.id, reason: 'Opening stock', timestamp: timestamp(12, 8), delta: p.quantity, resultingQuantity: p.quantity, note: 'Demo opening stock' })) };
  const delivery = changeStock(db, 'rice', 10, 'Delivery', 'Demo delivery · local wholesaler', 35);
  delivery.movements[delivery.movements.length - 1].timestamp = timestamp(10, 9, 15);
  db = delivery;
  db = changeStock(db, 'bread', -1, 'Damaged / expired', 'Demo expired loaf', 2);
  db.movements[db.movements.length - 1].timestamp = timestamp(9, 17);
  const examples = [
    { cart: { coffee: 1, sugar: 1 }, days: 8, h: 11, m: 5, payment: 'Cash' as const },
    { cart: { rice: 3, water: 4 }, days: 2, h: 14, m: 20, payment: 'Mobile money' as const },
    { cart: { rice: 2, oil: 1, sugar: 2 }, days: 1, h: 10, m: 10, payment: 'Cash' as const },
    { cart: { milk: 2, rice: 2, water: 3 }, days: 0, h: 8, m: 40, payment: 'Cash' as const },
    { cart: { oil: 1, soap: 2, tea: 1 }, days: 0, h: 9, m: 25, payment: 'Mobile money' as const },
    { cart: { rice: 3, sugar: 2, water: 2 }, days: 0, h: 10, m: 15, payment: 'Cash' as const },
    { cart: { milk: 1, tea: 1 }, days: 0, h: 11, m: 45, payment: 'Card' as const },
  ];
  for (const example of examples) {
    const cart = Object.fromEntries(Object.entries(example.cart).filter(([, q]) => q !== undefined)) as Record<string, number>;
    const result = recordSale(db, cart, example.payment, cartLines(db.products, cart));
    result.sale.timestamp = timestamp(example.days, example.h, example.m);
    result.db.movements.filter(m => m.saleId === result.sale.id).forEach(m => { m.timestamp = result.sale.timestamp; });
    db = result.db;
  }
  return db;
}
