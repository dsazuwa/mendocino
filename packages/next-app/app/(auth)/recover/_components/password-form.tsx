'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { TypeOf, object, string } from 'zod';

import { recoverPassword } from '@/app/actions/auth';
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

const formSchema = object({
  email: string().email({ message: 'Invalid email address' }),

  code: string().min(5, { message: 'OTP must be 5 characters' }),

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
  const [isLoading, setIsLoading] = useState(false);

  const [state, formAction] = useFormState(recoverPassword, {
    isSuccess: true,
    message: '',
  });

  const form = useForm<FormSchema>({
    defaultValues: { email, code, password: '', confirm: '' },
    resolver: zodResolver(formSchema),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = form;

  useEffect(() => {
    if (isSubmitSuccessful) setIsLoading(true);
  }, [isSubmitSuccessful]);

  useEffect(() => {
    setIsLoading(false);

    if (state.message === '') return;

    if (state.isSuccess) {
      toast({ variant: 'success', description: state.message });

      router.push('/');
      router.refresh();
    } else {
      reset();
      toast({ variant: 'destructive', description: state.message });
    }
  }, [state, router, setIsLoading, toast, reset]);

  return (
    <>
      <h1 className='md-2 text-xl font-bold'>Set New Password</h1>

      <span className='text-center text-sm'>
        Your new password should be different from previously used passwords.
      </span>

      <Form {...form}>
        <form
          onSubmit={(event) => void handleSubmit(formAction)(event)}
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
            disabled={isLoading}
            className='w-full bg-primary-600 hover:bg-primary'
          >
            {isLoading ? <Loader size='sm' /> : <span>Reset Password</span>}
          </Button>
        </form>
      </Form>
    </>
  );
}
