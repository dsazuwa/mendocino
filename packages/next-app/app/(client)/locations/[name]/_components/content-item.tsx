import { Cross2Icon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

import ContentHeader from '@/components/content-header';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ItemNode } from '@/redux/slices/order';
import { Preferences } from './content-preferences';
import ItemImage from './item-image';
import OptionGroup from './option-group';
import QuantityControl from './quantity-control';

type Props = {
  isDialog: boolean;
  current: ItemNode;
  openPreferences: () => void;
};

export default function ItemContent({
  isDialog,
  current,
  openPreferences,
}: Props) {
  const Comp = isDialog ? DialogClose : SheetClose;
  const { name, description, photoUrl, children } = current;

  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const appBar = document.querySelector('#dialog-app-bar');
    const observedElement = document.querySelector('#scroll-anchor');

    if (appBar == null || observedElement == null) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setScrolledPast(!entries[0].isIntersecting);
      },
      { threshold: 0, rootMargin: `-${appBar.clientHeight}px` },
    );

    observer.observe(observedElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <ContentHeader
        id='dialog-app-bar'
        className={cn('gap-2 border-none', {
          'border-b border-solid border-neutral-200': scrolledPast,
        })}
      >
        <Comp asChild>
          <Button
            variant='ghost'
            size='icon'
            className='inlien-flex ml-[-8px] gap-4'
          >
            <Cross2Icon className='h-4 w-4 fill-neutral-500' />

            <span className='sr-only'>Close</span>
          </Button>
        </Comp>

        <div className='line-clamp-1 text-sm font-semibold text-black transition ease-in-out'>
          {scrolledPast && name}
        </div>
      </ContentHeader>

      <div className='flex flex-col gap-2 overflow-y-auto px-4 pb-4 sm:gap-3.5'>
        <p
          id='scroll-anchor'
          className='text-lg font-bold text-black sm:text-2xl'
        >
          {name}
        </p>

        {description && (
          <p className='text-xs font-semibold text-neutral-500/95 sm:text-sm'>
            {description}
          </p>
        )}

        <div className='aspect-[3/2] shrink-0'>
          <ItemImage
            src={`${process.env.NEXT_PUBLIC_CDN_URL}/${photoUrl}`}
            alt={name}
          />
        </div>

        <div className='flex flex-col gap-5'>
          {children.map((key) => (
            <OptionGroup key={key} modifier={key} />
          ))}

          <Preferences open={openPreferences} />
        </div>
      </div>

      <QuantityControl current={current} />
    </>
  );
}
