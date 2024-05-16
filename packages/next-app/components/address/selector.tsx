import { Cross2Icon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Address } from '@/types/address';
import ContentFooter from '../content-footer';
import ContentHeader from '../content-header';
import Edit from '../icons/edit';
import Location from '../icons/location';
import { Button } from '../ui/button';
import { DialogClose } from '../ui/dialog';
import { SheetClose } from '../ui/sheet';

type Props = {
  isDialog: boolean;
  addresses: Address[];
  selectedAddress: Address;
  handleCreate: () => void;
  handleEdit: (i: number) => void;
  handleSelect: (id: number) => void;
};

export default function AddressSelector({
  isDialog,
  addresses,
  selectedAddress,
  handleCreate,
  handleEdit,
  handleSelect,
}: Props) {
  const Close = isDialog ? DialogClose : SheetClose;

  return (
    <>
      <ContentHeader>
        <Close asChild>
          <Button variant='ghost' size='icon'>
            <Cross2Icon className='h-4 w-4' />

            <span className='sr-only'>Close</span>
          </Button>
        </Close>

        <span className='flex-1 text-sm font-semibold'>Delivery Address</span>
      </ContentHeader>

      <div className='flex flex-1 flex-col gap-4 p-4 sm:p-6'>
        {addresses.map(({ id, name, address, zipCode }, index) => (
          <div key={`address-${index}`} className='inline-flex items-center'>
            <button
              className='inline-flex flex-1 items-center gap-4 rounded-lg p-4 px-2 transition-colors duration-100 hover:bg-neutral-50'
              onClick={() => handleSelect(id)}
            >
              <Location
                className={cn('w-5 fill-neutral-600', {
                  'fill-primary-500': id === selectedAddress.id,
                })}
              />

              <span className='flex flex-col items-start text-left'>
                <span className='text-xs font-semibold'>{name}</span>
                <span className='text-[0.65rem]'>
                  {[address, zipCode].filter(Boolean).join(', ')}
                </span>
              </span>
            </button>

            <Button
              variant='ghost'
              size='icon'
              onClick={() => handleEdit(index)}
            >
              <Edit className='w-4 flex-shrink-0 fill-neutral-600' />
            </Button>
          </div>
        ))}
      </div>

      <ContentFooter>
        <Button variant='primary' className='w-full' onClick={handleCreate}>
          Add Address
        </Button>
      </ContentFooter>
    </>
  );
}
