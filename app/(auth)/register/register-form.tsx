'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TypeOf, boolean, object, string } from 'zod';

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
  agreeToTerms: boolean(),
})
  .refine((data) => data.password === data.confirm, {
    message: "Passwords didn't match",
    path: ['confirm'],
  })
  .refine((data) => data.agreeToTerms, {
    message: 'You must agree to the Terms & Conditions',
    path: ['agreeToTerms'],
  });

type RegisterFormSchema = TypeOf<typeof formSchema>;

export default function RegisterForm() {
  const form = useForm<RegisterFormSchema>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirm: '',
      agreeToTerms: false,
    },
    resolver: zodResolver(formSchema),
  });

  const {
    control,
    reset,
    formState: { isSubmitSuccessful },
  } = form;

  useEffect(() => {
    if (isSubmitSuccessful) reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <Form {...form}>
      <div className='flex w-full flex-col gap-2'>
        <div className='grid w-full grid-cols-1 gap-2 sm:grid-cols-2'>
          <FormField
            control={control}
            name='firstName'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel className='text-xs'>First Name</FormLabel>

                <FormControl>
                  <Input {...field} className='w-full' />
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
                  <Input {...field} className='w-full' />
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
                <Input {...field} className='w-full' />
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
                <Input {...field} className='w-full' />
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
                <Input {...field} className='w-full' />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Button type='submit' className='w-full bg-primary-600 hover:bg-primary'>
        Sign In
      </Button>
    </Form>
  );
}
