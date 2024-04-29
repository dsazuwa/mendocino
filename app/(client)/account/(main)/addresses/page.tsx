'use client';

import CreateAddress from '@/components/address/create';
import EditAddess from '@/components/address/edit';
import Loader from '@/components/loader';
import { useGetAddresses } from '@/hooks/use-addresses';

export default function Addresses() {
  const { addresses, isLoading } = useGetAddresses(undefined);

  return (
    <div className='flex h-full flex-col gap-4'>
      <div className='inline-flex flex-wrap items-center gap-4 md:h-20'>
        <span className='flex-1 text-xl font-semibold'>Addresses</span>

        <CreateAddress />
      </div>

      {isLoading && <Loader size='md' className='mt-4' />}

      {addresses.length > 0 && (
        <div className='flex flex-col gap-4'>
          {addresses.map((address, index) => (
            <EditAddess key={`addresses-${index}`} address={address} />
          ))}
        </div>
      )}
    </div>
  );
}
