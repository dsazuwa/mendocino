import { getAddresses } from '@/lib/data';
import AddressInput from './address-input';
import AddressSelector from './address-selector';

export default async function AuthenticatedHomePage() {
  const { addresses } = await getAddresses();

  return addresses.length > 0 ? (
    <AddressSelector addresses={addresses} />
  ) : (
    <AddressInput />
  );
}
