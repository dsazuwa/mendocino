import { redirect } from 'next/navigation';

import getUser from '@/lib/data';
import VerifyForm from './_components/verify-form';

export default async function Verify() {
  const { user } = await getUser();

  if (!user || user.status !== 'pending') redirect('/');

  return (
    <>
      <h1 className='md-2 text-xl font-bold'>Verify Email</h1>

      <span className='text-center text-sm'>
        Please enter the code sent to your email
      </span>

      <VerifyForm />
    </>
  );
}
