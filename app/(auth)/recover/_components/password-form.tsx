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
import { useRecoverPasswordMutation } from '@/_store';

const formSchema = object({
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

type Props = {
  email: string;
  code: string;
};

export default function ChangePasswordForm({ email, code }: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const [recoverPassword, { isLoading, isSuccess, isError, error }] =
    useRecoverPasswordMutation();

  const form = useForm<FormSchema>({
    defaultValues: { password: '', confirm: '' },
    resolver: zodResolver(formSchema),
  });

  const { control, handleSubmit } = form;

  const handleFormSubmit: SubmitHandler<FormSchema> = ({ password }) =>
    recoverPassword({ code, email, password });

  useEffect(() => {
    if (isError)
      toast({ variant: 'destructive', description: getErrorMessage(error) });
  }, [isError, error, toast]);

  useEffect(() => {
    if (isSuccess) {
      toast({
        variant: 'success',
        description: 'Password successfully changed!',
      });
      router.push('/');
    }
  }, [isSuccess, router, toast]);

  return (
    <>
      <h1 className='md-2 text-xl font-bold'>Set New Password</h1>

      <span className='text-center text-sm'>
        Your new password should be different from previously used passwords.
      </span>

      <Form {...form}>
        <form
          onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}
          className='flex w-full flex-col gap-4'
        >
          <FormField
            control={control}
            name='password'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel className='text-xs'>Password</FormLabel>

                <FormControl>
                  <Input {...field} className='text-xs' type='password' />
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
                  <Input {...field} className='text-xs' type='password' />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className='w-full bg-primary-600 hover:bg-primary'
          >
            {isLoading ? <Loader size='sm' /> : <span>Reset Password</span>}
          </Button>
        </form>
      </Form>
    </>
  );
}
