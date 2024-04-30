'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TypeOf, object, string } from 'zod';

import Link from '@/components/link';
import Loader from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import useAuthContext from '@/hooks/use-auth-context';
import { useLoginMutation } from '@/store/api/auth';

const formSchema = object({
  email: string().email({ message: 'Invalid email address' }),
  password: string().trim().min(1, 'Password required'),
});

type FormSchema = TypeOf<typeof formSchema>;

export default function LoginForm() {
  const { toast } = useToast();
  const { setGuestSession } = useAuthContext();
  const router = useRouter();

  const [login, { data, isLoading, isSuccess, isError, error }] =
    useLoginMutation();

  const form = useForm<FormSchema>({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(formSchema),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = form;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    if (isSuccess && data) {
      toast({ variant: 'success', description: data?.message });

      setGuestSession(undefined);
      router.push(data.user.roles[0] === 'customer' ? '/' : '/admin');
      router.refresh();
    }
  }, [data, isSuccess, router, setGuestSession, toast]);

  useEffect(() => {
    if (isError)
      toast({ variant: 'destructive', description: error as string });
  }, [isError, error, toast]);

  const handleFormSubmit = (data: FormSchema) => {
    void login(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}
        className='flex w-full flex-col gap-4'
      >
        <div className='flex w-full flex-col gap-2'>
          <FormField
            control={control}
            name='email'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel className='text-xs'>Email</FormLabel>

                <FormControl>
                  <Input {...field} className='text-xs' />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='password'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel className='text-xs'>Password</FormLabel>

                <FormControl>
                  <Input {...field} type='password' className='text-xs' />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Link href='/recover' className='ml-auto'>
          Forgot Password?
        </Link>

        <Button
          type='submit'
          disabled={isLoading}
          className='w-full bg-primary-600 hover:bg-primary'
        >
          {isLoading ? <Loader size='sm' /> : <span>Sign In</span>}
        </Button>
      </form>
    </Form>
  );
}
