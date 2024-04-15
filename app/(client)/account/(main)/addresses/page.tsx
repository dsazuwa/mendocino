import EditAddess from '@/components/location/address-dialog-edit';
import LocationInput from '@/components/location/location-input';
import { getAddresses } from '@/lib/data';

export default async function Addresses() {
  const { addresses } = await getAddresses();

  return (
    <div className='flex h-full flex-col gap-4'>
      <div className='flex flex-col flex-wrap gap-4 md:h-20 md:flex-row md:items-center'>
        <span className='flex-1 text-xl font-semibold'>Addresses</span>

        <LocationInput type='search' className='md:w-2/3' />
      </div>

      <div className='flex flex-col gap-4'>
        {addresses.map((address, index) => (
          <EditAddess key={`addresses-${index}`} address={address} />
        ))}
      </div>
    </div>
  );
}
