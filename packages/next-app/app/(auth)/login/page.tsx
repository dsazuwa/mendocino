import Link from '@/components/link';
import LoginForm from './_components/login-form';

export default function Login() {
  return (
    <>
      <h1 className='md-2 text-xl font-bold'>Welcome Back</h1>

      <LoginForm />

      <span className='inline-flex gap-1 text-xs'>
        <span>Don&apos;t have an account?</span>

        <Link href='/register' className='ml-auto'>
          Create an account
        </Link>
      </span>
    </>
  );
}
