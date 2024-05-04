'use server';

/* eslint-disable  @typescript-eslint/no-explicit-any */

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

import { Address, AddressData } from '@/types/address';

const { NEXT_PUBLIC_API_URL } = process.env;

export async function createAddress(prevState: any, address: AddressData) {
  try {
    const accessToken = cookies().get('access-token')?.value;
    const userType = accessToken ? 'customers' : 'guests';

    const res = await fetch(`${NEXT_PUBLIC_API_URL}/${userType}/me/addresses`, {
      method: 'POST',
      headers: {
        cookie: cookies().toString(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(address),
    });

    const { message } = (await res.json()) as { message: string };

    if (res.status === 200) {
      revalidateTag('address');

      return { isSuccess: true, message };
    }

    return { isSuccess: false, message };
  } catch (e) {
    return { isSuccess: false, message: 'Error creating address' };
  }
}

export async function updateAddress(prevState: any, address: Address) {
  try {
    const accessToken = cookies().get('access-token')?.value;
    const userType = accessToken ? 'customers' : 'guests';

    const res = await fetch(
      `${NEXT_PUBLIC_API_URL}/${userType}/me/addresses/${address.id}`,
      {
        method: 'PATCH',
        headers: {
          cookie: cookies().toString(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
      },
    );

    const { message } = (await res.json()) as { message: string };

    if (res.status === 200) {
      revalidateTag('address');

      return { isSuccess: true, message };
    }

    return { isSuccess: false, message };
  } catch (e) {
    return { isSuccess: false, message: 'Error updating address' };
  }
}

export async function deleteAddress(prevState: any, id: number) {
  try {
    const accessToken = cookies().get('access-token')?.value;
    const userType = accessToken ? 'customers' : 'guests';

    const res = await fetch(
      `${NEXT_PUBLIC_API_URL}/${userType}/me/addresses/${id}`,
      {
        method: 'DELETE',
        headers: { cookie: cookies().toString() },
      },
    );

    const { message } = (await res.json()) as { message: string };

    if (res.status === 200) {
      revalidateTag('address');

      return { isSuccess: true, message };
    }

    return { isSuccess: false, message };
  } catch (e) {
    return { isSuccess: false, message: 'Error deleting address' };
  }
}
