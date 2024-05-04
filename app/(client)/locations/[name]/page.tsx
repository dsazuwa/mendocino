import { ChevronRightIcon, PlusIcon } from '@radix-ui/react-icons';

import Footer from '@/components/layout/footer';
import { cn } from '@/lib/utils';
import { MenuItem, OrderMenuResponse } from '@/types/menu';
import ItemImage from './components/item-image';

async function fetchMenu(name: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/locations/${name}/menu`,
  );

  const { menu } = (await res.json()) as OrderMenuResponse;

  return menu;
}

type Props = { params: { name: string } };

export default async function LocationPage({ params }: Props) {
  const menu = await fetchMenu(params.name);

  return (
    <div className='flex w-full flex-1 flex-col'>
      <div className='flex w-full flex-1 flex-col'>
        <div className='mx-auto flex max-w-screen-xl flex-col items-center px-4 py-8 md:px-8'>
          <div className='w-full space-y-3'>
            {menu.map(({ category, items }, index) => (
              <Category
                key={`menu-section-${index}`}
                category={category}
                items={items}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

type CategoryProps = { category: string; items: MenuItem[] };

function Category({ category, items }: CategoryProps) {
  return (
    <div id={category} className='flex flex-col gap-1'>
      <div className='p-2 text-sm font-extrabold uppercase tracking-wider text-primary-900'>
        {category}
      </div>

      <div className='flex flex-col gap-4 sm:grid sm:grid-cols-12'>
        {items.map((item, index) => (
          <Item key={index} item={item} className='sm:col-span-6' />
        ))}
      </div>
    </div>
  );
}

type ItemProps = { item: MenuItem; className?: string };

function Item({ item, className }: ItemProps) {
  const { name, description, price, photoUrl } = item;
  const hasBasePrice = !!price;

  return (
    <div
      className={cn(
        'relative inline-flex w-full rounded-lg border border-neutral-200',
        className,
      )}
    >
      <div className='my-auto flex h-full w-2/3 flex-1 flex-col justify-center gap-1.5 p-3'>
        <div className='inline-flex w-full items-center gap-1'>
          <div className='line-clamp-1 text-xs font-medium text-primary-900'>
            {name}
          </div>

          {!hasBasePrice && (
            <ChevronRightIcon className='w-2.5 flex-shrink-0' />
          )}
        </div>

        {description && (
          <div className='line-clamp-2 text-xxs'>{description}</div>
        )}

        {hasBasePrice && (
          <div className='text-xxs font-medium'>{`$${Number(price).toFixed(2)}`}</div>
        )}
      </div>

      <div className='w-1/3'>
        <ItemImage
          src={`${process.env.NEXT_PUBLIC_CDN_URL}/${photoUrl}`}
          alt={name}
        />
      </div>

      <div className='absolute bottom-2 right-2 rounded-full bg-white p-1 px-1.5 transition-colors hover:bg-neutral-200 hover:shadow-xl'>
        <PlusIcon className='w-2.5 stroke-black' />
      </div>
    </div>
  );
}
