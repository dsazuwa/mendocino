import { createApi } from '@reduxjs/toolkit/query/react';

import { CustomerProfile, VerifyData, VerifyResponse } from '@/_types';
import { setUser } from '../slices/user-slice';
import baseQueryWithReauth from './base-query';

const baseUrl = '/customers';

export const customerApi = createApi({
  reducerPath: 'customerApi',
  refetchOnFocus: true,
  tagTypes: ['Customer'],
  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    getCustomerProfile: builder.query<CustomerProfile, undefined>({
      query() {
        return {
          url: `${baseUrl}/me/profile`,
          method: 'GET',
          credentials: 'include',
        };
      },
    }),

    verifyUser: builder.mutation<VerifyResponse, VerifyData>({
      query(data) {
        return {
          url: `${baseUrl}/me/verify/${data.code}`,
          method: 'PATCH',
          credentials: 'include',
        };
      },

      async onQueryStarted(arg, api) {
        try {
          const { data } = await api.queryFulfilled;
          api.dispatch(setUser(data.user));
        } catch (e) {
          console.log(e);
        }
      },
    }),

    resendVerification: builder.mutation<void, void>({
      query() {
        return {
          url: `${baseUrl}/me/verify`,
          method: 'POST',
          credentials: 'include',
        };
      },
    }),
  }),
});

export const {
  useGetCustomerProfileQuery,
  useVerifyUserMutation,
  useResendVerificationMutation,
} = customerApi;
