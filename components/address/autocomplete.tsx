'use client';

import { createAddress } from '@/app/actions/address';
import useAutocomplete from '@/hooks/use-autocomplete';
import { Address, AddressData } from '@/types/address';
import Search from '../icons/search';
import AutocompleteInput from './autocomplete-input';
import InputContainer from './autocomplete-input-container';

type Props = { defaultValue?: Address };

export default function Autocomplete({ defaultValue }: Props) {
  const { isLoaded, service, sessionToken, geocoder } = useAutocomplete();

  const handleSelect = (address: AddressData) => {
    void createAddress(undefined, address);
  };

  return isLoaded ? (
    <AutocompleteInput
      service={service}
      sessionToken={sessionToken}
      geocoder={geocoder}
      onSelect={handleSelect}
      defaultValue={defaultValue}
    />
  ) : (
    <InputContainer Icon={Search} />
  );
}
