import { Cross2Icon } from '@radix-ui/react-icons';

import ContentHeader from '@/components/content-header';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { SheetClose } from '@/components/ui/sheet';
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

  return (
    <>
      <ContentHeader className='border-none'>
        <Comp asChild>
          <Button variant='ghost' size='icon' className='ml-[-8px]'>
            <Cross2Icon className='h-4 w-4 fill-neutral-500' />

            <span className='sr-only'>Close</span>
          </Button>
        </Comp>
      </ContentHeader>

      <div className='flex flex-col gap-2 overflow-y-auto px-4 pb-4 sm:gap-3.5'>
        <p className='text-lg font-bold text-black sm:text-2xl'>{name}</p>

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
