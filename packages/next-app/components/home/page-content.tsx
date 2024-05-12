import { getAddresses } from '@/lib/data';
import AddressInput from './address-input';
import LocationSelector from './location-selector';

export default async function HomePageContent() {
  const { addresses } = await getAddresses();

  if (addresses.length === 0) return <AddressInput />;

  return <LocationSelector addresses={addresses} />;
}
