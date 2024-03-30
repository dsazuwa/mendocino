import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

import { useGetUserQuery } from '@/_store/api/user-api';
import { useAppSelector } from '@/_store/hook';

export default function useAuthentication() {
  const [authReady, setAuthReady] = useState(false);

  const cachedUser = useAppSelector((state) => state.userState.user);
  const accessToken = getCookie('auth-flag');
  const isSkipped =
    accessToken === undefined || (!!accessToken && cachedUser !== undefined);

  const { data, isLoading, isFetching, isError, isSuccess } = useGetUserQuery(
    undefined,
    { skip: isSkipped },
  );

  const isAuthenticated =
    accessToken !== undefined &&
    (cachedUser !== undefined || data !== undefined);

  const user = isError ? undefined : cachedUser ?? data ?? undefined;

  useEffect(() => {
    if (isSuccess || isSkipped || isError) setAuthReady(true);
  }, [setAuthReady, isSuccess, isSkipped, isError]);

  return {
    authReady,
    isAuthenticated,
    user,
    isSkipped,
    isLoading,
    isFetching,
    isError,
    isSuccess,
  };
}
