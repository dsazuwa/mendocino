import { MenuItem } from '@/types/menu';
import Item from './item';

export default function Items({ items }: { items: MenuItem[] }) {
  return (
    <div className='grid grid-cols-12 gap-4'>
      {items.map((item, index) => (
        <Item
          key={index}
          item={item}
          className='col-span-12 sm:col-span-6 md:col-span-4'
        />
      ))}
    </div>
  );
}
