import { Cross2Icon } from '@radix-ui/react-icons';

import { DialogClose } from '@/components/ui/dialog';
import { Address } from '@/types/common';
import ContentFooter from '../content-footer';
import ContentHeader from '../content-header';
import Delete from '../icons/delete';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem, RadioLabel } from '../ui/radio-group';
import { SheetClose } from '../ui/sheet';
import { Textarea } from '../ui/textarea';
import SearchMap from './search-map';

type Props = { isDialog: boolean; address: Address };

export default function EditContent({ isDialog, address: addressProp }: Props) {
  const { name, address, zipCode } = addressProp;

  const Comp = isDialog ? DialogClose : SheetClose;

  return (
    <>
      <ContentHeader>
        <Comp asChild>
          <Button variant='ghost' size='icon'>
            <Cross2Icon className='h-4 w-4 fill-neutral-500' />

            <span className='sr-only'>Close</span>
          </Button>
        </Comp>

        <span className='flex-1 text-sm font-semibold text-neutral-800'>
          Edit Address
        </span>

        <Button variant='ghost' size='icon'>
          <Delete className='h-4 w-4 fill-neutral-500' />
        </Button>
      </ContentHeader>

      <div className='flex flex-1 flex-col space-y-4 overflow-y-auto p-4 sm:p-6'>
        <SearchMap
          defaultValue={Object.values(address)
            .filter((x) => typeof x !== 'boolean')
            .join(', ')}
        />

        <div className='flex-1 space-y-4'>
          <div className='flex flex-col items-start gap-1 text-neutral-600'>
            <span className='text-xs font-semibold'>{name}</span>

            <span className='text-xxs'>{[address, zipCode].join(', ')}</span>
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

      <ContentFooter>
        <Button variant='primary' className='w-full'>
          Save Address
        </Button>
      </ContentFooter>
    </>
  );
}
