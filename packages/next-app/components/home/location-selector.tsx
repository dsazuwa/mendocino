'use client';

import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { DialogContent } from '@/components/ui/dialog';
import { useMediaQuery } from '@/hooks/use-media-query';
import useSelectAddress from '@/hooks/use-select-address';
import { cn } from '@/lib/utils';
import { useGetClosestLocationsQuery } from '@/redux/api/address';
import { Address } from '@/types/address';
import ChooseToggler from '../address/choose-toggler';
import Location from '../icons/location';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Skeleton } from '../ui/skeleton';
import Locations from './locations';

type Props = { addresses: Address[]; selectedAddress: Address };

export default function LocationSelector({
  addresses,
  selectedAddress,
}: Props) {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const { selectedId, selectAddress } = useSelectAddress(
    selectedAddress,
    handleClose,
  );

  const address =
    addresses.find((address) => address.id === selectedId) || addresses[0];

  const { data, isLoading, isFetching } = useGetClosestLocationsQuery(
    address.placeId,
  );

  const isDialog = useMediaQuery('(min-width: 640px)');
  const Modal = isDialog ? Dialog : Sheet;
  const Trigger = isDialog ? DialogTrigger : SheetTrigger;
  const Content = isDialog ? DialogContent : SheetContent;

  return (
    <>
      <div className='inline-flex w-full flex-wrap items-center justify-center gap-2'>
        <span className='text-lg font-medium'>Delivering to</span>

        <Modal open={open} onOpenChange={setOpen}>
          <Trigger className='inline-flex items-center gap-2'>
            <span className='text-lg font-bold'>{address.name}</span>

            <ChevronDownIcon />
          </Trigger>

          <Content
            className={cn({
              'flex max-w-lg flex-col': isDialog,
              'flex h-screen w-full flex-col': !isDialog,
            })}
            side='right'
          >
            <ChooseToggler
              isDialog={isDialog}
              addresses={addresses}
              selectedAddress={address}
              handleClose={handleClose}
              handleSelect={selectAddress}
            />
          </Content>
        </Modal>
      </div>

      {isLoading || isFetching || data === undefined ? (
        <Loading />
      ) : (
        <Locations locations={data.locations} />
      )}
    </>
  );
}

function LocationSkeleton() {
  return (
    <div className='inline-flex w-full items-center gap-3'>
      <div className='flex flex-col items-center gap-2'>
        <Location className='w-6 flex-shrink-0 fill-primary-500' />
        <Skeleton className='h-2 w-8' />
      </div>

      <div className='flex-1 space-y-2'>
        <Skeleton className='h-4 w-11/12' />
        <Skeleton className='h-2 w-4/12' />
        <Skeleton className='h-2 w-6/12' />
      </div>

      <Skeleton className='h-10 w-16 rounded-lg' />
    </div>
  );
}

function Loading() {
  return (
    <div className='flex w-full flex-col items-center justify-center gap-6'>
      <LocationSkeleton />
      <LocationSkeleton />
    </div>
  );
}
