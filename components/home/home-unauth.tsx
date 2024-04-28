import { getAddresses } from '@/lib/data';
import AddressInput from './address-input';
import LocationSelector from './location-selector';

export default async function UnauthenticatedHomePage() {
  const { addresses } = await getAddresses();

  return addresses.length === 0 ? (
    <AddressInput />
  ) : (
    <LocationSelector addresses={addresses} />
  );
}
