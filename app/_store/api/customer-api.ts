import { createApi } from '@reduxjs/toolkit/query/react';

import { CustomerProfile } from '@/_types/customer-types';
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
  }),
});

export const { useGetCustomerProfileQuery } = customerApi;
