import { cn } from '@/_lib/utils';
import { MenuItem } from '@/_types/menu-types';
import ItemImage from './item-image';
import ItemTag from './item-tag';

type Props = { item: MenuItem; className?: string };

export default function Item({ item, className }: Props) {
  const { name, description, tags, photoUrl, notes } = item;

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1.5 text-center text-xs leading-[1.5]',
        className,
      )}
    >
      <ItemImage url={photoUrl} alt={name} />

      <div className='items-center font-semibold text-primary-900'>{name}</div>

      {tags && <ItemTag tags={tags} />}

      <div className='text-neutral-600 first-letter:uppercase'>
        {description}
      </div>

      {notes && (
        <div className='text-neutral-600 first-letter:uppercase'>{notes}</div>
      )}
    </div>
  );
}
