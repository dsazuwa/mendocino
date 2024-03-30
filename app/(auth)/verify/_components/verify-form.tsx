'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TypeOf, object, string } from 'zod';

import Loader from '@/_components/loader';
import { Button } from '@/_components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/_components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/_components/ui/input-otp';
import { useToast } from '@/_components/ui/use-toast';
import { getErrorMessage } from '@/_lib/error-utils';
import { useResendVerificationMutation, useVerifyUserMutation } from '@/_store';

const formSchema = object({
  code: string().min(5, { message: 'OTP must be 5 characters' }),
});

type FormSchema = TypeOf<typeof formSchema>;

export default function VerifyForm() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormSchema>({
    defaultValues: { code: '' },
    resolver: zodResolver(formSchema),
  });

  const { control, handleSubmit, watch, reset } = form;

  const [
    verifyCode,
    {
      isLoading: isVerifyLoading,
      isSuccess: isVerifySuccess,
      isError: isVerifyError,
      error: verifyError,
    },
  ] = useVerifyUserMutation();

  const [
    requestVerify,
    {
      isLoading: isRequestLoading,
      isSuccess: isRequestSuccess,
      isError: isRequestError,
      error: requestError,
    },
  ] = useResendVerificationMutation();

  const handleFormSubmit = useCallback<SubmitHandler<FormSchema>>(
    ({ code }) => void verifyCode({ code }),
    [verifyCode],
  );

  const handleResend = () => {
    void requestVerify();
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
      toast({ variant: 'success', description: 'Email verified!' });

      router.push('/');
    }
  }, [isVerifySuccess, isVerifyError, verifyError, toast, router]);

  return (
    <>
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
      </Form>

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
    </>
  );
}
