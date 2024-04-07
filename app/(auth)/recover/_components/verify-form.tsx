'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TypeOf, object, string } from 'zod';

import Loader from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useToast } from '@/components/ui/use-toast';
import { getErrorMessage } from '@/lib/error-utils';
import {
  useRequestPasswordRecoveryMutation,
  useVerifyRecoveryCodeMutation,
} from '@/store/api/auth-api';

const formSchema = object({
  code: string().min(5, { message: 'OTP must be 5 characters' }),
});

type FormSchema = TypeOf<typeof formSchema>;

type Props = {
  email: string;
  handleFlowChange: (code: string) => void;
};

export default function VerifyForm({ email, handleFlowChange }: Props) {
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    defaultValues: { code: '' },
    resolver: zodResolver(formSchema),
  });

  const { control, handleSubmit, watch, getValues, reset } = form;

  const [
    verifyCode,
    {
      isLoading: isVerifyLoading,
      isSuccess: isVerifySuccess,
      isError: isVerifyError,
      error: verifyError,
    },
  ] = useVerifyRecoveryCodeMutation();

  const [
    requestRecovery,
    {
      isLoading: isRequestLoading,
      isSuccess: isRequestSuccess,
      isError: isRequestError,
      error: requestError,
    },
  ] = useRequestPasswordRecoveryMutation();

  const handleFormSubmit = useCallback<SubmitHandler<FormSchema>>(
    ({ code }) => verifyCode({ code, email }),
    [email, verifyCode],
  );

  const handleResend = () => {
    void requestRecovery({ email });
    reset();
  };

  useEffect(() => {
    const subscription = watch((data) => {
      if (data.code?.length === 5) {
        void handleSubmit(handleFormSubmit)();
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, handleSubmit, handleFormSubmit]);

  useEffect(() => {
    if (isRequestError)
      toast({
        variant: 'destructive',
        description: getErrorMessage(requestError),
      });

    if (isRequestSuccess)
      toast({
        variant: 'info',
        description: 'A recovery code has been sent to your email',
      });
  }, [isRequestSuccess, isRequestError, requestError, toast]);

  useEffect(() => {
    if (isVerifyError)
      toast({
        variant: 'destructive',
        description: getErrorMessage(verifyError),
      });

    if (isVerifySuccess) {
      handleFlowChange(getValues('code'));
      toast({ variant: 'success', description: 'Email verified!' });
    }
  }, [
    isVerifySuccess,
    isVerifyError,
    verifyError,
    toast,
    getValues,
    handleFlowChange,
  ]);

  return (
    <>
      <h1 className='md-2 text-xl font-bold'>Verify Email</h1>

      <span className='text-center text-sm'>
        Please enter the code sent to your email
      </span>

      <Form {...form}>
        <form
          onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}
          className='flex w-full flex-col items-center gap-4'
        >
          <FormField
            control={control}
            name='code'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP maxLength={5} {...field}>
                    <InputOTPGroup className='gap-2'>
                      <InputOTPSlot index={0} className='rounded-md border-l' />
                      <InputOTPSlot index={1} className='rounded-md border-l' />
                      <InputOTPSlot index={2} className='rounded-md border-l' />
                      <InputOTPSlot index={3} className='rounded-md border-l' />
                      <InputOTPSlot index={4} className='rounded-md border-l' />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>

                <FormMessage className='text-center' />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className='w-full bg-primary-600 hover:bg-primary'
          >
            {isVerifyLoading || isRequestLoading ? (
              <Loader size='sm' />
            ) : (
              <span>Verify</span>
            )}
          </Button>
        </form>

        <span className='space-x-1'>
          <span className='text-xs'>Didn&apos;t receive the email?</span>
          <Button
            variant='primaryLink'
            size='none'
            className='text-xs'
            onClick={handleResend}
          >
            Click to resend
          </Button>
        </span>
      </Form>
    </>
  );
}
