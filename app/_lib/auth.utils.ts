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
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
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
    await refreshToken();
    return await makeRequest();
  } else return res;
}
