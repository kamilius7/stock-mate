import React, { useRef, useState } from 'react';
import { router } from 'expo-router';
import { Text } from 'react-native-paper';
import { useShop } from '../../state/ShopProvider';
import { ErrorMessage, Field, Heading, Info, Screen, StockMateButton } from '../../components/stockmate/ui';
export default function ShopSettings() {
  const { db, transact, notify } = useShop();
  const [name, setName] = useState(db.shop.name); const [contact, setContact] = useState(db.shop.contact); const [address, setAddress] = useState(db.shop.address);
  const [error, setError] = useState(''); const [nameError, setNameError] = useState(''); const [busy, setBusy] = useState(false); const saving = useRef(false);
  async function save() {
    if (!name.trim()) { setNameError('Enter a shop name.'); return; }
    if (saving.current) return;
    saving.current = true; setBusy(true); setError('');
    try { await transact(current => ({ db: { ...current, shop: { ...current.shop, name: name.trim(), contact: contact.trim(), address: address.trim() } }, result: undefined })); notify('Shop details saved for future receipts.'); router.dismissTo('/more'); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to save shop details.'); }
    finally { saving.current = false; setBusy(false); }
  }
  return <Screen title="Shop details" subtitle="Make every receipt feel like your shop." back footer={<><ErrorMessage message={error} /><StockMateButton onPress={() => void save()} loading={busy}>Save shop details</StockMateButton><StockMateButton mode="text" disabled={busy} onPress={() => router.canGoBack() ? router.back() : router.replace('/more')}>Cancel</StockMateButton></>}><Heading>Your shop</Heading><Field label="Shop name" value={name} onChangeText={v => { setName(v); setNameError(''); }} error={nameError} placeholder="Stockmate" /><Field label="Contact details" optional value={contact} onChangeText={setContact} placeholder="Phone or email" /><Field label="Shop address" optional value={address} onChangeText={setAddress} placeholder="Street and town" multiline /><Text variant="bodyLarge">Currency: XAF · whole francs</Text><Info>These details appear on future receipts. Existing receipts keep the shop details recorded at the time of sale.</Info></Screen>;
}
