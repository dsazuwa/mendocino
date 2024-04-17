import { Cross2Icon } from '@radix-ui/react-icons';
import { Autocomplete } from '@react-google-maps/api';
import { ChangeEvent, KeyboardEvent } from 'react';

import { cn } from '@/lib/utils';
import Location from '../icons/location';
import Search from '../icons/search';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

type Props = {
  isLoaded: boolean;
  onLoad: (autocomplete: google.maps.places.Autocomplete) => void;
  onPlaceChanged: () => void;
  type?: 'search' | 'map';
  value: string;
  clearValue: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => false | undefined;
};

export default function AutocompleteInput({
  isLoaded,
  onLoad,
  onPlaceChanged,
  type,
  value,
  clearValue,
  onChange,
  onKeyDown,
}: Props) {
  const Icon = type == 'search' ? Search : Location;
  const placeholder = type == 'search' ? 'Search' : 'Enter pickup address';

  return (
    <div
      className={cn(
        'flex w-full flex-row items-center rounded-lg border border-neutral-200 px-2 py-1 shadow-sm has-[:focus-visible]:border-primary-700/30',
        // className,
      )}
    >
      <Icon className='w-8 fill-neutral-600 p-2' />

      {isLoaded && (
        <Autocomplete
          onLoad={onLoad}
          fields={['place_id', 'name', 'address_components']}
          onPlaceChanged={onPlaceChanged}
          className='w-full'
        >
          <Input
            id='delivery-address-input'
            aria-label='Input delivery address'
            placeholder={placeholder}
            className='border-none py-0 pl-0 text-xs shadow-none focus-visible:border-none'
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
        </Autocomplete>
      )}

      {isLoaded && value !== '' && (
        <Button
          variant='ghost'
          size='icon'
          onClick={clearValue}
          aria-label='clear'
          className='h-4 w-4 bg-neutral-200 hover:bg-neutral-300'
        >
          <Cross2Icon className='w-2' />
        </Button>
      )}
    </div>
  );
}
