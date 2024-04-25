/* eslint-disable @typescript-eslint/no-floating-promises */

import { Libraries, Loader } from '@googlemaps/js-api-loader';
import { useEffect, useMemo, useState } from 'react';

import { AddressData } from '@/types/address';

type GoogleMapsState = {
  service: google.maps.places.AutocompleteService | null;
  sessionToken: google.maps.places.AutocompleteSessionToken | null;
  map: google.maps.Map | null;
  marker: google.maps.marker.AdvancedMarkerElement | null;
  geocoder: google.maps.Geocoder | null;
};

type LoadedState = {
  isLoaded: true;
  service: google.maps.places.AutocompleteService;
  sessionToken: google.maps.places.AutocompleteSessionToken;
  map: google.maps.Map;
  marker: google.maps.marker.AdvancedMarkerElement;
  geocoder: google.maps.Geocoder;
};

type NotLoadedState = {
  isLoaded: false;
  service: null;
  sessionToken: null;
  map: null;
  marker: null;
  geocoder: null;
};

type AutocompleteState = LoadedState | NotLoadedState;

export default function useAutocompleteWithMap(
  defaultAddress?: AddressData,
): AutocompleteState {
  const [libraries] = useState<Libraries>(['places']);
  const [isLoaded, setIsLoaded] = useState(false);

  const [googleMaps, setGoogleMaps] = useState<GoogleMapsState>({
    service: null,
    sessionToken: null,
    map: null,
    marker: null,
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
        }));

        const mapElement = document.getElementById('map');

        if (!mapElement)
          throw new Error(
            'Autocomplete with map must be used with a valid map element. Make sure to include a <div id="map"> element in your HTML.',
          );

        const props = defaultAddress
          ? {
              center: { lat: defaultAddress.lat, lng: defaultAddress.lng },
              zoom: 16,
            }
          : { center: { lat: 39.8283, lng: -98.5795 }, zoom: 5 };

        const map = new window.google.maps.Map(mapElement, {
          ...props,
          mapId: process.env.NEXT_PUBLIC_MAP_ID,
          disableDefaultUI: true,
          keyboardShortcuts: false,
          clickableIcons: false,
          gestureHandling: 'none',
        });

        (
          google.maps.importLibrary(
            'marker',
          ) as Promise<google.maps.MarkerLibrary>
        ).then(({ AdvancedMarkerElement }) => {
          setGoogleMaps((state) => ({
            ...state,
            map,
            geocoder: new google.maps.Geocoder(),
            marker: new AdvancedMarkerElement({
              position: defaultAddress ? props.center : undefined,
              map,
            }),
          }));
        });

        setIsLoaded(true);
      });
    };

    loadPlaces();
  }, []);

  return memoizedService &&
    memoizedSessionToken &&
    googleMaps.map &&
    googleMaps.marker &&
    googleMaps.geocoder
    ? {
        isLoaded: true,
        service: memoizedService,
        sessionToken: memoizedSessionToken,
        map: googleMaps.map,
        marker: googleMaps.marker,
        geocoder: googleMaps.geocoder,
      }
    : {
        isLoaded: false,
        service: null,
        sessionToken: null,
        map: null,
        marker: null,
        geocoder: null,
      };
}
