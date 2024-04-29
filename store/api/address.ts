/* eslint-disable @typescript-eslint/no-unused-vars */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Address, AddressData } from '@/types/address';
import { LocationType } from '@/types/location';
import { setGuestSession } from '../slices/address';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

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

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
  }),

  endpoints: (build) => ({
    getClosestLocations: build.query<{ locations: LocationType[] }, string>({
      query(placeId) {
        return {
          url: `/locations/distance/${placeId}`,
        };
      },

      providesTags: (result, error, placeId) => [
        { type: 'Location', id: placeId },
      ],
    }),

    getAddresses: build.query<
      { addresses: Address[] },
      { guestSession?: string }
    >({
      query({ guestSession }) {
        return {
          url: guestSession
            ? `/guests/${guestSession}/addresses`
            : '/customers/me/addresses',
          credentials: 'include',
        };
      },

      onQueryStarted({ guestSession }, api) {
        api.dispatch(setGuestSession(guestSession));
      },

      providesTags: ['Address'],
    }),

    createAddress: build.mutation<string, MutationBody>({
      query({ address, guestSession }) {
        return {
          url: guestSession
            ? `/guests/${guestSession}/addresses`
            : '/customers/me/addresses',

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
        return {
          url: guestSession
            ? `/guests/${guestSession}/addresses/${address.id}`
            : `/customers/me/addresses/${address.id}`,

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
        return {
          url: guestSession
            ? `/guests/${guestSession}/addresses/${id}`
            : `/customers/me/addresses/${id}`,

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
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
