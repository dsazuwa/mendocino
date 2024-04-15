import { cn } from '@/lib/utils';
import { Address } from '@/types/customer';
import ContentFooter from '../content-footer';
import Location from '../icons/location';
import { Button } from '../ui/button';

type Props = { addresses: Address[] };

export default function AddressSelector({ addresses }: Props) {
  const selected = 0;

  return (
    <>
      <div className='flex flex-1 flex-col gap-4 p-4 sm:p-6'>
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

      <ContentFooter>
        <Button variant='primary' className='w-full'>
          Add Address
        </Button>
      </ContentFooter>
    </>
  );
}
