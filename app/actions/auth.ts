'use server';

/* eslint-disable  @typescript-eslint/no-explicit-any */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { setAuthCookies } from '@/lib/auth.utils';
import {
  LoginInput,
  LoginResponse,
  RecoverData,
  RecoverResponse,
  RegisterInput,
  RegisterResponse,
  RequestRecoverData,
  VerifyRecoverData,
} from '@/types/auth';
import { GenericResponse } from '@/types/common';

export async function createGuestSession() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/guests`, {
    method: 'POST',
  });

  const { sessionId } = (await response.json()) as { sessionId: string };

  return {
    name: 'guest-session',
    value: sessionId,
    secure: true,
    httpOnly: true,
  };
}

export async function logout() {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    method: 'POST',
    headers: { cookie: cookies().toString() },
  });

  cookies().delete('access-token');
  cookies().delete('refresh-token');

  const session = await createGuestSession();
  cookies().set(session);
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
  } else {
    const { message } = (await res.json()) as GenericResponse;
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
    const { message } = (await res.json()) as GenericResponse;
    return { isSuccess: false, message };
  }
}

export async function requestRecovery(
  prevState: any,
  data: RequestRecoverData,
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/recover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const { message } = (await res.json()) as GenericResponse;

  return { isSuccess: res.status === 200, message };
}

export async function verifyRecoveryCode(
  prevState: any,
  { code, ...data }: VerifyRecoverData,
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/recover/${code}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
  );

  const { message } = (await res.json()) as GenericResponse;

  return { isSuccess: res.status === 200, message };
}

export async function recoverPassword(
  prevState: any,
  { code, ...data }: RecoverData,
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/recover/${code}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
  );

  if (res.status === 200) {
    const { refreshToken, accessToken, message } =
      (await res.json()) as RecoverResponse;

    setAuthCookies(accessToken, refreshToken);

    return { isSuccess: true, message };
  } else {
    const { message } = (await res.json()) as GenericResponse;
    return { isSuccess: false, message };
  }
}
