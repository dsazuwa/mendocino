import { GoogleMap } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

import useGooglePlaces from '@/hooks/use-google-places';
import AutocompleteInput from './autocomplete-input';

export default function SearchMap({ defaultValue }: { defaultValue?: string }) {
  const {
    isLoaded,
    autocomplete,
    value,
    clearValue,
    handleChange,
    onKeyDown,
    onLoad,
    onPlaceChanged,
  } = useGooglePlaces(defaultValue);

  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const selectedPlace = autocomplete?.getPlace();
    const placeId = selectedPlace?.place_id;

    if (selectedPlace && placeId && map !== null) {
      const placeService = new window.google.maps.places.PlacesService(map);

      placeService.getDetails({ placeId }, (result, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          result !== null
        ) {
          const { geometry } = result;

          const lat = geometry?.location?.lat();
          const lng = geometry?.location?.lng();

          if (lat !== undefined && lng !== undefined)
            map.setCenter({ lat, lng });
        } else {
          console.error('Error fetching place details:', status);
        }
      });
    }
  }, [map, value]);

  return (
    <>
      <AutocompleteInput
        isLoaded={isLoaded}
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        type='map'
        value={value}
        clearValue={clearValue}
        onChange={handleChange}
        onKeyDown={onKeyDown}
      />

      {isLoaded && (
        <GoogleMap
          mapContainerClassName='aspect-video rounded-md'
          onLoad={(mapInstance) => setMap(mapInstance)}
          options={{ zoom: 100 }}
        />
      )}
    </>
  );
}
