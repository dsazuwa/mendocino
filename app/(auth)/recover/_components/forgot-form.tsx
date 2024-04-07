'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TypeOf, object, string } from 'zod';

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
import { getErrorMessage } from '@/lib/error-utils';
import { useRequestPasswordRecoveryMutation } from '@/store/api/auth-api';

const formSchema = object({
  email: string().email({ message: 'Invalid email address' }),
});

type FormSchema = TypeOf<typeof formSchema>;

type Props = {
  handleFlowChange: (email: string) => void;
};

export default function ForgotPasswordForm({ handleFlowChange }: Props) {
  const { toast } = useToast();
  const [requestRecovery, { isLoading, isSuccess, isError, error }] =
    useRequestPasswordRecoveryMutation();

  const form = useForm<FormSchema>({
    defaultValues: { email: '' },
    resolver: zodResolver(formSchema),
  });

  const { control, handleSubmit, getValues } = form;

  const handleFormSubmit: SubmitHandler<FormSchema> = (formData) =>
    requestRecovery(formData);

  useEffect(() => {
    if (isError)
      toast({ variant: 'destructive', description: getErrorMessage(error) });
  }, [isError, error, toast]);

  useEffect(() => {
    if (isSuccess) {
      handleFlowChange(getValues('email'));
    }
  }, [isSuccess, toast, handleFlowChange, getValues]);

  return (
    <>
      <h1 className='md-2 text-xl font-bold'>Forgot Password?</h1>

      <div className='text-center text-sm'>
        <p>Enter the email address associated with your account.</p>
        <p>We will email you a verification code.</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}
          className='flex w-full flex-col gap-4'
        >
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
