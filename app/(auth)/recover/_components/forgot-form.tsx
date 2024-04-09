'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { TypeOf, object, string } from 'zod';

import { requestRecovery } from '@/app/action';
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
});

type FormSchema = TypeOf<typeof formSchema>;

type Props = {
  handleFlowChange: (email: string) => void;
};

export default function ForgotPasswordForm({ handleFlowChange }: Props) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [state, formAction] = useFormState(requestRecovery, {
    isSuccess: false,
    message: '',
  });

  const form = useForm<FormSchema>({
    defaultValues: { email: '' },
    resolver: zodResolver(formSchema),
  });

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isSubmitSuccessful },
  } = form;

  useEffect(() => {
    if (state.message === '') return;

    if (state.isSuccess) {
      handleFlowChange(getValues('email'));
    } else {
      toast({ variant: 'destructive', description: state.message });
    }
  }, [state, toast, handleFlowChange, getValues]);

  useEffect(() => {
    if (isSubmitSuccessful) setIsLoading(true);
  }, [isSubmitSuccessful]);

  return (
    <>
      <h1 className='md-2 text-xl font-bold'>Forgot Password?</h1>

      <div className='text-center text-sm'>
        <p>Enter the email address associated with your account.</p>
        <p>We will email you a verification code.</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={(event) => void handleSubmit(formAction)(event)}
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
