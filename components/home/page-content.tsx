'use client';

import { useGetAddresses } from '@/hooks/use-addresses';
import AddressInput from './address-input';
import LocationSelector from './location-selector';

export default function HomePageContent() {
  const { addresses, isLoading } = useGetAddresses();

  if (isLoading) return <></>;

  if (addresses.length === 0) return <AddressInput />;

  return <LocationSelector addresses={addresses} />;
}
