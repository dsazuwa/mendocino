import { useState } from 'react';

import { AddressData } from '@/types/address';
import ContentFooter from '../content-footer';
import Loader from '../loader';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem, RadioLabel } from '../ui/radio-group';
import { Textarea } from '../ui/textarea';
import AutocompleteMap from './autocomplete-map';

type Props = { defaultAddress?: AddressData };

export default function AddressForm({ defaultAddress }: Props) {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<AddressData | undefined>(
    defaultAddress,
  );

  const createAddress = () => {
    setLoading(true);

    // isGuest || isAuth

    setLoading(false);
  };

  return (
    <form>
      <div className='flex flex-1 flex-col space-y-4 overflow-y-auto p-4 sm:p-6'>
        <AutocompleteMap
          selected={selected}
          onSelect={(address: AddressData) => setSelected(address)}
        />

        <div className='flex-1 space-y-4'>
          {defaultAddress && (
            <div className='flex flex-col items-start gap-1'>
              <span className='text-xs font-semibold'>
                {defaultAddress.name}
              </span>

              <span className='text-xxs'>
                {[defaultAddress.address, defaultAddress.zipCode].join(', ')}
              </span>
            </div>
          )}

          <div className='inline-flex items-center gap-2'>
            <span className='text-xs font-semibold'>Apt</span>

            <Input
              className='h-[46px] text-xxs'
              placeholder='Apt 401 or Suite 1203'
            />
          </div>

          <div className='space-y-2'>
            <span className='text-xs font-semibold'>Drop-off Options</span>

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
              className='text-xs font-semibold'
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
        <Button
          variant='primary'
          className='w-full'
          disabled={loading || !selected}
          onClick={createAddress}
        >
          {loading ? <Loader size='sm' /> : 'Save'}
        </Button>
      </ContentFooter>
    </form>
  );
}
