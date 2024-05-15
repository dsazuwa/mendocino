import { Suspense } from 'react';

import { getAddresses } from '@/lib/data';
import Location from '../icons/location';
import { Skeleton } from '../ui/skeleton';
import AddressInput from './address-input';
import LocationSelector from './location-selector';

export default async function HomePageContent() {
  const { addresses } = await getAddresses();

  if (addresses.length === 0) return <AddressInput />;

  return (
    <Suspense fallback={<Loading />}>
      <LocationSelector addresses={addresses} />
    </Suspense>
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
