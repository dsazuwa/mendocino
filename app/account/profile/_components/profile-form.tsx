'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { TypeOf, boolean, object, string } from 'zod';

import { Checkbox } from '@/_components/ui/checkbox';
import { updateProfile } from '@/app/action';
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
  firstName: string().trim().min(1, 'First name required'),

  lastName: string().trim().min(1, 'Last name required'),

  email: string().email({ message: 'Invalid email address' }),

  phoneNumber: string().trim().length(10, { message: 'Invalid phone number' }), // should be optional

  receiveStatusByText: boolean(),
}).refine((data) => data.phoneNumber === '' && data.receiveStatusByText, {
  message: 'Phone number not provided',
  path: ['receiveStatusByText'],
});

type FormSchema = TypeOf<typeof formSchema>;

export default function ProfileForm(defaultValues: FormSchema) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [state, formAction] = useFormState(updateProfile, {
    isSuccess: false,
    message: '',
  });

  const form = useForm<FormSchema>({
    defaultValues,
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
      // revalidate profile tag
    } else {
      toast({ variant: 'destructive', description: state.message });
    }
  }, [state, toast]);

  return (
    <Form {...form}>
      <form onSubmit={(event) => void handleSubmit(formAction)(event)}>
        <div className='grid w-full grid-cols-2 gap-4'>
          <FormField
            control={control}
            name='firstName'
            render={({ field }) => (
              <FormItem className='col-span-2 space-y-1 lg:col-span-1'>
                <FormLabel className='text-xs'>First Name</FormLabel>

                <FormControl>
                  <Input {...field} className='w-full text-xs' />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='lastName'
            render={({ field }) => (
              <FormItem className='col-span-2 space-y-1 lg:col-span-1'>
                <FormLabel className='text-xs'>Last Name</FormLabel>

                <FormControl>
                  <Input {...field} className='w-full text-xs' />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='email'
            render={({ field }) => (
              <FormItem className='col-span-2 space-y-1 lg:col-span-1'>
                <FormLabel className='text-xs'>Email Address</FormLabel>

                <FormControl>
                  <Input {...field} className='w-full text-xs' />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='phoneNumber'
            render={({ field }) => (
              <FormItem className='col-span-2 space-y-1 lg:col-span-1'>
                <FormLabel className='text-xs'>Phone Number</FormLabel>

                <FormControl>
                  <Input {...field} className='w-full text-xs' />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='receiveStatusByText'
            render={({ field }) => (
              <FormItem className='col-span-2 flex items-center gap-3 space-y-0 pb-4'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>

                <FormLabel className='text-xs'>
                  Receive order status updates via text
                </FormLabel>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex justify-end md:mt-0'>
          <Button
            type='submit'
            disabled={isLoading}
            className='bg-primary-600 px-6 hover:bg-primary'
          >
            {isLoading ? <Loader size='sm' /> : <span>Save</span>}
          </Button>
        </div>
      </form>
    </Form>
  );
}
