'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { TypeOf, object, string } from 'zod';

import { requestRecovery, verifyRecoveryCode } from '@/app/actions/auth';
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
import LinkButton from '@/components/link-button';

const formSchema = object({
  email: string().email({ message: 'Invalid email address' }),
  code: string().min(5, { message: 'OTP must be 5 characters' }),
});

type FormSchema = TypeOf<typeof formSchema>;

type Props = {
  email: string;
  handleFlowChange: (code: string) => void;
};

export default function VerifyForm({ email, handleFlowChange }: Props) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const defaultState = { isSuccess: false, message: '' };

  const [verifyState, verifyAction] = useFormState(
    verifyRecoveryCode,
    defaultState,
  );

  const [resendState, resendAction] = useFormState(
    requestRecovery,
    defaultState,
  );

  const form = useForm<FormSchema>({
    defaultValues: { code: '', email },
    resolver: zodResolver(formSchema),
  });

  const {
    control,
    handleSubmit,
    getValues,
    watch,
    reset,
    formState: { isSubmitSuccessful },
  } = form;

  useEffect(() => {
    if (isSubmitSuccessful) setIsLoading(true);
  }, [isSubmitSuccessful]);

  useEffect(() => {
    const subscription = watch((data) => {
      if (data.code?.length === 5) {
        void handleSubmit(verifyAction)();
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, handleSubmit, verifyAction]);

  useEffect(() => {
    setIsLoading(false);

    if (verifyState.message === '') return;

    if (verifyState.isSuccess) {
      toast({ variant: 'success', description: verifyState.message });
      handleFlowChange(getValues('code'));
    } else {
      reset();
      toast({ variant: 'destructive', description: verifyState.message });
    }
  }, [verifyState, setIsLoading, toast, handleFlowChange, getValues, reset]);

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
      <h1 className='md-2 text-xl font-bold'>Verify Email</h1>

      <span className='text-center text-sm'>
        Please enter the code sent to your email
      </span>

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
                  <InputOTP maxLength={5} {...field} autoFocus>
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

        <span className='space-x-1'>
          <span className='text-xs'>Didn&apos;t receive the email?</span>

          <LinkButton
            type='submit'
            onClick={() => void resendAction({ email })}
          >
            Click to resend
          </LinkButton>
        </span>
      </Form>
    </>
  );
}
