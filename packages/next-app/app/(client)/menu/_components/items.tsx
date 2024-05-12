import { MenuItem } from '@/types/menu';
import { cn } from '@/lib/utils';
import ItemImage from './item-image';

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

type ItemProps = { item: MenuItem; className?: string };

function Item({ item, className }: ItemProps) {
  const { name, description, tags, photoUrl, notes } = item;

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1.5 text-center text-xs leading-[1.5]',
        className,
      )}
    >
      <ItemImage url={photoUrl} alt={name} />

      <p className='text-center font-semibold text-primary-900'>{name}</p>

      {tags && <ItemTag tags={tags} />}

      <p className='first-letter:uppercase'>{description}</p>

      {notes && <p className='first-letter:uppercase'>{notes}</p>}
    </div>
  );
}

function ItemTag({ tags }: { tags: string[] }) {
  return (
    <div className='inline-flex items-center divide-x-[1px]'>
      {tags.map((tag, index) => (
        <div key={`tag-${index}`} className='px-2 text-xxs/4 font-semibold'>
          {tag}
        </div>
      ))}
    </div>
  );
}
