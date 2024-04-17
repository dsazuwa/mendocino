import Edit from '@/components/icons/edit';
import Location from '@/components/icons/location';
import { Address } from '@/types/customer';
import { DialogTrigger } from '../ui/dialog';
import { SheetTrigger } from '../ui/sheet';

type Props = { isDialog: boolean; address: Address };

export default function EditTrigger({ isDialog, address }: Props) {
  const { addressLine1, addressLine2, city, state, zipCode } = address;

  const Comp = isDialog ? DialogTrigger : SheetTrigger;

  return (
    <Comp asChild>
      <button className='inline-flex items-center gap-2 rounded-lg p-4 px-0 transition-colors duration-100 hover:bg-neutral-50 sm:gap-4 sm:px-2'>
        <Location className='max-w-4 fill-neutral-600' />

        <span className='flex flex-col items-start text-neutral-600'>
          <span className='text-xs font-semibold'>{addressLine1}</span>

          <span className='text-[0.65rem]'>
            {[addressLine2, city, state, zipCode].filter(Boolean).join(', ')}
          </span>
        </span>

        <Edit className='ml-auto max-w-4 fill-neutral-600' />
      </button>
    </Comp>
  );
}
