/* eslint-disable @typescript-eslint/no-unused-vars */

import { createApi } from '@reduxjs/toolkit/query/react';

import { User } from '@/types/common';
import baseQueryWithReauth from '../base.query';

type UserResponse = { user: User };

export const userApi = createApi({
  reducerPath: 'userApi',
  tagTypes: ['User'],

  baseQuery: baseQueryWithReauth,

  endpoints: (build) => ({
    getUser: build.query<User, void>({
      query() {
        return {
          url: '/users/me',
          credentials: 'include',
        };
      },

      providesTags: ['User'],

      transformResponse: (response: UserResponse, meta, arg) => response.user,
    }),
  }),
});

export const { useGetUserQuery } = userApi;
