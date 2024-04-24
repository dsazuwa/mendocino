'use client';

import useAutocomplete from '@/hooks/use-autocomplete';
import { Suggestion, Address } from '@/types/address';
import Search from '../icons/search';
import InputContainer from '../input-container';
import AutocompleteInput from './autocomplete-input';
import { createGuestAddress, getClosestLocations } from '@/app/action';

type Props = {
  sessionId?: string;
  defaultValue?: Address;
};

export default function Autocomplete({ sessionId, defaultValue }: Props) {
  const { isLoaded, service, sessionToken } = useAutocomplete();

  const handleSelect = (address: Suggestion) => {
    getClosestLocations(address.placeId)
      .then((result) => console.log(result))
      .catch((err) => console.error(err));

    if (sessionId) void createGuestAddress(sessionId, address);
    // else // create authenticated user address
  };

  return isLoaded ? (
    <AutocompleteInput
      service={service}
      sessionToken={sessionToken}
      onSelect={handleSelect}
      defaultValue={defaultValue}
    />
  ) : (
    <InputContainer Icon={Search} />
  );
}
