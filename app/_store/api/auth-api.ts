import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import {
  LoginInput,
  LoginResponse,
  RecoverData,
  RecoverResponse,
  RegisterInput,
  RegisterResponse,
  RequestRecoverData,
  VerifyRecoverData,
} from '@/_types/auth-types';
import { GenericResponse } from '@/_types/common-types';
import { logout, setUser } from '../slices/user-slice';

export const authApi = createApi({
  reducerPath: 'authApi',

  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/auth/`,
    credentials: 'include',
  }),

  endpoints: (builder) => ({
    loginUser: builder.mutation<LoginResponse, LoginInput>({
      query(data) {
        return {
          url: 'login',
          method: 'POST',
          body: data,
        };
      },

      async onQueryStarted(arg, api) {
        const { data } = await api.queryFulfilled;
        api.dispatch(setUser(data.user));
      },
    }),

    logoutUser: builder.mutation<void, void>({
      query() {
        return {
          url: 'logout',
          method: 'POST',
        };
      },

      async onQueryStarted(args, api) {
        await api.queryFulfilled;
        api.dispatch(logout());
      },
    }),

    registerUser: builder.mutation<RegisterResponse, RegisterInput>({
      query(data) {
        return {
          url: 'register',
          method: 'POST',
          body: data,
        };
      },

      async onQueryStarted(arg, api) {
        const { data } = await api.queryFulfilled;
        api.dispatch(setUser(data.user));
      },
    }),

    requestPasswordRecovery: builder.mutation<
      GenericResponse,
      RequestRecoverData
    >({
      query(data) {
        return {
          url: 'recover',
          method: 'POST',
          body: data,
        };
      },
    }),

    verifyRecoveryCode: builder.mutation<GenericResponse, VerifyRecoverData>({
      query(data) {
        return {
          url: `recover/${data.code}`,
          method: 'POST',
          body: { email: data.email },
        };
      },
    }),

    recoverPassword: builder.mutation<RecoverResponse, RecoverData>({
      query(data) {
        return {
          url: `recover/${data.code}`,
          method: 'PATCH',
          body: { email: data.email, password: data.password },
        };
      },

      async onQueryStarted(arg, api) {
        const { data } = await api.queryFulfilled;
        api.dispatch(setUser(data.user));
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useLogoutUserMutation,
  useRegisterUserMutation,
  useRequestPasswordRecoveryMutation,
  useVerifyRecoveryCodeMutation,
  useRecoverPasswordMutation,
} = authApi;
