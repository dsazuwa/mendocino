'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { TypeOf, object, string } from 'zod';

import { changePassword } from '@/app/action';
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
  currentPassword: string().trim().min(1, 'Current password required'),

  newPassword: string()
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

  confirmPassword: string().trim(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormSchema = TypeOf<typeof formSchema>;

export default function ChangePasswordForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [state, formAction] = useFormState(changePassword, {
    isSuccess: false,
    message: '',
  });

  const form = useForm<FormSchema>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    resolver: zodResolver(formSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = form;

  useEffect(() => {
    if (isSubmitSuccessful) setIsLoading(true);
  }, [isSubmitSuccessful]);

  useEffect(() => {
    if (state.message === '') return;

    setIsLoading(false);

    if (state.isSuccess) {
      toast({ variant: 'success', description: state.message });
      router.push('/account/profile');
    } else {
      toast({ variant: 'destructive', description: state.message });
    }
  }, [state, toast, router]);

  return (
    <Form {...form}>
      <form
        className='mx-auto mt-2 w-full max-w-sm space-y-4 rounded-md bg-white px-4 py-8'
        onSubmit={(event) => void handleSubmit(formAction)(event)}
      >
        <div className='w-full space-y-4'>
          <FormField
            control={control}
            name='currentPassword'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel className='text-xs'>Old Password</FormLabel>

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
            name='newPassword'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel className='text-xs'>New Password</FormLabel>

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
            name='confirmPassword'
            render={({ field }) => (
              <FormItem className='space-y-1'>
                <FormLabel className='text-xs'>Confirm New Password</FormLabel>

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

        <div className='space-y-2 text-xs leading-5 text-neutral-500'>
          <p>We recommend choosing a password that:</p>

          <ul className='ml-4 list-outside list-disc'>
            <li>Is not being used by you already for another account/login</li>
            <li>Is between 8-64 characters in length</li>
            <li>Uses uppercase and lowercase letters</li>
            <li>
              Uses at least one number (0-9) and special characters (!@#$%^&...)
            </li>
          </ul>
        </div>

        <Button
          type='submit'
          disabled={isLoading}
          className='w-full bg-primary-600 px-6 hover:bg-primary'
        >
          {isLoading ? <Loader size='sm' /> : <span>Change My Password</span>}
        </Button>
      </form>
    </Form>
  );
}
