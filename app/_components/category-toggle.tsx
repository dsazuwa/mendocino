'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';

import { cn } from '@/_lib/utils';

type Props = {
  categories: string[];
  className?: string;
};

export default function CategoryToggle({ categories, className }: Props) {
  const [displayStartScroll, setDisplayStartScroll] = useState(false);
  const [displayEndScroll, setDisplayEndScroll] = useState(false);
  const [value, setValue] = useState(0);
  const [isScrolledPast, setScrolledPast] = useState(false);

  const tabsRef = useRef<HTMLDivElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);

  const getTabsMeta = () => {
    const tabsNode = tabsRef.current;
    let tabsMeta;
    let tabMeta;

    if (tabsNode) {
      const rect = tabsNode.getBoundingClientRect();
      tabsMeta = {
        clientWidth: tabsNode.clientWidth,
        scrollLeft: tabsNode.scrollLeft,
        scrollTop: tabsNode.scrollTop,
        scrollWidth: tabsNode.scrollWidth,
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
      };

      const children = tabListRef.current?.children;
      if (children !== undefined && children.length > 0) {
        const tab = children[value];

        tabMeta = tab ? tab.getBoundingClientRect() : null;
      }
    }

    return { tabsMeta, tabMeta };
  };

  useEffect(() => {
    const { tabsMeta, tabMeta } = getTabsMeta();

    if (!tabMeta || !tabsMeta || !tabListRef.current) return;

    if (tabMeta.left < tabsMeta.left) {
      const nextScrollStart =
        tabsMeta.scrollLeft + (tabMeta.left - tabsMeta.left);

      tabListRef.current.scroll({ left: nextScrollStart, behavior: 'smooth' });
    } else if (tabMeta.right > tabsMeta.right) {
      const nextScrollStart =
        tabsMeta.scrollLeft + (tabMeta.right + tabMeta.width - tabsMeta.right);

      tabListRef.current.scroll({ left: nextScrollStart, behavior: 'smooth' });
    }
  }, [value, getTabsMeta]);

  /**
   * Toggle visibility of start and end scroll buttons
   * Using IntersectionObserver on first and last Tabs.
   */
  useEffect(() => {
    if (tabListRef.current === null) return;

    const tabListChildren = Array.from(tabListRef.current.children);
    const { length } = tabListChildren;

    if (typeof IntersectionObserver !== 'undefined' && length > 0) {
      const firstTab = tabListChildren[0];
      const lastTab = tabListChildren[length - 1];
      const observerOptions = {
        root: tabsRef.current,
        threshold: 0.99,
      };

      const firstObserver = new IntersectionObserver((entries) => {
        setDisplayStartScroll(!entries[0].isIntersecting);
      }, observerOptions);
      firstObserver.observe(firstTab);

      const lastObserver = new IntersectionObserver((entries) => {
        setDisplayEndScroll(!entries[0].isIntersecting);
      }, observerOptions);
      lastObserver.observe(lastTab);

      return () => {
        firstObserver.disconnect();
        lastObserver.disconnect();
      };
    }
  }, []);

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
  }, [categories]);

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

      <div
        id='category-toggle'
        className={cn(
          'flex flex-row items-center justify-center overflow-hidden bg-white',
          { 'sticky top-12': isScrolledPast },
          className,
        )}
        ref={tabsRef}
      >
        <button className='px-2.5 py-3'>
          <ChevronLeftIcon
            className={cn('w-3', {
              'opacity-0': !displayStartScroll,
            })}
          />
        </button>

        <div
          className='flex-1 overflow-x-auto overflow-y-hidden whitespace-nowrap pb-0'
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          ref={tabListRef}
        >
          {categories.map((title, index) => (
            <button
              id={`tab-${index}`}
              key={`tab-${index}`}
              className={cn(
                'border-b-2 border-solid border-white px-2.5 py-3',
                {
                  'border-primary-600': value === index,
                },
              )}
              onClick={handleTabClick}
            >
              <span
                className={cn(
                  'text-[0.65rem] font-medium uppercase sm:text-[0.7rem]',
                  {
                    'font-semibold text-primary-600': value === index,
                  },
                )}
              >
                {title}
              </span>
            </button>
          ))}
        </div>

        <button className='px-2.5 py-3'>
          <ChevronRightIcon
            className={cn('w-3', {
              'opacity-0': !displayEndScroll,
            })}
          />
        </button>
      </div>
    </>
  );
}
