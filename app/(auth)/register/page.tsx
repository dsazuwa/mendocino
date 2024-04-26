import Link from '@/components/link';
import RegisterForm from './_components/register-form';

export default function Register() {
  return (
    <>
      <h1 className='md-2 text-xl font-bold'>Create an Account</h1>

      <RegisterForm />

      <span className='inline-flex gap-1 text-xs'>
        <span>Already have an account?</span>

        <Link href='/login'>Login</Link>
      </span>
    </>
  );
}
