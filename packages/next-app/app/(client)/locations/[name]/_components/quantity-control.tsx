import { ChangeEvent } from 'react';
import { MinusCircledIcon, PlusCircledIcon } from '@radix-ui/react-icons';

import { useOrderStore } from '@/app/providers/order-provider';
import ContentFooter from '@/components/content-footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';
import { getItemSelectionPrice } from '@/stores/order/selection-utils';
import { ItemNode } from '@/stores/order/types';

type Props = { current: ItemNode };

export default function QuantityControl({ current }: Props) {
  const { key, quantity } = current;

  const map = useOrderStore((state) => state.map);

  const setQuantity = useOrderStore((state) => state.setQuantity);
  const incrementQuantity = useOrderStore((state) => state.incrementQuantity);
  const decrementQuantity = useOrderStore((state) => state.decrementQuantity);

  const limitDigits = (value: string) => value.replace(/\D/g, '').slice(0, 3);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = limitDigits(e.target.value);
    const quantity = Number.parseInt(val || '1', 10);

    setQuantity(current.key, quantity);
  };

  return (
    <ContentFooter className='inline-flex flex-wrap items-center justify-center gap-1 sm:gap-2 sm:p-4'>
      <Button
        variant='ghost'
        size='icon'
        className='h-11 w-11 fill-neutral-500 hover:bg-neutral-100 disabled:fill-neutral-200'
        disabled={quantity === 1}
        onClick={() => decrementQuantity(key)}
      >
        <MinusCircledIcon className='h-6 w-6' />
      </Button>

      <Input
        variant='ghost'
        className='w-16 rounded-lg px-3 py-7 text-center text-xs font-medium'
        value={current.quantity}
        onChange={handleChange}
      />

      <Button
        variant='ghost'
        size='icon'
        className='h-11 w-11 fill-neutral-500 hover:bg-neutral-100 disabled:fill-neutral-200'
        disabled={quantity === 999}
        onClick={() => incrementQuantity(key)}
      >
        <PlusCircledIcon className='h-6 w-6' />
      </Button>

      <Button
        variant='primary'
        className='mt-1 rounded-2xl px-6 text-xs sm:px-8 sm:text-sm'
      >
        {`ADD TO CART - ${formatPrice(
          getItemSelectionPrice(map, current) * quantity,
        )}`}
      </Button>
    </ContentFooter>
  );
}
