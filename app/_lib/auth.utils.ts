/* global RequestInit */

import { cookies } from 'next/headers';

export async function fetchWithReauth(
  input: string | Request | URL,
  init?: RequestInit,
) {
  const makeRequest = async () => {
    try {
      return await fetch(input, init);
    } catch (error) {
      console.error('Error making request: ', error);
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { cookie: cookies().toString() },
      });
    } catch (error) {
      console.error('Error refreshing token: ', error);
      throw error;
    }
  };

  const res = await makeRequest();

  if (res.status === 401) {
    return { res: await makeRequest(), refreshResponse: await refreshToken() };
  } else return { res };
}

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
};
