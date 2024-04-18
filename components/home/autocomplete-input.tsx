'use client';

/* eslint-disable @typescript-eslint/no-floating-promises */

import { useCombobox } from 'downshift';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import Check from '../icons/check';
import Location from '../icons/location';
import Search from '../icons/search';
import InputContainer from '../input-container';
import { Input } from '../ui/input';

type Address = {
  suite?: string;
  id: string;
  name: string;
  address: string;
  zipCode: string;
  lat: number;
  lng: number;
};

type Suggestion = {
  id: string;
  name: string;
  address: string;
};

type SearchResult = {
  autocompleteSuggestions: Suggestion[];
  status: string;
};

type Props = {
  defaultValue?: Address;
  service: google.maps.places.AutocompleteService;
  sessionToken: google.maps.places.AutocompleteSessionToken;
};

export default function AutocompleteInput({
  service,
  sessionToken,
  defaultValue,
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

    itemToKey: (item) => item?.id,

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
                id: prediction.place_id,
                name: prediction.structured_formatting.main_text,
                address: prediction.structured_formatting.secondary_text,
              }))
            : [];

        setSearchResult({ autocompleteSuggestions, status });
      };

      service.getPlacePredictions(
        { input: inputValue, sessionToken, region: 'us ' },
        handlePredictions,
      );
    },
  });

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
            'rounded-xl absolute top-0 z-10 w-full bg-stone-50 outline-none animate-in fade-in-0 zoom-in-95',
            { hidden: !isOpen },
          )}
        >
          <ul className='rounded-lg ring-1 ring-slate-200' {...getMenuProps()}>
            {isOpen && (
              <>
                {searchResult.autocompleteSuggestions.map((item, index) => {
                  const isSelected = selected?.id === item.id;
                  const ItemIcon = isSelected ? Check : Location;

                  return (
                    <li
                      key={item.id}
                      {...getItemProps({ item, index })}
                      className='inline-flex w-full items-center gap-2 px-2 py-1'
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
