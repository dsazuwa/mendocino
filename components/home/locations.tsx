import { ValueNoneIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { LocationType } from '@/types/location';
import Location from '../icons/location';
import { buttonVariants } from '../ui/button';

type Props = { locations: LocationType[] };

export default function Locations({ locations }: Props) {
  return locations.length === 0 ? (
    <div className='inline-flex w-full items-center justify-center gap-2 pt-4 font-semibold text-neutral-300'>
      <ValueNoneIcon className='h-10 w-10  flex-shrink-0 fill-neutral-200 sm:w-12' />

      <div>
        <p className='text-lg'>Oh no!</p>
        <p className='max-w-md text-sm'>
          It looks like there are no restaurants near the address you provided.
          Please try again with a different address.
        </p>
      </div>
    </div>
  ) : (
    <div className='flex flex-col flex-wrap gap-6 pt-4'>
      {locations.map(({ name, address, city, state, zipCode, distance }, i) => (
        <div
          key={`location-${i}`}
          className='inline-flex w-full items-center gap-3'
        >
          <div className='flex flex-col items-center gap-2'>
            <Location className='w-6 flex-shrink-0 fill-primary-500' />
            <div className='whitespace-nowrap text-[0.5rem] font-medium text-gray-600'>
              {distance.text}
            </div>
          </div>

          <div className='text-xxs'>
            <div className='text-xs font-semibold'>{name}</div>
            <div className='mt-1'>{address}</div>
            <div className='mt-0.5'>{[city, state, zipCode].join(', ')}</div>
          </div>

          <Link
            href={`/locations/${name}`}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'ml-auto text-xxs',
            )}
          >
            Order
          </Link>
        </div>
      ))}
    </div>
  );
}
