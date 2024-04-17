'use client';

import useGooglePlaces from '@/hooks/use-google-places';
import AutocompleteInput from './autocomplete-input';

type Props = { type?: 'search' | 'map' };

export default function AddressInput({ type }: Props) {
  const {
    isLoaded,
    value,
    clearValue,
    handleChange,
    onKeyDown,
    onLoad,
    onPlaceChanged,
  } = useGooglePlaces('639 38th Str Rock Island, IL 61201');

  return (
    <AutocompleteInput
      isLoaded={isLoaded}
      onLoad={onLoad}
      onPlaceChanged={onPlaceChanged}
      type={type}
      value={value}
      clearValue={clearValue}
      onChange={handleChange}
      onKeyDown={onKeyDown}
    />
  );
}
