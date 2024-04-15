import Edit from '@/components/icons/edit';
import Location from '@/components/icons/location';
import { Address } from '@/lib/types/customer';
import { cn } from '@/lib/utils';
import { Dialog, DialogTrigger } from '../ui/dialog';
import AddressDialogContent from './address-dialog-content';

export default function EditAddess({ address }: { address: Address }) {
  const { addressLine1, addressLine2, city, state, zipCode, isDefault } =
    address;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='inline-flex items-center gap-2 rounded-lg p-4 px-0 transition-colors duration-100 hover:bg-neutral-50 sm:gap-4 sm:px-2'>
          <Location
            className={cn('max-w-4 fill-neutral-600', {
              'fill-primary-500': isDefault,
            })}
          />

          <span
            className={cn('flex flex-col items-start text-neutral-600', {
              'text-primary-600': isDefault,
            })}
          >
            <span className='text-xs font-semibold'>{addressLine1}</span>

            <span className='text-[0.65rem]'>
              {[addressLine2, city, state, zipCode].filter(Boolean).join(', ')}
            </span>
          </span>

          <Edit
            className={cn('ml-auto max-w-4 fill-neutral-600', {
              'fill-primary-500': isDefault,
            })}
          />
        </button>
      </DialogTrigger>

      <AddressDialogContent {...address} />
    </Dialog>
  );
}
