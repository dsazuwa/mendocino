import Footer from '@/components/layout/footer';
import { GroupedMenuResponse } from '@/lib/types/menu';
import Category from './_components/category';
import CategoryToggle from '@/components/category-toggle';
import { ClientLayout } from '@/components/layout/client';

async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/grouped`);

  if (!res.ok) throw new Error('Failed to fetch data');

  return res.json() as Promise<GroupedMenuResponse>;
}

export default async function Menu() {
  const { menu, categories } = await getData();

  return (
    <ClientLayout>
      <main className='mx-auto w-full max-w-screen-md flex-1 gap-2 p-4 pb-4'>
        <h1 className='p-2 text-center text-3xl font-extrabold tracking-wider text-primary-900'>
          MENU
        </h1>

        <CategoryToggle categories={categories} />

        <div className='space-y-6 pt-4 md:space-y-8'>
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
      </main>

      <Footer />
    </ClientLayout>
  );
}
