/* global RequestInit */

import { cookies } from 'next/headers';

export type AuthCookies = ReturnType<typeof getAuthCookieObject>;

export const getAuthCookieObject = (
  accessToken: string,
  refreshToken: string,
) => {
  return {
    accessToken: {
      name: 'access-token',
      value: accessToken,
      secure: true,
      httpOnly: true,
      expires: new Date(Date.now() + 5 * 60 * 1000),
    },

    refreshToken: {
      name: 'refresh-token',
      value: refreshToken,
      secure: true,
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  };
};

export const setAuthCookies = (accessToken: string, refreshToken: string) => {
  const authCookies = getAuthCookieObject(accessToken, refreshToken);

  cookies().set(authCookies.accessToken);
  cookies().set(authCookies.refreshToken);
  cookies().delete('guest-session');
};
