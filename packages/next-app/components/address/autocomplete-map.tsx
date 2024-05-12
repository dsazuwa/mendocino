import { useEffect, useState } from 'react';

import useAutocomplete from '@/hooks/use-autocomplete';
import { AddressData } from '@/types/address';
import Search from '../icons/search';
import AutocompleteInput from './autocomplete-input';
import InputContainer from './autocomplete-input-container';

type Props = {
  selected?: AddressData;
  onSelect: (address: AddressData) => void;
};

export default function AutocompleteMap({ selected, onSelect }: Props) {
  const { isLoaded, service, sessionToken, geocoder } = useAutocomplete();

  const getMapURL = (address: AddressData) => {
    const { lat, lng } = address;

    const apiKey = process.env.NEXT_PUBLIC_PLACES_API_KEY;
    const mapCenter = `center=${lat},${lng}`;
    const mapSize = 'size=1024x576';
    const mapZoom = 'zoom=17';
    const marker = `markers=color:red%7C${lat},${lng}`;
    const mapType = 'maptype=roadmap';

    return `https://maps.googleapis.com/maps/api/staticmap?${mapCenter}&${mapSize}&${mapZoom}&${marker}&${mapType}&key=${apiKey}`;
  };

  const [mapURL, setMapURL] = useState(
    selected
      ? getMapURL(selected)
      : 'https://www.adampack.com/wp-content/plugins/complianz-gdpr/assets/images/placeholder-google-maps.jpg',
  );

  useEffect(() => {
    if (!selected) return;

    setMapURL(getMapURL(selected));
  }, [selected]);

  return (
    <>
      {isLoaded ? (
        <AutocompleteInput
          service={service}
          sessionToken={sessionToken}
          geocoder={geocoder}
          onSelect={onSelect}
          defaultValue={selected}
        />
      ) : (
        <InputContainer Icon={Search} />
      )}

      <img
        src={mapURL}
        alt='map'
        className='aspect-video rounded-md object-cover'
      />
    </>
  );
}
