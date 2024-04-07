'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { TypeOf, object, string } from 'zod';

import { resendCustomerVerification, verifyCustomer } from '@/app/action';
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

const formSchema = object({
  code: string().min(5, { message: 'OTP must be 5 characters' }),
});

type FormSchema = TypeOf<typeof formSchema>;

export default function VerifyForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const defaultState = { isSuccess: false, message: '' };

  const [verifyState, verifyAction] = useFormState(
    verifyCustomer,
    defaultState,
  );

  const [resendState, resendAction] = useFormState(
    resendCustomerVerification,
    defaultState,
  );

  const form = useForm<FormSchema>({
    defaultValues: { code: '' },
    resolver: zodResolver(formSchema),
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitSuccessful },
  } = form;

  useEffect(() => {
    if (isSubmitSuccessful) {
      setIsLoading(true);
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    const subscription = watch((data) => {
      if (data.code?.length === 5) {
        void handleSubmit(verifyAction)();
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, handleSubmit, verifyAction]);

  useEffect(() => {
    if (verifyState.message === '') return;

    setIsLoading(false);

    if (verifyState.isSuccess) {
      toast({ variant: 'success', description: verifyState.message });
      router.push('/');
    } else {
      toast({ variant: 'destructive', description: verifyState.message });
    }
  }, [verifyState, router, setIsLoading, toast]);

  useEffect(() => {
    if (resendState.message === '') return;

    if (resendState.isSuccess) {
      toast({ variant: 'info', description: resendState.message });
    } else {
      toast({ variant: 'destructive', description: resendState.message });
    }
  }, [resendState, toast]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={(event) => void handleSubmit(verifyAction)(event)}
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
            disabled={isLoading}
            className='w-full bg-primary-600 hover:bg-primary'
          >
            {isLoading ? <Loader size='sm' /> : <span>Verify</span>}
          </Button>
        </form>
      </Form>

      <span className='space-x-1'>
        <span className='text-xs'>Didn&apos;t receive the email?</span>

        <Button
          type='submit'
          variant='primaryLink'
          size='none'
          className='text-xs'
          onClick={() => void resendAction()}
        >
          Click to resend
        </Button>
      </span>
    </>
  );
}
