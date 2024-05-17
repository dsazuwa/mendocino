import { cookies } from 'next/headers';

import AddressInput from '@/components/home/address-input';
import LocationSelector from '@/components/home/location-selector';
import Footer from '@/components/layout/footer';
import { getAddresses } from '@/lib/data';
import { Address } from '@/types/address';

export default async function Home() {
  const { addresses } = await getAddresses();

  return (
    <>
      <main className='mx-auto w-full max-w-screen-lg flex-1 space-y-3 px-4 py-8 sm:px-8'>
        {addresses.length === 0 ? (
          <AddressInput />
        ) : (
          <LocationSelectorWrapper addresses={addresses} />
        )}
      </main>

      <Footer />
    </>
  );
}

function LocationSelectorWrapper({ addresses }: { addresses: Address[] }) {
  const selectedId = getSelectedAddress(addresses);
  const selectedAddress =
    addresses.find((address) => address.id === selectedId) || addresses[0];

  return (
    <LocationSelector addresses={addresses} selectedAddress={selectedAddress} />
  );
}

export function getSelectedAddress(addresses: Address[]) {
  if (addresses.length === 0) return undefined;

  const defaultId = addresses[0].id;
  const cookieVal = cookies().get('selected-address')?.value;

  const parsedVal =
    cookieVal === undefined || isNaN(parseInt(cookieVal))
      ? undefined
      : parseInt(cookieVal);

  if (parsedVal === undefined) return defaultId;

  const isValidId = addresses.some((address) => address.id === parsedVal);
  return isValidId ? parsedVal : defaultId;
}
