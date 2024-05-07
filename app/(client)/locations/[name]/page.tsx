import Footer from '@/components/layout/footer';
import { MenuItem, OrderMenuResponse } from '@/types/menu';
import Item from './_components/item';

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

      <div className='grid gap-4 sm:grid-cols-2'>
        {items.map((item, index) => (
          <Item key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
