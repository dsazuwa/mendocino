import ClientLayout from '@/_components/layout/client-layout';
import Footer from '@/_components/layout/footer';
import { GroupedMenuResponse } from '@/_types/menu-types';
import Category from './_components/category';

async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/grouped`);

  if (!res.ok) throw new Error('Failed to fetch data');

  return res.json() as Promise<GroupedMenuResponse>;
}

export default async function Menu() {
  const { menu } = await getData();

  return (
    <ClientLayout>
      <main className='flex flex-1 flex-col'>
        <div className='mx-auto w-full max-w-screen-md flex-1 gap-2 p-4 pb-4'>
          <h1 className='p-2 text-center text-3xl font-extrabold tracking-wider text-primary-900'>
            MENU
          </h1>

          <div className='space-y-6 md:space-y-8'>
            {menu.map(({ category, notes, subCategories }, index) => (
              <Category
                key={`category-${index}`}
                index={index}
                category={category}
                notes={notes}
                subCategories={subCategories}
              />
            ))}
          </div>
        </div>

        <Footer />
      </main>
    </ClientLayout>
  );
}
