import { useGetLocations } from '@/hooks/use-addresses';
import { Address } from '@/types/address';
import AddressModal from './address-modal';
import Locations from './locations';
import Loader from '../loader';

type Props = { addresses: Address[] };

export default function LocationSelector({ addresses }: Props) {
  const defaultAddress = addresses[0];
  const { locations, isLoading } = useGetLocations(defaultAddress.placeId);

  return (
    <>
      <div className='inline-flex w-full flex-wrap items-center justify-center gap-2'>
        <span className='text-lg font-medium'>Delivering to</span>

        <AddressModal addresses={addresses} />
      </div>

      {isLoading && <Loader className='py-8' />}

      {locations && <Locations locations={locations} />}
    </>
  );
}
