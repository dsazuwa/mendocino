'use client';

import { SyntheticEvent, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import Tabs from './tabs';

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
      { threshold: 0.99, rootMargin: '-48px' },
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
      const offset = appBar?.offsetHeight + categoryToggle?.offsetHeight + 10;

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
        className={cn(
          'flex flex-row items-center justify-center overflow-hidden bg-white',
          { 'sticky top-12': isScrolledPast },
          className,
        )}
        value={value}
      >
        {categories.map((title, index) => (
          <button
            id={`tab-${index}`}
            key={`tab-${index}`}
            className={cn(
              'px-2.5 py-3 text-[0.65rem] font-medium uppercase transition-colors sm:text-[0.7rem]',
              { 'font-semibold text-primary-600': value === index },
            )}
            onClick={handleTabClick}
          >
            {title}
          </button>
        ))}
      </Tabs>
    </>
  );
}
