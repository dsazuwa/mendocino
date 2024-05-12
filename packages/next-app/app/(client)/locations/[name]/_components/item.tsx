'use client';

import { ChevronRightIcon, PlusIcon } from '@radix-ui/react-icons';
import { Dispatch, SetStateAction, forwardRef, useState } from 'react';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-media-query';
import { formatPrice } from '@/lib/utils';
import { MenuItem } from '@/types/menu';
import Content from './content';
import ItemImage from './item-image';

type Props = {
  item: MenuItem;
  featured?: boolean;
  setLoadingFeatured?: Dispatch<SetStateAction<boolean>>;
};

export default function ItemModal({
  item,
  featured,
  setLoadingFeatured,
}: Props) {
  const [open, setOpen] = useState(false);
  const isDialog = useMediaQuery('(min-width: 640px)');

  const Modal = isDialog ? Dialog : Sheet;
  const Trigger = isDialog ? DialogTrigger : SheetTrigger;
  const Comp = featured ? FeaturedItem : Item;

  const handleClick = () => {
    if (setLoadingFeatured) setLoadingFeatured(true);
    setOpen(!open);
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Trigger asChild>
        <Comp item={item} onClick={handleClick} />
      </Trigger>

      {open && (
        <Content
          isDialog={isDialog}
          item={item}
          handleClose={() => setOpen(false)}
          setLoadingFeatured={setLoadingFeatured}
        />
      )}
    </Modal>
  );
}

const Item = forwardRef<
  HTMLDivElement,
  { item: MenuItem; onClick: () => void }
>(({ item, onClick }, ref) => {
  const { name, description, price, photoUrl } = item;
  const hasBasePrice = !!price;

  return (
    <div
      ref={ref}
      className='relative inline-flex w-full cursor-pointer rounded-lg border border-neutral-200 text-left'
      onClick={onClick}
    >
      <div className='my-auto flex h-full w-2/3 flex-1 flex-col justify-center gap-1.5 p-3'>
        <p className='inline-flex w-full items-center gap-1'>
          <span className='line-clamp-1 text-xs font-medium text-primary-900'>
            {name}
          </span>

          {!hasBasePrice && (
            <ChevronRightIcon className='w-2.5 flex-shrink-0' />
          )}
        </p>

        {description && <p className='line-clamp-2 text-xxs'>{description}</p>}

        {hasBasePrice && (
          <p className='text-xxs font-medium'>{formatPrice(price)}</p>
        )}
      </div>

      <div className='h-full w-1/3'>
        <ItemImage
          src={`${process.env.NEXT_PUBLIC_CDN_URL}/${photoUrl}`}
          alt={name}
          className='aspect-[3/2] rounded-r-lg'
        />
      </div>

      <AddButton />
    </div>
  );
});

Item.displayName = 'Item';

const FeaturedItem = forwardRef<
  HTMLDivElement,
  { item: MenuItem; onClick: () => void }
>(({ item, onClick }, ref) => {
  const { name, price, photoUrl } = item;
  const hasBasePrice = !!price;

  return (
    <div
      ref={ref}
      className='embla__slide max-w-40 cursor-pointer rounded-lg border border-neutral-200 sm:max-w-48'
      onClick={onClick}
    >
      <div className='relative aspect-[3/2]'>
        <ItemImage
          src={`${process.env.NEXT_PUBLIC_CDN_URL}/${photoUrl}`}
          alt={name}
          className='rounded-t-lg'
        />

        <AddButton />
      </div>

      <div className='px-2 py-3 font-medium'>
        <p className='inline-flex w-full items-center gap-1'>
          <span className='line-clamp-2 text-xs text-primary-900'>{name}</span>

          {!hasBasePrice && (
            <ChevronRightIcon className='w-2.5 flex-shrink-0' />
          )}
        </p>

        {hasBasePrice && (
          <div className='mt-1 text-xxs'>{formatPrice(price)}</div>
        )}
      </div>
    </div>
  );
});

FeaturedItem.displayName = 'FeaturedItem';

function AddButton() {
  return (
    <div className='absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-xl transition-colors hover:bg-gray-200 hover:shadow-2xl'>
      <PlusIcon className='w-2.5 stroke-black' />
    </div>
  );
}
