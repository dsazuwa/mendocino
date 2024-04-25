import { useEffect, useState } from 'react';

import useAutocompleteWithMap from '@/hooks/use-autocomplete-with-map';
import { AddressData } from '@/types/address';
import AutocompleteInput from '../home/autocomplete-input';
import Search from '../icons/search';
import InputContainer from '../input-container';

type Props = { defaultValue?: AddressData };

export default function SearchMap({ defaultValue }: Props) {
  const { isLoaded, service, sessionToken, map, geocoder } =
    useAutocompleteWithMap();

  const [selected, setSelected] = useState<AddressData | undefined>(
    defaultValue,
  );

  useEffect(() => {
    if (!map || !selected) return;

    const { lat, lng } = selected;

    map.setCenter({ lat, lng });
  }, [selected]);

  return (
    <>
      {isLoaded ? (
        <AutocompleteInput
          service={service}
          sessionToken={sessionToken}
          geocoder={geocoder}
          onSelect={(address: AddressData) => void setSelected(address)}
          defaultValue={defaultValue}
        />
      ) : (
        <InputContainer Icon={Search} />
      )}

      <div id='map' className='aspect-video' />
    </>
  );
}
