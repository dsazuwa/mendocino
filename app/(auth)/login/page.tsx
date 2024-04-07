import Link from 'next/link';

import AuthLayout from '@/components/layout/auth-layout';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import LoginForm from './_components/login-form';

export default function Login() {
  return (
    <AuthLayout>
      <h1 className='md-2 text-xl font-bold'>Welcome Back</h1>

      <LoginForm />

      <span className='flex flex-row gap-1 text-xs'>
        <span>Don&apos;t have an account?</span>

        <Link
          href='/register'
          className={cn(
            buttonVariants({
              variant: 'primaryLink',
              size: 'none',
              className: 'ml-auto text-xs',
            }),
          )}
        >
          Create an account
        </Link>
      </span>
    </AuthLayout>
  );
}
