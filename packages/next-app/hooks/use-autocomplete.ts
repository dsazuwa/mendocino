/* eslint-disable @typescript-eslint/no-floating-promises */

import { Libraries, Loader } from '@googlemaps/js-api-loader';
import { useEffect, useMemo, useState } from 'react';

type GoogleMapsState = {
  service: google.maps.places.AutocompleteService | null;
  sessionToken: google.maps.places.AutocompleteSessionToken | null;
  geocoder: google.maps.Geocoder | null;
};

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

export default function useAutocompleteWithMap(): AutocompleteState {
  const [libraries] = useState<Libraries>(['places']);
  const [isLoaded, setIsLoaded] = useState(false);

  const [googleMaps, setGoogleMaps] = useState<GoogleMapsState>({
    service: null,
    sessionToken: null,
    geocoder: null,
  });

  const memoizedService = useMemo(() => googleMaps.service, [isLoaded]);
  const memoizedSessionToken = useMemo(
    () => googleMaps.sessionToken,
    [isLoaded],
  );

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

        setGoogleMaps((state) => ({
          ...state,
          service: new google.maps.places.AutocompleteService(),
          sessionToken: new google.maps.places.AutocompleteSessionToken(),
          geocoder: new google.maps.Geocoder(),
        }));

        setIsLoaded(true);
      });
    };

    loadPlaces();
  }, []);

  return memoizedService && memoizedSessionToken && googleMaps.geocoder
    ? {
        isLoaded: true,
        service: memoizedService,
        sessionToken: memoizedSessionToken,
        geocoder: googleMaps.geocoder,
      }
    : {
        isLoaded: false,
        service: null,
        sessionToken: null,
        geocoder: null,
      };
}
