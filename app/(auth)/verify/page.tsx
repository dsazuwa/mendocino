import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { AuthLayout } from '@/_components/layout';
import { fetchWithReauth } from '@/_lib/auth.utils';
import VerifyForm from './_components/verify-form';

export default async function Verify() {
  const res = await fetchWithReauth(
    `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
    {
      method: 'GET',
      headers: { cookie: cookies().toString() },
    },
  );

  if (res.status === 401) redirect('/');

  const body = (await res.json()) as { user: { status: string } };
  if (body.user.status !== 'pending') redirect('/');

  return (
    <AuthLayout>
      <h1 className='md-2 text-xl font-bold'>Verify Email</h1>

      <span className='text-center text-sm'>
        Please enter the code sent to your email
      </span>

      <VerifyForm />
    </AuthLayout>
  );
}
