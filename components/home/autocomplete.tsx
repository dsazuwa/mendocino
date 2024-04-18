'use client';

/* eslint-disable @typescript-eslint/no-floating-promises */

import { Libraries, Loader } from '@googlemaps/js-api-loader';
import { useEffect, useMemo, useState } from 'react';

import Search from '../icons/search';
import InputContainer from '../input-container';
import AutocompleteInput from './autocomplete-input';

export default function Autocomplete() {
  const [libraries] = useState<Libraries>(['places']);

  const [isLoaded, setIsLoaded] = useState(false);
  const [service, setService] =
    useState<google.maps.places.AutocompleteService | null>(null);
  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken | null>(null);

  const memoizedService = useMemo(() => service, [isLoaded]);
  const memoizedSessionToken = useMemo(() => sessionToken, [isLoaded]);

  useEffect(() => {
    const loadPlaces = () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_PLACES_API_KEY as string,
        version: 'weekly',
        libraries,
        region: 'US',
      });

      loader.load().then(() => {
        const google = window.google;
        const newService = new google.maps.places.AutocompleteService();
        const newSessionToken =
          new google.maps.places.AutocompleteSessionToken();

        setService(newService);
        setSessionToken(newSessionToken);
        setIsLoaded(true);
      });
    };

    loadPlaces();
  }, []);

  return memoizedService && memoizedSessionToken ? (
    <AutocompleteInput
      service={memoizedService}
      sessionToken={memoizedSessionToken}
    />
  ) : (
    <InputContainer Icon={Search} />
  );
}
