'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import useEmblaCarousel from 'embla-carousel-react';

import usePrevNextButtons from '@/hooks/use-embla-buttons';
import { MenuItem } from '@/types/menu';
import ItemModal from './item';

export default function FeaturedMenu() {
  const items: MenuItem[] = [
    {
      name: 'Avocado & Quinoa Superfood Ensalada',
      tags: ['VG', 'GF'],
      notes: 'Add shaved, roasted chicken breast (110 cal) +$3.75+',
      price: 15.35,
      itemId: 28,
      photoUrl: 'AvoQuinoa',
      description:
        'Chopped romaine, curly kale, quinoa & millet, housemade superfood krunchies, succotash with roasted corn, black beans & jicama, red onions, cilantro, cotija cheese, grape tomatoes, avocado (400 cal) with chipotle vinaigrette (250 cal)',
    },
    {
      name: '1/2 “Not So Fried” Chicken',
      tags: [],
      price: 0,
      itemId: 6,
      photoUrl: 'BPNotSoFriedChicken',
      description:
        "Shaved, roasted chicken breast topped with Mendo's krispies, herb aioli, mustard pickle slaw, tomatoes, pickled red onions on toasted ciabatta (450 cal) with a side of tangy mustard barbecue sauce (80 cal) or mustard pickle remoulade (120 cal)",
    },
    {
      name: 'The Impossible Taco Salad',
      tags: ['V', 'GF'],
      price: 16.68,
      itemId: 29,
      photoUrl: 'ImpossibleTaco',
      description:
        'Plant-based Impossible chorizo, housemade superfood krunchies, chopped romaine, curly kale, succotash with roasted corn, black beans & jicama, red onions, cilantro, grape tomatoes, avocado (400 cal) with house vegan chipotle ranch (240 cal)',
    },
    {
      name: "Mama Chen's Chinese Chicken Salad",
      tags: ['N'],
      notes:
        'Want to make it vegan? Swap the chicken for marinated, baked tofu',
      price: 16.96,
      itemId: 32,
      photoUrl: 'MamaChensChicken',
      description:
        'Shaved, roasted chicken breast, napa cabbage & kale slaw, carrots, bean sprouts, baby spinach, chopped romaine, scallions, cilantro, toasted cashews, crispy wontons (420 cal) with miso mustard sesame dressing (230 cal)',
    },
    {
      name: 'The Modern Caesar',
      tags: ['GF'],
      notes: 'Add shaved, roasted chicken breast (110 cal) +$3.75',
      price: 13.23,
      itemId: 31,
      photoUrl: 'ModernCesear',
      description:
        'Curly kale, chopped romaine, housemade superfood krunchies, shaved Grana Padano cheese, red onions, grape tomatoes, avocado, lemon squeeze (290 cal) with classic Caesar dressing (340 cal)',
    },
    {
      name: 'Chimichurri Steak & Bacon',
      tags: ['RGF'],
      price: 17.48,
      itemId: 22,
      photoUrl: 'ChimichurriSteakSandwich',
      description:
        'Roasted, carved steak and applewood smoked bacon topped with marinated red peppers, caramelized onion jam, chimichurri, shredded romaine, herb aioli (640 cal) on a toasted sesame roll (300 cal)',
    },
    {
      name: 'Pink Lady Beets & Goat Cheese Salad',
      tags: ['GF', 'N'],
      price: 16.96,
      itemId: 30,
      photoUrl: 'PinkLady',
      description:
        'Shaved, roasted chicken breast, honey and herb marinated goat cheese, pink lady beets, green apples, dried cranberries, crushed honey roasted almonds, red onions, mixed greens, chopped romaine (620 cal) with citrus vinaigrette (220 cal)',
    },
    {
      name: 'Chicken Pesto Caprese',
      tags: ['RGF'],
      notes:
        'Want to make it vegetarian? Swap the chicken for extra mozzarella',
      price: 14.2,
      itemId: 7,
      photoUrl: 'ChickenPestoCaprese',
      description:
        'Shaved, roasted chicken breast, fresh mozzarella, marinated red peppers, basil pesto, mixed greens, balsamic glaze drizzle (600 cal) on panini-pressed ciabatta (260 cal)',
    },
    {
      name: 'The Farm Club',
      tags: ['RGF'],
      price: 15.24,
      itemId: 9,
      photoUrl: 'FarmClub',
      description:
        "Shaved, roasted turkey breast, smashed avocado, applewood smoked bacon, herb aioli, tomatoes, mixed greens, pickled red onions (440 cal) on Mom's seeded honey whole wheat (320 cal)",
    },
    {
      name: 'Peruvian Steak',
      tags: ['RGF'],
      notes: 'Add avocado (80 cal) +$2+',
      price: 17.48,
      itemId: 20,
      photoUrl: 'PeruvianSteak',
      description:
        'Spicy aji amarillo marinated steak with Oaxacan cheese, herb aioli, red onions, tomatoes, shredded romaine (520 cal) on a toasted potato roll (240 cal)',
    },
    {
      name: 'Watermelon Street Cart Salad',
      tags: ['V', 'GF'],

      price: 0,
      itemId: 49,
      photoUrl: 'WatermelonStreetCart',
      description:
        'watermelon, cucumber, jicama, fresh mint, green onion, chile-lime vinaigrette',
    },
    {
      name: "Mendo's Original Pork Belly Banh Mi",
      tags: [],
      price: 15.81,
      itemId: 23,
      photoUrl: 'BanhMi',
      description:
        "Our Chef's playful take on the popular Vietnamese sandwich with braised, caramelized pork belly, pickled daikon & carrots, cilantro, cucumbers, jalapeños, Thai basil, sriracha mayo (540 cal) on panini-pressed ciabatta (260 cal)",
    },
    {
      name: 'Crispy Chicken Tenders',
      tags: [],
      notes: '*available at select locations*',
      price: 9.14,
      itemId: 41,
      photoUrl: 'CrispyChickenTenders',
      description: 'with a side of ketchup or vegan ranch (320 cal)',
    },
    {
      name: 'Chicken Parm Dip',
      tags: [],
      price: 16.22,
      itemId: 24,
      photoUrl: 'ChickenParmDip',
      description:
        "Shaved, roasted chicken breast, Mendo's krispies, melted mozzarella and Grana Padano cheeses, pomodoro sauce, Italian basil, Calabrian chili aioli (630 cal) on a toasted sesame roll (300 cal) served with an extra side of pomodoro sauce for dipping (40 cal)",
    },
    {
      name: 'Dan Dan Noodle Salad',
      tags: ['N'],

      price: 0,
      itemId: 46,
      photoUrl: 'DanDanNoodle',
      description:
        'ramen noodles, cucumber, sugar snap peas, rainbow carrots, scallions, cilantro, toasted cashews, sesame seeds, dan dan sauce',
    },
    {
      name: '1/2 “Not So Fried” Chicken',
      tags: [],

      price: 0,
      itemId: 6,
      photoUrl: 'BPNotSoFriedChicken',
      description:
        "Shaved, roasted chicken breast topped with Mendo's krispies, herb aioli, mustard pickle slaw, tomatoes, pickled red onions on toasted ciabatta (450 cal) with a side of tangy mustard barbecue sauce (80 cal) or mustard pickle remoulade (120 cal)",
    },
  ];

  return items.length === 0 ? <></> : <Items items={items} />;
}

