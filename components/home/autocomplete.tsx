'use client';

import useAutocomplete from '@/hooks/use-autocomplete';
import Search from '../icons/search';
import InputContainer from '../input-container';
import AutocompleteInput from './autocomplete-input';

export default function Autocomplete() {
  const { isLoaded, service, sessionToken } = useAutocomplete();

  return isLoaded ? (
    <AutocompleteInput service={service} sessionToken={sessionToken} />
  ) : (
    <InputContainer Icon={Search} />
  );
}
