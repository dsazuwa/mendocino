import { createApi } from '@reduxjs/toolkit/query/react';

import { User } from '@/_types/common-types';
import { setUser } from '../slices/user-slice';
import baseQueryWithReauth from './base-query';

const baseUrl = '/users';

export const userApi = createApi({
  reducerPath: 'userApi',
  refetchOnFocus: true,
  tagTypes: ['User'],
  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    getUser: builder.query<User, undefined>({
      query() {
        return {
          url: `${baseUrl}/me`,
          credentials: 'include',
        };
      },
      transformResponse: (result: { user: User }) => result.user,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setUser(data));
      },
    }),
  }),
});

export const { useGetUserQuery } = userApi;
