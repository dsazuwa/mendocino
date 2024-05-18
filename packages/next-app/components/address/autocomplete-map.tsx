import Image from 'next/image';
import { useEffect, useState } from 'react';

import useAutocomplete from '@/hooks/use-autocomplete';
import { cn } from '@/lib/utils';
import { AddressData } from '@/types/address';
import Search from '../icons/search';
import { Skeleton } from '../ui/skeleton';
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

  const [isMapLoading, setMapLoading] = useState(false);
  const [mapURL, setMapURL] = useState(
    selected
      ? getMapURL(selected)
      : 'https://www.adampack.com/wp-content/plugins/complianz-gdpr/assets/images/placeholder-google-maps.jpg',
  );

  useEffect(() => {
    if (!selected) return;

    setMapURL(getMapURL(selected));
    setMapLoading(false);
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

      <div>
        {!isMapLoading && <Skeleton className='aspect-video' />}
        <Image
          src={mapURL}
          alt='map'
          width={0}
          height={0}
          sizes='100vw'
          className={cn('aspect-video object-cover', {
            'h-full w-full': isMapLoading,
            'h-0 w-auto': !isMapLoading,
          })}
          onLoad={() => setMapLoading(true)}
        />
      </div>
    </>
  );
}
