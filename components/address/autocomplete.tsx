'use client';

import useAutocomplete from '@/hooks/use-autocomplete';
import { useCreateAddressMutation } from '@/store/api/address';
import { useAppSelector } from '@/store/hooks';
import { Address, AddressData } from '@/types/address';
import Search from '../icons/search';
import AutocompleteInput from './autocomplete-input';
import InputContainer from './autocomplete-input-container';

type Props = { defaultValue?: Address };

export default function Autocomplete({ defaultValue }: Props) {
  const { isLoaded, service, sessionToken, geocoder } = useAutocomplete();

  const guestSession = useAppSelector(
    (state) => state.addressState.guestSession,
  );

  const [createAddress] = useCreateAddressMutation();

  const handleSelect = (address: AddressData) => {
    void createAddress({ address, guestSession });
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
