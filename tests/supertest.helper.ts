import { agent as _request } from 'supertest';

import createApp from '@App/app';

export const request = _request(createApp());

export const getTokenFrom = (cookies: string[]) => {
  if (!cookies) return '';

  const cookie = cookies.find((c) => c.includes('access-token'));

  if (!cookie) return '';

  return cookie.split(';')[0].split('=')[1];
};
