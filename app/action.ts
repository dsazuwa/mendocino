'use server';

/* eslint-disable  @typescript-eslint/no-explicit-any */

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

import {
  RecoverData,
  RecoverResponse,
  RequestRecoverData,
  VerifyRecoverData,
} from '@/types/auth';
import { GenericResponse } from '@/types/common';
import { PasswordInput, ProfileInput, VerifyInput } from '@/types/customer';
import { setAuthCookies } from '../lib/auth.utils';

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

export async function verifyCustomer(prevState: any, data: VerifyInput) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/customers/me/verify/${data.code}`,
    {
      method: 'PATCH',
      headers: { cookie: cookies().toString() },
    },
  );

  const { message } = (await res.json()) as GenericResponse;

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

  const { message } = (await res.json()) as GenericResponse;

  return { isSuccess: res.status === 200, message };
}

export async function updateProfile(prevState: any, data: ProfileInput) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/customers/me/profile`,
    {
      method: 'PATCH',
      headers: {
        cookie: cookies().toString(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  const x = (await res.json()) as GenericResponse;

  const isSuccess = res.status === 200;

  if (isSuccess) revalidateTag('user');

  return { isSuccess, message: x.message };
}

export async function changePassword(prevState: any, data: PasswordInput) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/customers/me/password`,
    {
      method: 'PATCH',
      headers: {
        cookie: cookies().toString(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  const { message } = (await res.json()) as GenericResponse;

  return { isSuccess: res.status === 200, message };
}

export async function closeAccount() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/customers/me/close`,
    {
      method: 'PATCH',
      headers: { cookie: cookies().toString() },
    },
  );

  const { message } = (await res.json()) as GenericResponse;

  return { isSuccess: res.status === 200, message };
}
