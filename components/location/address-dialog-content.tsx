import { ArrowLeftIcon } from '@radix-ui/react-icons';

import { DialogClose } from '@/components/ui/dialog';
import { Address } from '@/lib/types/customer';
import Delete from '../icons/delete';
import { Button } from '../ui/button';
import { DialogContent } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem, RadioLabel } from '../ui/radio-group';
import { Textarea } from '../ui/textarea';
import LocationInput from './location-input';

export default function AddressDialogContent({
  addressLine1,
  addressLine2,
  city,
  state,
  zipCode,
}: Address) {
  return (
    <DialogContent className='left-[50%] flex h-screen w-full translate-x-[-50%] flex-col p-0 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[25%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[25%] sm:top-[25%] sm:h-auto sm:w-full sm:max-w-lg sm:translate-y-[-25%]'>
      <div className='h-18 flex w-full flex-row items-center gap-4 border-b border-neutral-200 p-4 sm:h-20 sm:p-6'>
        <DialogClose asChild>
          <Button variant='ghost' size='icon'>
            <ArrowLeftIcon className='h-4 w-4 fill-neutral-500' />

            <span className='sr-only'>Close</span>
          </Button>
        </DialogClose>

        <span className='flex-1 text-sm font-semibold text-neutral-800'>
          Edit Address
        </span>

        <Button variant='ghost' size='icon'>
          <Delete className='h-4 w-4 fill-neutral-500' />
        </Button>
      </div>

      <div className='flex flex-1 flex-col space-y-4 p-4 sm:p-6'>
        <LocationInput type='search' className='' />

        <div className='aspect-video rounded-md bg-neutral-100'></div>

        <div className='flex-1 space-y-4'>
          <div className='flex flex-col items-start gap-1 text-neutral-600'>
            <span className='text-xs font-semibold'>{addressLine1}</span>

            <span className='text-xxs'>
              {[addressLine2, city, state, zipCode].filter(Boolean).join(', ')}
            </span>
          </div>

          <div className='flex flex-row items-center gap-2 text-neutral-600'>
            <span className='text-xs font-semibold text-neutral-600'>Apt</span>

            <Input
              className='h-[46px] text-xxs'
              placeholder='Apt 401 or Suite 1203'
            />
          </div>

          <div className='space-y-2'>
            <span className='text-xs font-semibold text-neutral-600'>
              Drop-off Options
            </span>

            <RadioGroup defaultValue='1' className='gap-0'>
              <div className='flex items-center gap-4'>
                <RadioGroupItem value='0' id='drop-off-option-0' />
                <RadioLabel htmlFor='drop-off-option-0'>
                  Hand it to me
                </RadioLabel>
              </div>

              <div className='flex items-center gap-4'>
                <RadioGroupItem value='1' id='drop-off-option-1' />
                <RadioLabel htmlFor='drop-off-option-1'>
                  Leave it at my door
                </RadioLabel>
              </div>
            </RadioGroup>
          </div>

          <div className='space-y-4'>
            <Label
              htmlFor='drop-off-instructions'
              className='text-xs font-semibold text-neutral-600'
            >
              Drop-off Instructions
            </Label>

            <Textarea
              id='drop-off-instructions'
              className='min-h-20 text-xs'
              maxLength={225}
              placeholder='eg. ring the bell after dropoff, leave next to the porch, call upon arrival, etc.'
            />
          </div>
        </div>
      </div>

      <div className='border-t border-neutral-200 p-4 sm:p-6'>
        <Button variant='primary' className='w-full'>
          Save Address
        </Button>
      </div>
    </DialogContent>
  );
}
