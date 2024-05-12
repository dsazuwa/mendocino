import { cn } from '@/lib/utils';
import { SubCategory } from '@/types/menu';
import Items from './items';

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
      className='flex flex-col items-center gap-3 sm:gap-4'
    >
      <h2 className='text-center text-lg font-extrabold uppercase tracking-wider text-primary-900 md:text-xl'>
        {category}
      </h2>

      {notes && (
        <div>
          {notes.map((note, index) => (
            <p
              className='text-center text-xs/5 text-neutral-700 sm:max-w-2xl'
              key={`${category}-note-${index}`}
            >
              {note}
            </p>
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

function TagBar() {
  const tags = [
    { name: 'V', description: 'Vegan' },
    { name: 'VG', description: 'Vegetarian' },
    { name: 'GF', description: 'Gluten-Free' },
    { name: 'RGF', description: 'Can be Requested Gluten-Free' },
    { name: 'N', description: 'Contains Nuts' },
  ];

  return (
    <div className='inline-flex flex-wrap justify-center gap-3 md:gap-4'>
      {tags.map(({ name, description }, index) => (
        <div
          key={`tag-${index}`}
          className='inline-flex items-center gap-1 md:gap-2'
        >
          <span className='text-xxs font-medium text-primary-900 md:text-xs'>
            {name}
          </span>

          <div className='h-full w-[1px] bg-neutral-300' />

          <span className='text-xxs text-neutral-500 md:text-xs'>
            {description}
          </span>
        </div>
      ))}
    </div>
  );
}
