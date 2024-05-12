'use client';

import { SyntheticEvent, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import Tabs from './mui-tabs/tabs';
import Tab from './mui-tabs/tab';

type Props = {
  categories: string[];
  className?: string;
};

export default function CategoryToggle({ categories, className }: Props) {
  const [value, setValue] = useState(0);
  const [isScrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const categoryToggleObserver = new IntersectionObserver(
      (entries) => {
        setScrolledPast(!entries[0].isIntersecting);
      },
      { threshold: 0.75, rootMargin: '-48px' },
    );

    categoryToggleObserver.observe(
      document.querySelector('#category-toggle-anchor') as Element,
    );
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map((_, index) =>
        document.getElementById(`category-${index}`),
      );

      sections.forEach((section, index) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 0 && index !== value)
            setValue(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [value, categories]);

  const handleTabClick = (event: SyntheticEvent) => {
    event.preventDefault();

    const index = Number(event.currentTarget.id.split('-')[1]);

    setValue(index);

    const scrollTarget = document.getElementById(`category-${index}`);
    const selectedTab = document.getElementById(`tab-${index}`);
    const appBar = document.getElementById('client-app-bar');
    const categoryToggle = document.getElementById('category-toggle');

    if (scrollTarget && selectedTab && appBar && categoryToggle) {
      const offset = appBar?.offsetHeight + categoryToggle?.offsetHeight;

      window.scrollTo({
        top: scrollTarget.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <div id='category-toggle-anchor' />

      <Tabs
        value={value}
        variant='scrollable'
        scrollButtons
        allowScrollButtonsMobile
        className={cn(
          'z-10 flex flex-row items-center justify-center overflow-hidden bg-white',
          { 'sticky top-16': isScrolledPast },
          className,
        )}
      >
        {categories.map((title, index) => (
          <Tab
            id={`tab-${index}`}
            key={`tab-${index}`}
            className='text-[0.65rem] uppercase sm:text-[0.7rem]'
            onClick={handleTabClick}
            label={title}
          />
        ))}
      </Tabs>
    </>
  );
}
