/* eslint-disable @typescript-eslint/no-unused-vars */

import { createApi } from '@reduxjs/toolkit/query/react';

import { Address, AddressData } from '@/types/address';
import { LocationType } from '@/types/location';
import baseQueryWithReauth from '../base-query';

type MutationResponse = { message: string };

type MutationBody = {
  address: AddressData;
  guestSession?: string;
};

type UpdateBody = {
  address: Address;
  guestSession?: string;
};

type DeleteBody = {
  id: number;
  placeId: string;
  guestSession?: string;
};

export const addressApi = createApi({
  reducerPath: 'addressApi',
  tagTypes: ['Address', 'Location'],

  baseQuery: baseQueryWithReauth,

  endpoints: (build) => ({
    // TODO: delete cached data on associated address deletion
    getClosestLocations: build.query<{ locations: LocationType[] }, string>({
      query(placeId) {
        return {
          url: `/locations/distance/${placeId}`,
        };
      },

      providesTags: (result, error, placeId) => [
        { type: 'Location', id: placeId },
      ],

      keepUnusedDataFor: 6000,
    }),

    getAddresses: build.query<
      { addresses: Address[] },
      { guestSession?: string }
    >({
      query({ guestSession }) {
        const baseUrl = guestSession ? 'guests' : 'customers';

        return {
          url: `/${baseUrl}/me/addresses`,
          credentials: 'include',
        };
      },

      providesTags: ['Address'],
    }),

    createAddress: build.mutation<string, MutationBody>({
      query({ address, guestSession }) {
        const baseUrl = guestSession ? 'guests' : 'customers';

        return {
          url: `/${baseUrl}/me/addresses`,
          method: 'POST',
          credentials: 'include',
          body: address,
        };
      },

      transformResponse: (response: MutationResponse, meta, arg) =>
        response.message,

      transformErrorResponse: (
        response: { status: number; data: MutationResponse },
        meta,
        arg,
      ) => response.data.message,

      invalidatesTags: ['Address'],
    }),

    updateAddress: build.mutation<string, UpdateBody>({
      query({ address, guestSession }) {
        const baseUrl = guestSession ? 'guests' : 'customers';

        return {
          url: `/${baseUrl}/me/addresses/${address.id}`,
          method: 'PATCH',
          credentials: 'include',
          body: address,
        };
      },

      transformResponse: (response: MutationResponse, meta, arg) =>
        response.message,

      transformErrorResponse: (
        response: { status: number; data: MutationResponse },
        meta,
        arg,
      ) => response.data.message,

      invalidatesTags: ['Address'],
    }),

    deleteAddress: build.mutation<string, DeleteBody>({
      query({ id, guestSession }) {
        const baseUrl = guestSession ? 'guests' : 'customers';

        return {
          url: `/${baseUrl}/me/addresses/${id}`,
          method: 'DELETE',
          credentials: 'include',
        };
      },

      transformResponse: (response: MutationResponse, meta, arg) =>
        response.message,

      transformErrorResponse: (
        response: { status: number; data: MutationResponse },
        meta,
        arg,
      ) => response.data.message,

      invalidatesTags: ['Address'],
    }),
  }),
});

export const {
  useGetClosestLocationsQuery,
  useLazyGetClosestLocationsQuery,
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
