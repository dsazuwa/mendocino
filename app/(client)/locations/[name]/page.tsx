import CartPanel from '@/components/cart/panel';
import Footer from '@/components/layout/footer';
import { fetchLocationMenu } from '@/lib/data';
import { MenuItem } from '@/types/menu';
import Item from './_components/item';

type Props = { params: { name: string } };

export default function LocationPage({ params }: Props) {
  return (
    <div className='flex w-full grow flex-col'>
      <div className='inline-flex w-full grow'>
        <Menu location={params.name} />

        <CartPanel />
      </div>

      <Footer />
    </div>
  );
}

async function Menu({ location }: { location: string }) {
  const { menu } = await fetchLocationMenu(location);

  return (
    <div className='w-full'>
      <div className='mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-8 md:px-8'>
        {menu.map(({ category, items }, index) => (
          <Category
            key={`menu-section-${index}`}
            category={category}
            items={items}
          />
        ))}
      </div>
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
