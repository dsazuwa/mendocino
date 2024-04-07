import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';

import { logout } from '../slices/user-slice';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL });

/**
 *
 * On 401 Unauthorized error, an additional request is sent to
 * attempt to refresh an authorization token.
 * Then the initial query is attempted again after re-authorizing
 */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await baseQuery(
          { url: 'auth/refresh', method: 'POST', credentials: 'include' },
          api,
          extraOptions,
        );

        if (refreshResult.error) api.dispatch(logout());
        else result = await baseQuery(args, api, extraOptions); // retry initial query
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export default baseQueryWithReauth;
