'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';

import useGooglePlaces from '@/hooks/use-google-places';
import { cn } from '@/lib/utils';
import Location from '../icons/location';
import Search from '../icons/search';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

type Props = {
  className?: string;
  type?: 'search' | 'map';
};

export default function AddressInput({ className, type }: Props) {
  const Icon = type === 'search' ? Search : Location;
  const placeholder = type === 'search' ? 'Search' : 'Enter pickup address';

  const {
    libraries,
    value,
    clearValue,
    handleChange,
    onKeyDown,
    onLoad,
    onPlaceChanged,
  } = useGooglePlaces();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_PLACES_API_KEY as string,
    libraries,
    region: 'us',
  });

  if (loadError) throw new Error('failed to load Google Places Api');

  return (
    <div
      className={cn(
        'flex w-full flex-row items-center rounded-lg border border-neutral-200 px-2 py-1 shadow-sm has-[:focus-visible]:border-primary-700/30',
        className,
      )}
    >
      <Icon className='w-8 fill-neutral-600 p-2' />

      {isLoaded && (
        <Autocomplete
          onLoad={onLoad}
          fields={[
            'place_id',
            'name',
            'formatted_address',
            'adr_address',
            'address_components',
          ]}
          onPlaceChanged={onPlaceChanged}
          className='w-full'
        >
          <Input
            id='delivery-address-input'
            aria-label='Input delivery address'
            placeholder={placeholder}
            className='border-none py-0 pl-0 text-xs shadow-none focus-visible:border-none'
            value={value}
            onChange={handleChange}
            onKeyDown={onKeyDown}
          />
        </Autocomplete>
      )}

      {value !== '' && (
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
