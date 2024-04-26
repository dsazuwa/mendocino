import { LocationType } from '@/types/location';
import Location from '../icons/location';
import { Button } from '../ui/button';

type Props = { locations: LocationType[] };

export default function Locations({ locations }: Props) {
  return locations.length === 0 ? (
    <div className='text-sm font-semibold text-neutral-400'>
      No resturants near you
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

          <Button variant='outline' className='ml-auto text-xxs'>
            Order
          </Button>
        </div>
      ))}
    </div>
  );
}
