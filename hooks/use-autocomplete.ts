/* eslint-disable @typescript-eslint/no-floating-promises */

import { Libraries, Loader } from '@googlemaps/js-api-loader';
import { useEffect, useMemo, useState } from 'react';

type LoadedState = {
  isLoaded: true;
  service: google.maps.places.AutocompleteService;
  sessionToken: google.maps.places.AutocompleteSessionToken;
  geocoder: google.maps.Geocoder;
};

type NotLoadedState = {
  isLoaded: false;
  service: null;
  sessionToken: null;
  geocoder: null;
};

type AutocompleteState = LoadedState | NotLoadedState;

export default function useAutocomplete(): AutocompleteState {
  const [libraries] = useState<Libraries>(['places']);
  const [isLoaded, setIsLoaded] = useState(false);

  const [service, setService] =
    useState<google.maps.places.AutocompleteService | null>(null);
  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

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

        setService(new google.maps.places.AutocompleteService());
        setSessionToken(new google.maps.places.AutocompleteSessionToken());
        setGeocoder(new google.maps.Geocoder());
        setIsLoaded(true);
      });
    };

    loadPlaces();
  }, []);

  return memoizedService && memoizedSessionToken && geocoder
    ? {
        isLoaded: true,
        service: memoizedService,
        sessionToken: memoizedSessionToken,
        geocoder,
      }
    : {
        isLoaded: false,
        service: null,
        sessionToken: null,
        geocoder: null,
      };
}
