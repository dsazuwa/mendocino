'use client';

import { useRouter } from 'next/navigation';

import { AuthLayout } from '@/_components/layout';
import Loader from '@/_components/loader';
import useAuthentication from '@/_hooks/useAuthentication';
import VerifyForm from './_components/verify-form';

export default function Verify() {
  const { authReady, isAuthenticated, user } = useAuthentication();
  const router = useRouter();

  if (!authReady) return <Loader className='mt-[15vh]' size='lg' />;

  if (!isAuthenticated || user === undefined || user.status !== 'pending')
    router.push('/');

  return user?.status === 'pending' ? (
    <AuthLayout>
      <h1 className='md-2 text-xl font-bold'>Verify Email</h1>

      <span className='text-center text-sm'>
        Please enter the code sent to your email
      </span>

      <VerifyForm />
    </AuthLayout>
  ) : (
    <></>
  );
}
