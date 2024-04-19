import { Libraries, useLoadScript } from '@react-google-maps/api';
import { ChangeEvent, KeyboardEvent, useState } from 'react';

import { StructuredAddress } from '@/types/common';

export default function useGooglePlaces(defaultAddress?: string) {
  const [libraries] = useState<Libraries>(['places']);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_PLACES_API_KEY as string,
    libraries,
    region: 'us',
  });

  const [value, setValue] = useState(defaultAddress || '');

  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const clearValue = () => setValue('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(e.target.value);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // TODO: select first option
      return false;
    }
  };

  const onLoad = (obj: google.maps.places.Autocomplete) => {
    setAutocomplete(obj);
  };

  // const isCompleteAddress = (address: Partial<Address>): address is Address =>
  //   address.streetNumber !== undefined &&
  //   address.street !== undefined &&
  //   address.city !== undefined &&
  //   address.state !== undefined &&
  //   address.zipCode !== undefined;

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();

      if (place && place.address_components) {
        const address: Partial<StructuredAddress> = {};

        place.address_components.forEach((component) => {
          component.types.forEach((type) => {
            switch (type) {
              case 'subpremise':
                address.suite = component.long_name;
                break;

              case 'street_number':
                address.streetNumber = component.long_name;
                break;

              case 'route':
                address.street = component.long_name;
                break;

              case 'locality':
                address.city = component.long_name;
                break;

              case 'administrative_area_level_1':
                address.state = component.short_name;
                break;

              case 'postal_code':
                address.zipCode = component.long_name;
                break;

              default:
                break;
            }
          });
        });

        console.log(address);
      }
    }
  };

  if (loadError) throw new Error('failed to load Google Places Api');

  return {
    isLoaded,
    autocomplete,
    value,
    clearValue,
    handleChange,
    onKeyDown,
    onLoad,
    onPlaceChanged,
  };
}
