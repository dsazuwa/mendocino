'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TypeOf, object, string } from 'zod';

import Loader from '@/_components/loader';
import { Button } from '@/_components/ui/button';
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
import { useRegisterUserMutation } from '@/_store/api/auth-api';

const formSchema = object({
  firstName: string().trim().min(1, 'First name required'),
  lastName: string().trim().min(1, 'Last name required'),
  email: string().email({ message: 'Invalid email address' }),
  password: string()
    .trim()
    .min(8, { message: 'Password must be 8 or more characters long' })
    .max(64, { message: 'Password must be 64 or fewer characters long' })
    .regex(/\d/, { message: 'Password must contain at least 1 digit' })
    .regex(/[a-z]/, {
      message: 'Password must contain at least 1 lowercase character',
    })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least 1 uppercase letter',
    }),
  confirm: string().trim(),
}).refine((data) => data.password === data.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
});

type FormSchema = TypeOf<typeof formSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();

  const [registerUser, { isLoading, isSuccess, isError, error }] =
    useRegisterUserMutation();

  const form = useForm<FormSchema>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirm: '',
    },
    resolver: zodResolver(formSchema),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = form;

  const handleFormSubmit: SubmitHandler<FormSchema> = (formData) =>
    registerUser(formData);

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    if (isSuccess) {
      toast({ variant: 'success', description: 'Registration Successful!' });

      router.push('/verify');
    }

    if (isError)
      toast({ variant: 'destructive', description: getErrorMessage(error) });
  }, [isLoading, isSuccess, isError, error, router, toast]);

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}
        className='flex w-full flex-col gap-4'
      >
        <div className='flex w-full flex-col gap-2'>
          <div className='grid w-full grid-cols-1 gap-2 sm:grid-cols-2'>
            <FormField
              control={control}
              name='firstName'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel className='text-xs'>First Name</FormLabel>

                  <FormControl>
                    <Input {...field} className='w-full text-xs' />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='lastName'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel className='text-xs'>Last Name</FormLabel>

                  <FormControl>
                    <Input {...field} className='w-full text-xs' />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name='email'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel className='text-xs'>Email Address</FormLabel>

                <FormControl>
                  <Input {...field} className='w-full text-xs' />
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
                  <Input
                    {...field}
                    className='w-full text-xs'
                    type='password'
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='confirm'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel className='text-xs'>Confirm Password</FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    className='w-full text-xs'
                    type='password'
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type='submit'
          className='w-full bg-primary-600 hover:bg-primary'
        >
          {isLoading ? <Loader size='sm' /> : <span>Sign Up</span>}
        </Button>
      </form>
    </Form>
  );
}
