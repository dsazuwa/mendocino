/* eslint-disable @typescript-eslint/no-unused-vars */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import {
  LoginInput,
  LoginResponse,
  RegisterInput,
  RegisterResponse,
} from '@/types/auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const authApi = createApi({
  reducerPath: 'authApi',

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/auth`,
    credentials: 'include',
  }),

  endpoints: (build) => ({
    register: build.mutation<RegisterResponse, RegisterInput>({
      query(data) {
        return {
          url: '/register',
          method: 'POST',
          body: data,
        };
      },

      transformErrorResponse: (
        response: { status: number; data: RegisterResponse },
        meta,
        arg,
      ) => response.data.message,
    }),

    login: build.mutation<LoginResponse, LoginInput>({
      query(data) {
        return {
          url: '/login',
          method: 'POST',
          body: data,
        };
      },

      transformErrorResponse: (
        response: { status: number; data: LoginResponse },
        meta,
        arg,
      ) => response.data.message,
    }),

    logout: build.mutation<{ guestSession: string }, void>({
      query() {
        return {
          url: '/logout',
          method: 'POST',
        };
      },
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } =
  authApi;
