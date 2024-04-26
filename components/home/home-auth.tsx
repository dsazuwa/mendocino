import { getAddresses } from '@/lib/data';
import AddressInput from './address-input';
import LocationSelector from './location-selector';

export default async function AuthenticatedHomePage() {
  const { addresses } = await getAddresses();

  return addresses.length > 0 ? (
    <LocationSelector addresses={addresses} />
  ) : (
    <AddressInput />
  );
}
