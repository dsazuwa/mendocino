'use server';

/* eslint-disable  @typescript-eslint/no-explicit-any */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { setAuthCookies } from '../lib/auth.utils';
import {
  LoginInput,
  LoginResponse,
  RecoverData,
  RecoverResponse,
  RegisterInput,
  RegisterResponse,
  RequestRecoverData,
  VerifyRecoverData,
} from '../lib/types/auth';
import {
  CustomerPasswordData,
  ProfileData,
  VerifyData,
} from '../lib/types/customer';
import { GenericResponse } from '@/lib/types/common';

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

export async function verifyCustomer(prevState: any, data: VerifyData) {
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

export async function updateProfile(prevState: any, data: ProfileData) {
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

  const { message } = (await res.json()) as GenericResponse;

  return { isSuccess: res.status === 200, message };
}

export async function changePassword(
  prevState: any,
  data: CustomerPasswordData,
) {
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
