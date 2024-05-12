import CartPanel from '@/components/cart/panel';
import Footer from '@/components/layout/footer';
import { fetchLocationMenu } from '@/lib/data';
import { MenuItem } from '@/types/menu';
import FeaturedMenu from './_components/featured-menu';
import ItemModal from './_components/item';
import ItemImage from './_components/item-image';
import RestaurantDetails from './_components/restaurant-details';
import RestaurantStatus, {
  MiniRestaurantStatus,
} from './_components/restaurant-status';
import CategoryToggle from '@/components/category-toggle';

type Props = { params: { name: string } };

export default function LocationPage({ params }: Props) {
  return (
    <main className='flex w-full grow flex-col'>
      <div className='inline-flex w-full grow'>
        <Menu location={params.name} />

        <CartPanel />
      </div>

      <Footer />
    </main>
  );
}

async function Menu({ location }: { location: string }) {
  const { name, menu, address, city, state, lat, lng, phoneNumber } =
    await fetchLocationMenu(location);

  return (
    <div className='w-full min-w-0 lg:w-[100%-320px]'>
      <div className='mx-auto flex max-w-[1200px] flex-col gap-4 p-4 md:px-8 md:pb-6'>
        <div className='h-40 w-full'>
          <ItemImage
            src={`${process.env.NEXT_PUBLIC_CDN_URL}/Hero`}
            alt='location image'
            className='rounded-lg'
          />
        </div>

        <div>
          <h1 className='text-xl font-extrabold text-primary-900 md:text-2xl'>
            {name}
          </h1>

          <MiniRestaurantStatus />
        </div>

        <div className='flex flex-col-reverse gap-4 sm:flex-row'>
          <div className='w-full min-w-0 sm:w-[calc(100%-320px)]'>
            <FeaturedMenu />
          </div>

          <div className='flex shrink-0 flex-col gap-4 sm:mt-[-40px] sm:max-w-80'>
            <RestaurantStatus />

            <RestaurantDetails
              name={name}
              address={address}
              city={city}
              state={state}
              lat={lat}
              lng={lng}
              phoneNumber={phoneNumber}
            />
          </div>
        </div>

        <CategoryToggle
          className='mt-[-20px]'
          categories={menu.map((x) => x.category)}
        />

        <div className='flex flex-col gap-5'>
          {menu.map(({ category, items }, index) => (
            <Category
              key={`menu-section-${index}`}
              index={index}
              category={category}
              items={items}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

type CategoryProps = { index: number; category: string; items: MenuItem[] };

function Category({ index, category, items }: CategoryProps) {
  return (
    <div id={`category-${index}`} className='flex flex-col gap-4'>
      <div className='text-sm font-extrabold uppercase tracking-wider text-primary-900'>
        {category}
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        {items.map((item, index) => (
          <ItemModal key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
