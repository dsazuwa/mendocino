'use server';

/* eslint-disable  @typescript-eslint/no-explicit-any */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { setAuthCookies } from './_lib/auth.utils';
import { LoginInput } from './_types/auth-types';
import { User } from './_types/common-types';

export async function logout() {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    method: 'POST',
    headers: { cookie: cookies().toString() },
  });

  cookies().delete('access-token');
  cookies().delete('refresh-token');
}

export async function login(prevState: any, data: LoginInput) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      cookie: cookies().toString(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (res.status === 200) {
    const { user, refreshToken, accessToken } = (await res.json()) as {
      user: User;
      accessToken: string;
      refreshToken: string;
      message: string;
    };

    setAuthCookies(accessToken, refreshToken);

    redirect(user.roles[0] === 'customer' ? '/' : '/admin');
  }
  // TODO: handle case where user is deactivated if ('user' in body)
  else {
    const { message } = (await res.json()) as { message: string };
    return { message };
  }
}
