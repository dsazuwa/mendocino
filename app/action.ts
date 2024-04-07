'use server';

/* eslint-disable  @typescript-eslint/no-explicit-any */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { setAuthCookies } from '../lib/auth.utils';
import {
  LoginInput,
  LoginResponse,
  RegisterInput,
  RegisterResponse,
} from '../lib/types/auth';
import { VerifyData } from '../lib/types/customer';

type GeneralResponse = { message: string };

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
    const { user, refreshToken, accessToken } =
      (await res.json()) as LoginResponse;

    setAuthCookies(accessToken, refreshToken);

    redirect(user.roles[0] === 'customer' ? '/' : '/admin');
  }
  // TODO: handle case where user is deactivated if ('user' in body)
  else {
    const { message } = (await res.json()) as GeneralResponse;
    return { message };
  }
}

export async function register(prevState: any, data: RegisterInput) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      cookie: cookies().toString(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (res.status === 200) {
    const { refreshToken, accessToken, message } =
      (await res.json()) as RegisterResponse;

    setAuthCookies(accessToken, refreshToken);

    return { isSuccess: true, message };
  } else {
    const { message } = (await res.json()) as GeneralResponse;
    return { isSuccess: false, message };
  }
}

export async function verifyCustomer(prevState: any, data: VerifyData) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/customers/me/verify/${data.code}`,
    {
      method: 'PATCH',
      headers: { cookie: cookies().toString() },
    },
  );

  const { message } = (await res.json()) as GeneralResponse;

  return { isSuccess: res.status === 200, message };
}

export async function resendCustomerVerification() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/customers/me/verify`,
    {
      method: 'POST',
      headers: { cookie: cookies().toString() },
    },
  );

  const { message } = (await res.json()) as GeneralResponse;

  return { isSuccess: res.status === 200, message };
}
