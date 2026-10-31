import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native-paper';
import { View } from 'react-native';
import type { Cart, Database, InventoryFilter, PaymentMethod } from '../types/models';
import { repository } from '../services/storage';
import { colors } from '../theme/stockmateTheme';

type ShopContext = { db: Database; cart: Cart; setCart: React.Dispatch<React.SetStateAction<Cart>>; payment: PaymentMethod; setPayment: (p: PaymentMethod) => void; search: string; setSearch: (s: string) => void; filter: InventoryFilter; setFilter: (f: InventoryFilter) => void; notice: string; notify: (message: string) => void; transact: <T>(change: (db: Database) => { db: Database; result: T }) => Promise<T> };
const Context = createContext<ShopContext | null>(null);
export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<Database | null>(null);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<Cart>({});
  const [payment, setPayment] = useState<PaymentMethod>('Cash');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<InventoryFilter>('all');
  const [notice, notify] = useState('');
  const load = useCallback(() => { setError(''); repository.load().then(setDb).catch(e => setError(e instanceof Error ? e.message : 'Unable to open local shop data.')); }, []);
  useEffect(load, [load]);
  async function transact<T>(change: (db: Database) => { db: Database; result: T }) {
    const committed = await repository.transact(change);
    setDb(committed.db);
    return committed.result;
  }
  if (!db) return <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 24, gap: 20 }}>
    {error ? <><Text variant="titleLarge">We couldn’t open your shop</Text><Text accessibilityRole="alert">{error}</Text><Text onPress={load} accessibilityRole="button" style={{ padding: 16, color: colors.primary }}>Try again</Text><Text>Your saved data has not been reset.</Text></> : <><ActivityIndicator color={colors.primary} /><Text style={{ textAlign: 'center' }}>Opening StockMate…</Text></>}
  </View>;
  return <Context.Provider value={{ db, cart, setCart, payment, setPayment, search, setSearch, filter, setFilter, notice, notify, transact }}>{children}</Context.Provider>;
}
export function useShop() { const value = useContext(Context); if (!value) throw new Error('StockMate provider is missing.'); return value; }
