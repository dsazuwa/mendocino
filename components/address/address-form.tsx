/* eslint-disable  @typescript-eslint/no-explicit-any */

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { TypeOf, literal, number, object, string, union } from 'zod';

import { createAddress, updateAddress } from '@/app/actions/address';
import { Address, AddressData } from '@/types/address';
import ContentFooter from '../content-footer';
import Loader from '../loader';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';
import AutocompleteMap from './autocomplete-map';

const formSchema = object({
  address: object({
    placeId: string().trim().nonempty(),
    name: string().trim().nonempty(),
    address: string().trim().nonempty(),
    suite: string().trim().optional(),

    streetNumber: string().trim().optional(),
    street: string().trim().optional(),
    city: string().trim().optional(),
    state: string().trim().optional(),

    zipCode: string()
      .trim()
      .optional()
      .refine((value) => (value === undefined ? true : /^\d{5}$/.test(value)), {
        message: 'Invalid zip code, must be a 5-digit number.',
      }),

    lat: number(),
    lng: number(),
  }),

  suite: string().optional(),

  dropOffOption: union([
    literal('Hand it to me'),
    literal('Leave it at my door'),
  ]),

  dropOffInstruction: string().optional(),
});

type FormSchema = TypeOf<typeof formSchema>;

type Props = { defaultAddress?: Address; handleClose: () => void };

export default function AddressForm({ defaultAddress, handleClose }: Props) {
  const { toast } = useToast();

  const [address, setAddress] = useState<AddressData | undefined>(
    defaultAddress,
  );

  const [isLoading, setIsLoading] = useState(false);

  const [state, formAction] = useFormState(
    defaultAddress ? updateAddress : createAddress,
    { isSuccess: false, message: '' },
  );

  const form = useForm<FormSchema>({
    defaultValues: {
      address: defaultAddress,
      dropOffOption: 'Leave it at my door',
    },
    resolver: zodResolver(formSchema),
  });

  const { control, handleSubmit, setValue } = form;

  const handleSelect = (address: AddressData) => {
    setAddress(address);
    setValue('address', address);
  };

  useEffect(() => {
    if (state.message === '') return;

    setIsLoading(false);

    if (state.isSuccess) {
      handleClose();
    } else {
      toast({ variant: 'destructive', description: state.message });
    }
  }, [state, handleClose, toast]);

  const handleFormSubmit = (data: FormSchema) => {
    setIsLoading(true);

    void formAction({
      ...data.address,
      id: defaultAddress ? defaultAddress.id : -1,
    });
  };

  return (
    <Form {...form}>
      <form
        className='flex flex-1 flex-col'
        onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}
      >
        <div className='flex flex-col space-y-4 p-4 sm:p-6'>
          <AutocompleteMap selected={address} onSelect={handleSelect} />

          <div className='flex-1 space-y-4'>
            {defaultAddress && (
              <div className='flex flex-col items-start gap-1'>
                <span className='text-sm font-semibold'>
                  {defaultAddress.name}
                </span>

                <span className='text-xs'>
                  {[defaultAddress.address, defaultAddress.zipCode].join(', ')}
                </span>
              </div>
            )}

            <FormField
              control={control}
              name='suite'
              render={({ field }) => (
                <FormItem className='inline-flex w-full items-center gap-2'>
                  <FormLabel className='text-xs font-semibold'>
                    Apt/Suite
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      className='h-[46px] text-xxs'
                      placeholder='Apt 401 or Suite 1203'
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='dropOffOption'
              render={({ field }) => (
                <FormItem className='space-y-2'>
                  <FormLabel className='text-xs font-semibold'>
                    Drop-off Options
                  </FormLabel>

                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className='gap-0'
                    >
                      <FormItem className='flex items-center gap-4'>
                        <FormControl>
                          <RadioGroupItem value='Hand it to me' />
                        </FormControl>

                        <FormLabel underline>Hand it to me</FormLabel>
                      </FormItem>

                      <FormItem className='flex items-center gap-4'>
                        <FormControl>
                          <RadioGroupItem value='Leave it at my door' />
                        </FormControl>

                        <FormLabel underline>Leave it at my door</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='dropOffInstruction'
              render={({ field }) => (
                <FormItem className='space-y-4'>
                  <FormLabel className='text-xs font-semibold'>
                    Drop-off Instructions
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      {...field}
                      className='min-h-20 text-xs'
                      maxLength={225}
                      placeholder='eg. ring the bell after dropoff, leave next to the porch, call upon arrival, etc.'
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <ContentFooter>
          <Button
            type='submit'
            variant='primary'
            className='w-full'
            disabled={
              isLoading ||
              !address ||
              address.placeId === defaultAddress?.placeId
            }
          >
            {isLoading ? <Loader size='sm' /> : 'Save'}
          </Button>
        </ContentFooter>
      </form>
    </Form>
  );
}
