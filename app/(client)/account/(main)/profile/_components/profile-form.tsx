'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { TypeOf, boolean, object, string } from 'zod';

import { Checkbox } from '@/components/ui/checkbox';
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
import { ProfileInput, Profile as TProfile } from '@/lib/types/customer';
import NumericalTextfield from './numerical-field';

const formSchema = object({
  firstName: string().trim().min(1, 'First name required'),

  lastName: string().trim().min(1, 'Last name required'),

  email: string().email({ message: 'Invalid email address' }),

  phoneNumber: string()
    .optional()
    .refine((val) => !val || /^\d{10}$/.test(val), {
      message: 'Invalid phone number',
    }),

  receiveStatusByText: boolean(),
}).refine(
  ({ phoneNumber, receiveStatusByText }) =>
    !receiveStatusByText || (phoneNumber && phoneNumber.length > 0),
  {
    message: 'Phone number must be provided to receive status by text',
    path: ['phoneNumber'],
  },
);

export type ProfileFormSchema = TypeOf<typeof formSchema>;

type Props = { profile: TProfile };

export default function ProfileForm({ profile }: Props) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [state, formAction] = useFormState(updateProfile, {
    isSuccess: false,
    message: '',
  });

  const { firstName, lastName, email, phone } = profile;

  const defaultValues = {
    firstName,
    lastName,
    email: email.address,
    phoneNumber: phone?.number || '',
    receiveStatusByText: false,
  };

  const form = useForm<ProfileFormSchema>({
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

    if (!state.isSuccess) {
      toast({ variant: 'destructive', description: state.message });
    }
  }, [state, toast]);

  const handleFormSubmit = (data: ProfileFormSchema) => {
    const vals: ProfileInput = Object.fromEntries(
      Object.entries(data).filter(
        ([field, value]) =>
          defaultValues[field as keyof ProfileInput] !== value,
      ),
    );

    formAction(vals);
  };

  return (
    <Form {...form}>
      <form onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}>
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

                <FormMessage className='text-xs' />
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

                <FormMessage className='text-xs' />
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
                  <Input {...field} disabled className='w-full text-xs' />
                </FormControl>

                <FormMessage className='text-xs' />
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
                  <NumericalTextfield field={field} />
                </FormControl>

                <FormMessage className='text-xs' />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='receiveStatusByText'
            render={({ field }) => (
              <FormItem className='col-span-2 space-y-1 pb-4'>
                <div className='flex items-center gap-3'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <FormLabel className='text-xs'>
                    Receive order status updates via text
                  </FormLabel>
                </div>

                <FormMessage className='ml-7 text-xs' />
              </FormItem>
            )}
          />
        </div>

        <div className='flex justify-end md:mt-0'>
          <Button
            type='submit'
            disabled={
              isLoading ||
              JSON.stringify(defaultValues) === JSON.stringify(form.getValues())
            }
            className='bg-primary-600 px-6 hover:bg-primary'
          >
            {isLoading ? <Loader size='sm' /> : <span>Save</span>}
          </Button>
        </div>
      </form>
    </Form>
  );
}
