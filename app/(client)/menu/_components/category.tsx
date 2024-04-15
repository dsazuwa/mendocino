import { cn } from '@/lib/utils';
import { SubCategory } from '@/types/menu';
import Items from './items';
import TagBar from './tag-bar';

type Props = {
  index: number;
  category: string;
  notes?: string[];
  subCategories: SubCategory[];
};

export default function Category({
  index,
  category,
  notes,
  subCategories,
}: Props) {
  return (
    <div
      id={`category-${index}`}
      className='flex flex-col items-center gap-2 sm:gap-4'
    >
      <h2 className='text-center text-lg font-extrabold uppercase tracking-wider text-primary-900 md:text-xl'>
        {category}
      </h2>

      {notes && (
        <div>
          {notes.map((note, index) => (
            <div
              className='text-center text-xs/5 font-medium text-neutral-500 sm:max-w-2xl'
              key={`${category}-note-${index}`}
            >
              {note}
            </div>
          ))}
        </div>
      )}

      <TagBar />

      {subCategories.map((subCategory, index) =>
        subCategory.name ? (
          <div
            key={`${category}-sub-category-${index}`}
            className={cn({ 'pb-4 md:pb-6': index < subCategories.length - 1 })}
          >
            <h3 className='mb-2 text-center font-extrabold uppercase tracking-wider text-primary-900 md:mb-4 md:text-lg'>
              {subCategory.name}
            </h3>

            <Items items={subCategory.items} />
          </div>
        ) : (
          <Items key={`${category}-${index}`} items={subCategory.items} />
        ),
      )}
    </div>
  );
}