function Items({ items }: { items: MenuItem[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ slidesToScroll: 'auto' });

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <>
      <div className='mt-5 inline-flex w-full items-center'>
        <div className='flex-1 text-sm font-extrabold uppercase tracking-wider text-primary-900'>
          Featured Items
        </div>

        <NavButton
          dir='left'
          onClick={onPrevButtonClick}
          disabled={prevBtnDisabled}
        />

        <NavButton
          dir='right'
          onClick={onNextButtonClick}
          disabled={nextBtnDisabled}
        />
      </div>

      <div className='embla mt-4' ref={emblaRef}>
        <div className='embla__container inline-flex gap-2.5'>
          {items.map((item, index) => (
            <ItemModal key={`featured-item-${index}`} item={item} featured />
          ))}
        </div>
      </div>
    </>
  );
}

function NavButton({
  dir,
  disabled,
  onClick,
}: {
  dir: 'left' | 'right';
  onClick: () => void;
  disabled: boolean;
}) {
  const Icon = dir === 'left' ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <button
      className='mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-neutral-200 stroke-black transition-colors hover:bg-neutral-300/80 disabled:bg-neutral-100 disabled:stroke-neutral-300'
      disabled={disabled}
      onClick={onClick}
    >
      <Icon className={'w-2.5'} />
    </button>
  );
}
