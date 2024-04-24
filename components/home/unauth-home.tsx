import { getGuestAddresses } from '@/lib/data';
import AddressInput from './address-input';
import AddressSelector from './address-selector';

export default async function UnauthenticatedHomePage() {
  const { sessionId, addresses } = await getGuestAddresses();

  return addresses.length === 0 ? (
    <AddressInput sessionId={sessionId} />
  ) : (
    <AddressSelector addresses={addresses} />
  );
}
