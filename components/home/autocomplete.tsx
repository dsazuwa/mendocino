'use client';

import { createGuestAddress } from '@/app/action';
import useAutocomplete from '@/hooks/use-autocomplete';
import { Address, AddressData } from '@/types/address';
import Search from '../icons/search';
import InputContainer from '../input-container';
import AutocompleteInput from './autocomplete-input';

type Props = {
  sessionId?: string;
  defaultValue?: Address;
};

export default function Autocomplete({ sessionId, defaultValue }: Props) {
  const { isLoaded, service, sessionToken, geocoder } = useAutocomplete();

  const handleSelect = (address: AddressData) => {
    if (sessionId) void createGuestAddress(sessionId, address);
    // else // create authenticated user address
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
