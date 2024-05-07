'use client';

import { ChevronRightIcon, PlusIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-media-query';
import { MenuItem } from '@/types/menu';
import Content from './content';
import ItemImage from './item-image';

export default function Item({ item }: { item: MenuItem }) {
  const [open, setOpen] = useState(false);
  const isDialog = useMediaQuery('(min-width: 640px)');

  const Modal = isDialog ? Dialog : Sheet;
  const Trigger = isDialog ? DialogTrigger : SheetTrigger;

  const { name, description, price, photoUrl } = item;
  const hasBasePrice = !!price;

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Trigger asChild>
        <div className='relative inline-flex w-full cursor-pointer rounded-lg border border-neutral-200 text-left'>
          <div className='my-auto flex h-full w-2/3 flex-1 flex-col justify-center gap-1.5 p-3'>
            <p className='inline-flex w-full items-center gap-1'>
              <span className='line-clamp-1 text-xs font-medium text-primary-900'>
                {name}
              </span>

              {!hasBasePrice && (
                <ChevronRightIcon className='w-2.5 flex-shrink-0' />
              )}
            </p>

            {description && (
              <p className='line-clamp-2 text-xxs'>{description}</p>
            )}

            {hasBasePrice && (
              <p className='text-xxs font-medium'>{`$${Number(price).toFixed(2)}`}</p>
            )}
          </div>

          <div className='h-full w-1/3'>
            <ItemImage
              src={`${process.env.NEXT_PUBLIC_CDN_URL}/${photoUrl}`}
              alt={name}
              className='aspect-[3/2] rounded-r-lg'
            />
          </div>

          <div className='absolute bottom-1 right-1 rounded-full bg-white p-1 px-1.5 shadow-xl transition-colors hover:bg-gray-200 hover:shadow-2xl'>
            <PlusIcon className='w-2.5 stroke-black' />
          </div>
        </div>
      </Trigger>

      {open && (
        <Content
          isDialog={isDialog}
          item={item}
          handleClose={() => setOpen(false)}
        />
      )}
    </Modal>
  );
}
