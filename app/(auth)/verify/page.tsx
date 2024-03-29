import { redirect } from 'next/navigation';

import { AuthLayout } from '@/_components/layout';
import { fetchWithReauth } from '@/_lib/auth.utils';
import VerifyForm from './_components/verify-form';

export default async function Verify() {
  const res = await fetchWithReauth(
    `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
    {
      method: 'GET',
      credentials: 'include',
    },
  );

  if (res.status === 401 || (await res.json()).status !== 'pending')
    redirect('/');

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
