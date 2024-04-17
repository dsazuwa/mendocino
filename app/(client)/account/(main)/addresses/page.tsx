import CreateAddressModal from '@/components/address/create';
import EditAddess from '@/components/address/edit';
import { getAddresses } from '@/lib/data';

export default async function Addresses() {
  const { addresses } = await getAddresses();

  return (
    <div className='flex h-full flex-col gap-4'>
      <div className='flex flex-row flex-wrap items-center gap-4 md:h-20'>
        <span className='flex-1 text-xl font-semibold'>Addresses</span>

        <CreateAddressModal />
      </div>

      <div className='flex flex-col gap-4'>
        {addresses.map((address, index) => (
          <EditAddess key={`addresses-${index}`} address={address} />
        ))}
      </div>
    </div>
  );
}
