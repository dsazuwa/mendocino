import { Cross2Icon } from '@radix-ui/react-icons';

import { DialogClose, DialogContent } from '@/components/ui/dialog';
import { Address } from '@/types/customer';
import { cn } from '@/lib/utils';
import Location from '../icons/location';
import { Button } from '../ui/button';
import LocationInput from './location-input';

type Props = { addresses: Address[] };

export default function ChooseAddressContent({ addresses }: Props) {
  const selected = 0;
  const hasAddress = addresses.length > 0;

  return (
    <DialogContent className='left-[50%] top-0 flex h-screen w-full max-w-none translate-x-[-50%] translate-y-0 flex-col gap-2 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[10%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[10%] sm:top-[10%] sm:h-auto sm:max-h-[75vh] sm:max-w-lg'>
      <div className='flex h-12 w-full flex-row items-center justify-between px-2'>
        <span className='font-semibold text-neutral-800'>
          {hasAddress ? 'Choose a delivery address' : 'Enter delivery address'}
        </span>

        <DialogClose asChild>
          <Button variant='ghost' size='icon'>
            <Cross2Icon className='h-4 w-4' />

            <span className='sr-only'>Close</span>
          </Button>
        </DialogClose>
      </div>

      {hasAddress ? (
        <>
          <div className='flex flex-col gap-4'>
            {addresses.map(({ addressLine1, city, state, zipCode }, index) => (
              <button
                key={`address-${index}`}
                className='inline-flex items-center gap-4 rounded-lg p-4 px-2 transition-colors duration-100 hover:bg-neutral-50'
              >
                <Location
                  className={cn('w-5 fill-neutral-600', {
                    'fill-primary-500': selected === index,
                  })}
                />

                <span
                  className={cn('flex flex-col items-start text-neutral-600', {
                    'text-primary-700': selected === index,
                  })}
                >
                  <span className='text-xs font-semibold'>{addressLine1}</span>
                  <span className='text-[0.65rem]'>
                    {[city, state, zipCode].join(', ')}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <Button
            variant='link'
            className='mx-auto mt-1 inline max-w-40 text-xs font-medium'
          >
            Add another address
          </Button>
        </>
      ) : (
        <LocationInput type='search' />
      )}
    </DialogContent>
  );
}
