import { Suspense } from 'react';

import AddressInput from '@/components/home/address-input';
import LocationSelector from '@/components/home/location-selector';
import Location from '@/components/icons/location';
import Footer from '@/components/layout/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { getAddresses } from '@/lib/data';

export default async function Home() {
  const { addresses } = await getAddresses();

  return (
    <>
      <main className='mx-auto w-full max-w-screen-lg flex-1 space-y-3 px-4 py-8 sm:px-8'>
        {addresses.length === 0 ? (
          <AddressInput />
        ) : (
          <Suspense fallback={<Loading />}>
            <LocationSelector addresses={addresses} />
          </Suspense>
        )}
      </main>

      <Footer />
    </>
  );
}

function Loading() {
  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <Skeleton className='h-8 w-10/12 rounded-lg sm:w-7/12' />

      <div className='w-full space-y-6'>
        <LocationSkeleton />
        <LocationSkeleton />
      </div>
    </div>
  );
}

function LocationSkeleton() {
  return (
    <div className='inline-flex w-full items-center gap-3'>
      <div className='flex flex-col items-center gap-2'>
        <Location className='w-6 flex-shrink-0 fill-primary-500' />
        <Skeleton className='h-2 w-8' />
      </div>

      <div className='flex-1 space-y-2'>
        <Skeleton className='h-4 w-11/12' />
        <Skeleton className='h-2 w-4/12' />
        <Skeleton className='h-2 w-6/12' />
      </div>

      <Skeleton className='h-10 w-16 rounded-lg' />
    </div>
  );
}
