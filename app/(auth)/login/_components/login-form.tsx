'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TypeOf, object, string } from 'zod';

import Loader from '@/_components/loader';
import { Button, buttonVariants } from '@/_components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { useToast } from '@/_components/ui/use-toast';
import { getErrorMessage } from '@/_lib/error-utils';
import { cn } from '@/_lib/utils';
import { useLoginUserMutation } from '@/_store';

const formSchema = object({
  email: string().email({ message: 'Invalid email address' }),
  password: string().trim().min(1, 'Password required'),
});

type FormSchema = TypeOf<typeof formSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loginUser, { data, isLoading, isSuccess, isError, error }] =
    useLoginUserMutation();

  const form = useForm<FormSchema>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(formSchema),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = form;

  const onSubmitHandler: SubmitHandler<FormSchema> = (formData) =>
    loginUser(formData);

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    if (isSuccess)
      router.push(data?.user.roles[0] === 'customer' ? '/' : '/admin');

    if (isError)
      toast({ variant: 'destructive', description: getErrorMessage(error) });
  }, [data, isLoading, isSuccess, isError, error, router]);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
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

        <Link
          href='/recover'
          className={cn(
            buttonVariants({
              variant: 'primaryLink',
              size: 'none',
              className: 'ml-auto text-xs',
            }),
          )}
        >
          Forgot Password?
        </Link>

        <Button
          type='submit'
          className='w-full bg-primary-600 hover:bg-primary'
        >
          {isLoading ? <Loader size='sm' /> : <span>Sign In</span>}
        </Button>
      </form>
    </Form>
  );
}
