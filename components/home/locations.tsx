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
            <div className='whitespace-nowrap text-xxs'>{distance.text}</div>
          </div>

          <div>
            <div className='text-sm font-semibold'>{name}</div>
            <div className='mt-1 text-xs'>{address}</div>
            <div className='text-xxs'>{[city, state, zipCode].join(', ')}</div>
          </div>

          <Button variant='outline' className='ml-auto text-xxs'>
            Order
          </Button>
        </div>
      ))}
    </div>
  );
}
