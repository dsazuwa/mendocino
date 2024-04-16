'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { Autocomplete, Libraries, useLoadScript } from '@react-google-maps/api';
import { ChangeEvent, KeyboardEvent, useState } from 'react';

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

  const [libraries] = useState<Libraries>(['places']);

  const [value, setValue] = useState('');
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_PLACES_API_KEY as string,
    libraries,
    region: 'us',
  });

  const clearValue = () => setValue('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(e.target.value);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // TODO: select first option
      return false;
    }
  };

  const onLoad = (obj: google.maps.places.Autocomplete) => {
    setAutocomplete(obj);
  };

  type Address = {
    suite?: string;
    streetNumber: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };

  const isCompleteAddress = (address: Partial<Address>): address is Address =>
    address.streetNumber !== undefined &&
    address.street !== undefined &&
    address.city !== undefined &&
    address.state !== undefined &&
    address.zipCode !== undefined;

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();

      if (place && place.address_components) {
        const address: Partial<Address> = {};

        place.address_components.forEach((component) => {
          component.types.forEach((type) => {
            switch (type) {
              case 'subpremise':
                address.suite = component.long_name;
                break;

              case 'street_number':
                address.streetNumber = component.long_name;
                break;

              case 'route':
                address.street = component.long_name;
                break;

              case 'locality':
                address.city = component.long_name;
                break;

              case 'administrative_area_level_1':
                address.state = component.short_name;
                break;

              case 'postal_code':
                address.zipCode = component.long_name;
                break;

              default:
                break;
            }
          });
        });

        console.log(address, isCompleteAddress(address));
      }
    }
  };

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
