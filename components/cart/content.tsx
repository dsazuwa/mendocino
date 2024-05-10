import { cn, formatPrice } from '@/lib/utils';
import NoFood from '../icons/no-food';
import { Button } from '../ui/button';

type Props = { className?: string; restaurant?: string };

export default function CartContent({ className, restaurant }: Props) {
  if (!restaurant) return <EmptyCartContent />;

  return (
    <div className={cn('space-y-2', className)}>
      <div className='flex flex-col'>
        <span className='text-xs md:text-sm'>Your cart from</span>
        <span className='text-sm font-semibold text-neutral-800 md:text-base'>
          {decodeURIComponent(restaurant)}
        </span>
      </div>

      <Button
        variant='primary'
        className='w-full justify-between rounded-full uppercase'
      >
        <span>Checkout</span> <span>{formatPrice(0)}</span>
      </Button>
    </div>
  );
}

function EmptyCartContent() {
  return (
    <div className='flex flex-col items-center font-semibold text-neutral-300'>
      <NoFood className='mb-2 w-12 fill-neutral-300' />
      <div>Your cart is empty</div>
      <div>Add items to get started</div>
    </div>
  );
}
