'use client';

import { useGetAddresses } from '@/hooks/use-addresses';
import AddressInput from './address-input';
import LocationSelector from './location-selector';

type Props = { guestSession?: string };

export default function HomePageContent({ guestSession }: Props) {
  const { addresses, isLoading } = useGetAddresses(guestSession);

  if (isLoading) return <></>;

  if (addresses.length === 0) return <AddressInput />;

  return <LocationSelector addresses={addresses} />;
}
