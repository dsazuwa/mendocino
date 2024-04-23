'use client';

import useAutocomplete from '@/hooks/use-autocomplete';
import Search from '../icons/search';
import InputContainer from '../input-container';
import AutocompleteInput from './autocomplete-input';
import { getClosestLocations } from '@/app/action';

export default function Autocomplete() {
  const { isLoaded, service, sessionToken } = useAutocomplete();

  const handler = (placeId: string) => {
    void getClosestLocations(placeId);
  };
  return isLoaded ? (
    <AutocompleteInput
      service={service}
      sessionToken={sessionToken}
      handler={handler}
    />
  ) : (
    <InputContainer Icon={Search} />
  );
}
