import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import {
  RecoverData,
  RecoverResponse,
  RequestRecoverData,
  VerifyRecoverData,
} from '@/lib/types/auth';
import { GenericResponse } from '@/lib/types/common';
import { setUser } from '../slices/user-slice';

export const authApi = createApi({
  reducerPath: 'authApi',

  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/auth/`,
    credentials: 'include',
  }),

  endpoints: (builder) => ({
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
  useRequestPasswordRecoveryMutation,
  useVerifyRecoveryCodeMutation,
  useRecoverPasswordMutation,
} = authApi;
