import {
  useGetAddressesQuery,
  useGetClosestLocationsQuery,
} from '@/store/api/address';

export function useGetAddresses(guestSession?: string) {
  const { data, isLoading, isFetching } = useGetAddressesQuery({
    guestSession,
  });

  const addresses = data?.addresses || [];

  return { addresses, isLoading: isLoading || isFetching };
}

export function useGetLocations(placeId: string) {
  const { data, isLoading } = useGetClosestLocationsQuery(placeId);

  const locations = data?.locations || [];

  return { locations: isLoading ? undefined : locations, isLoading };
}
