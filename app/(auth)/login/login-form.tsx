'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TypeOf, object, string } from 'zod';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/_components/ui/form';
import { cn } from '@/_lib/utils';
import { Input } from '@/_components/ui/input';

const formSchema = object({
  email: string().email({ message: 'Invalid email address' }),
  password: string().trim().min(1, 'Password required'),
});

type FormSchema = TypeOf<typeof formSchema>;

export default function LoginForm() {
  const form = useForm<FormSchema>({
    defaultValues: {
      email: '',
      password: '',
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
      <div className='w-full space-y-4'>
        <FormField
          control={control}
          name='email'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormLabel className='text-xs'>Email</FormLabel>

              <FormControl>
                <Input {...field} />
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
                <Input {...field} />
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

      <Button type='submit' className='w-full bg-primary-600 hover:bg-primary'>
        Sign In
      </Button>
    </Form>
  );
}
