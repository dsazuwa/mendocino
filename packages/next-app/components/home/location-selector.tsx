import { cookies } from 'next/headers';

import { getClosestLocations } from '@/lib/data';
import { Address } from '@/types/address';
import AddressModal from './address-modal';
import Locations from './locations';

type Props = { addresses: Address[] };

export default async function LocationSelector({ addresses }: Props) {
  const selectedId = getSelectedAddress(addresses);
  const address =
    addresses.find((address) => address.id === selectedId) || addresses[0];
  const locations = await getClosestLocations(address.placeId);

  return (
    <>
      <div className='inline-flex w-full flex-wrap items-center justify-center gap-2'>
        <span className='text-lg font-medium'>Delivering to</span>

        <AddressModal addresses={addresses} defaultAddress={address} />
      </div>

      <Locations locations={locations} />
    </>
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
