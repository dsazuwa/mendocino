import { getClosestLocations } from '@/lib/data';
import { Address } from '@/types/address';
import AddressModal from './address-modal';
import Locations from './locations';

type Props = { addresses: Address[] };

export default async function LocationSelector({ addresses }: Props) {
  const defaultAddress = addresses[0];
  const locations = await getClosestLocations(defaultAddress.placeId);

  return (
    <>
      <div className='inline-flex w-full flex-wrap items-center justify-center gap-2'>
        <span className='text-lg font-medium'>Delivering to</span>

        <AddressModal addresses={addresses} />
      </div>

      <Locations locations={locations} />
    </>
  );
}
