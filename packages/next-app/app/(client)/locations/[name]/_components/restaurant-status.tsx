import Clock from '@/components/icons/clock';
import { formatPrice } from '@/lib/utils';

export default function RestaurantStatus() {
  return (
    <div className='inline-flex divide-x-[1px] divide-neutral-200 rounded-lg border border-neutral-200 px-4 py-2'>
      <InfoDisplay label='Pricing & fees' value={formatPrice(0)} />
      <InfoDisplay label='Pickup time' value='Closed' />
    </div>
  );
}

export function MiniRestaurantStatus() {
  return (
    <div className='inline-flex items-center gap-1 text-xxs'>
      <Clock className='w-3 fill-neutral-500' />
      <span>Available at 9:45 AM</span>
      <span>•</span>
      <span>0.6 miles</span>
    </div>
  );
}

function InfoDisplay({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex w-1/2 flex-col items-center gap-1 text-xxs md:text-[11px]'>
      <span className='font-medium text-black'>{value}</span>
      <span className='text-neutral-400'>{label}</span>
    </div>
  );
}
