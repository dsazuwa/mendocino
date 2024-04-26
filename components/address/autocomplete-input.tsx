'use client';

/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable  @typescript-eslint/no-unsafe-enum-comparison */

import { useCombobox } from 'downshift';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { AddressData, SearchResult } from '@/types/address';
import Check from '../icons/check';
import Location from '../icons/location';
import Search from '../icons/search';
import InputContainer from '../input-container';
import { Input } from '../ui/input';

type Props = {
  defaultValue?: AddressData;
  service: google.maps.places.AutocompleteService;
  sessionToken: google.maps.places.AutocompleteSessionToken;
  geocoder: google.maps.Geocoder;
  onSelect: (address: AddressData) => void;
};

export default function AutocompleteInput({
  service,
  sessionToken,
  geocoder,
  defaultValue,
  onSelect,
}: Props) {
  const placeholder = 'Search';

  const [searchResult, setSearchResult] = useState<SearchResult>({
    autocompleteSuggestions: defaultValue ? [defaultValue] : [],
    status: '',
  });

  const {
    isOpen,
    getInputProps,
    getItemProps,
    getMenuProps,
    selectedItem: selected,
  } = useCombobox({
    initialSelectedItem: defaultValue,
    items: searchResult.autocompleteSuggestions,

    itemToKey: (item) => item?.placeId,

    itemToString: (item) => {
      if (item === null) return '';
      return [item.name, item.address].filter(Boolean).join(', ');
    },

    onInputValueChange: ({ inputValue }) => {
      if (inputValue.trim() === '') {
        setSearchResult({ autocompleteSuggestions: [], status: '' });
        return;
      }

      const handlePredictions = (
        predictions: google.maps.places.AutocompletePrediction[] | null,
        status: string,
      ) => {
        const autocompleteSuggestions =
          predictions && status === 'OK'
            ? predictions.map((prediction) => ({
                placeId: prediction.place_id,
                name: prediction.structured_formatting.main_text,
                address: prediction.structured_formatting.secondary_text,
              }))
            : [];

        setSearchResult({ autocompleteSuggestions, status });
      };

      service.getPlacePredictions(
        {
          input: inputValue,
          sessionToken,
          componentRestrictions: { country: 'US' },
        },
        handlePredictions,
      );
    },
  });

  useEffect(() => {
    if (selected === null) return;

    geocoder.geocode({ placeId: selected.placeId }, (results, status) => {
      if (status === 'OK' && results !== null && results.length > 0) {
        const { geometry, address_components } = results[0];

        const address: AddressData = {
          placeId: selected.placeId,
          name: selected.name,
          address: selected.address,
          lat: geometry.location.lat(),
          lng: geometry.location.lng(),
        };

        address_components.forEach((component) => {
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

        onSelect(address);
      }
    });
  }, [selected]);

  return (
    <>
      <InputContainer Icon={Search}>
        <Input
          className='h-9 w-full border-none py-0 pl-0 text-xs shadow-none focus-visible:border-none'
          placeholder={placeholder}
          type='search'
          {...getInputProps()}
        />
      </InputContainer>

      <div className='relative mt-1'>
        <div
          className={cn(
            'rounded-xl absolute top-0 z-10 w-full bg-neutral-50 outline-none animate-in fade-in-0 zoom-in-95',
            { hidden: !isOpen },
          )}
        >
          <ul
            className='flex flex-col rounded-lg ring-1 ring-slate-200'
            {...getMenuProps()}
            tabIndex={1}
          >
            {isOpen && (
              <>
                {searchResult.autocompleteSuggestions.map((item, index) => {
                  const isSelected = selected?.placeId === item.placeId;
                  const ItemIcon = isSelected ? Check : Location;

                  return (
                    <li
                      key={item.placeId}
                      {...getItemProps({ item, index })}
                      className='mx-2 inline-flex items-center gap-2 px-2 py-1 hover:bg-neutral-100 aria-selected:bg-neutral-100'
                    >
                      <ItemIcon className='w-8 shrink-0 fill-neutral-600 p-2' />

                      <p className='flex flex-col'>
                        <span className='text-xs font-medium'>{item.name}</span>
                        <span className='text-[0.7rem]'>{item.address}</span>
                      </p>
                    </li>
                  );
                })}

                {searchResult.autocompleteSuggestions.length == 0 && (
                  <li className='select-none rounded-sm px-2 py-3 text-center text-sm'>
                    No results.
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
