import Link from 'next/link';

import { AuthLayout } from '@/_components/layout';
import { buttonVariants } from '@/_components/ui/button';
import { cn } from '@/_lib/utils';
import RegisterForm from './_components/register-form';

export default function Register() {
  return (
    <AuthLayout>
      <h1 className='md-2 text-xl font-bold'>Create an Account</h1>

      <RegisterForm />

      <span className='flex flex-row gap-1 text-xs'>
        <span>Already have an account?</span>

        <Link
          href='/login'
          className={cn(
            buttonVariants({
              variant: 'primaryLink',
              size: 'none',
              className: 'ml-auto text-xs',
            }),
          )}
        >
          Login
        </Link>
      </span>
    </AuthLayout>
  );
}
