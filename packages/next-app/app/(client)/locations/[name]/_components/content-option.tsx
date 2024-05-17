import { ArrowLeftIcon } from '@radix-ui/react-icons';

import { useOrderStore } from '@/app/providers/order-provider';
import ContentFooter from '@/components/content-footer';
import ContentHeader from '@/components/content-header';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { getOptionSelectionPrice } from '@/stores/order/selection-utils';
import { OptionNode } from '@/stores/order/types';
import OptionGroup from './option-group';

type Props = { itemName: string; current: OptionNode };

export default function OptionContent({ itemName, current }: Props) {
  const map = useOrderStore((state) => state.map);
  const returnToParent = useOrderStore((state) => state.returnToParent);

  const selectionPrice = getOptionSelectionPrice(map, current);

  const handleBack = () => {
    returnToParent(current.key);
  };

  const handleSave = () => {
    if (current.isValid) handleBack();
  };

  return (
    <>
      <ContentHeader className='border-none'>
        <Button
          variant='ghost'
          size='icon'
          className='ml-[-8px]'
          onClick={handleBack}
        >
          <ArrowLeftIcon className='h-4 w-4 fill-neutral-500' />

          <span className='sr-only'>Return</span>
        </Button>

        <div className='space-y-0.5'>
          <div className='text-xs font-medium text-neutral-400'>{itemName}</div>
          <div className='text-xs font-semibold text-black sm:text-sm'>
            {current.name}
          </div>
        </div>
      </ContentHeader>

      <div className='flex flex-col gap-5 overflow-y-auto p-4 pb-6'>
        {current.children.map((key) => (
          <OptionGroup key={key} modifier={key} />
        ))}
      </div>

      <ContentFooter className='inline-flex'>
        <Button
          variant='primary'
          className='w-full rounded-2xl uppercase'
          onClick={handleSave}
        >
          {selectionPrice === 0 ? (
            'Save'
          ) : (
            <span className='inline-flex w-full justify-between'>
              <span>Save Options</span>
              <span>+{formatPrice(selectionPrice)}</span>
            </span>
          )}
        </Button>
      </ContentFooter>
    </>
  );
}
