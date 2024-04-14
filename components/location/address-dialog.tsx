'use client';

import Edit from '@/components/icons/edit';
import Location from '@/components/icons/location';
import { Address } from '@/lib/types/customer';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import DialogHeader from './dialog-header';

export default function AddessDialog({ address }: { address: Address }) {
  const { addressLine1, city, state, zipCode } = address;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='inline-flex items-center gap-2 rounded-lg p-4 px-0 transition-colors duration-100 hover:bg-neutral-50 sm:gap-4 sm:px-2'>
          <Location className='max-w-4 fill-neutral-600' />

          <span className='flex flex-col items-start text-neutral-600'>
            <span className='text-xs font-semibold'>{addressLine1}</span>

            <span className='text-[0.65rem]'>
              {[city, state, zipCode].join(', ')}
            </span>
          </span>

          <Edit className='ml-auto max-w-4 fill-neutral-600' />
        </button>
      </DialogTrigger>

      <DialogContent className='left-[50%] h-screen max-w-lg translate-x-[-50%] data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[25%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[25%] sm:top-[25%] sm:h-auto sm:translate-y-[-75%]'>
        <DialogHeader text='Edit Address' />
      </DialogContent>
    </Dialog>
  );
}
