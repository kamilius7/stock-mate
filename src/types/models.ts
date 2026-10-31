export type Product = {
  id: string; name: string; category: string; price: number; cost: number | null;
  quantity: number; threshold: number; sku: string;
};
export type ProductInput = Omit<Product, 'id'>;
export type MovementReason = 'Opening stock' | 'Delivery' | 'Sale' | 'Damaged / expired' | 'Customer return' | 'Count correction';
export type StockMovement = {
  id: string; productId: string; reason: MovementReason; timestamp: string;
  delta: number; resultingQuantity: number; note: string; saleId?: string;
};
export const paymentMethods = ['Cash', 'Mobile money', 'Card', 'Bank transfer'] as const;
export type PaymentMethod = typeof paymentMethods[number];
export type Shop = { name: string; contact: string; address: string; currency: 'XAF' };
export type SaleLine = { productId: string; name: string; quantity: number; unitPrice: number; unitCost: number | null; lineTotal: number };
export type Sale = { id: string; receiptNumber: string; timestamp: string; lines: SaleLine[]; subtotal: number; total: number; paymentMethod: PaymentMethod; shop: Shop; demo: boolean };
export type Database = { version: 1; demo: boolean; shop: Shop; products: Product[]; sales: Sale[]; movements: StockMovement[]; nextReceipt: number };
export type Cart = Record<string, number>;
export type InventoryFilter = 'all' | 'low' | 'out';
