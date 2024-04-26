import { useEffect, useState } from 'react';

import useAutocomplete from '@/hooks/use-autocomplete';
import { AddressData } from '@/types/address';
import AutocompleteInput from '../home/autocomplete-input';
import Search from '../icons/search';
import InputContainer from '../input-container';

type Props = { defaultValue?: AddressData };

export default function SearchMap({ defaultValue }: Props) {
  const { isLoaded, service, sessionToken, geocoder } = useAutocomplete();

  const [selected, setSelected] = useState<AddressData | undefined>(
    defaultValue,
  );

  const getMapURL = (address: AddressData) => {
    const { lat, lng } = address;

    const apiKey = process.env.NEXT_PUBLIC_PLACES_API_KEY;
    const mapCenter = `center=${lat},${lng}`;
    const mapSize = 'size=600x300';
    const mapZoom = 'zoom=16';
    const marker = `markers=color:red%7C${lat},${lng}`;
    const mapType = 'maptype=roadmap';

    return `https://maps.googleapis.com/maps/api/staticmap?${mapCenter}&${mapSize}&${mapZoom}&${marker}&${mapType}&key=${apiKey}`;
  };

  const [mapURL, setMapURL] = useState(
    defaultValue
      ? getMapURL(defaultValue)
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
          onSelect={(address: AddressData) => void setSelected(address)}
          defaultValue={defaultValue}
        />
      ) : (
        <InputContainer Icon={Search} />
      )}

      <img src={mapURL} alt='map' className='aspect-video rounded-md' />
    </>
  );
}
