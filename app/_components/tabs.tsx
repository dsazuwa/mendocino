'use client';

/* WIP based on MUI Tabs */

import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/_lib/utils';
import useDebounce from '@/_hooks/useDebounce';

function ownerDocument(node: Node | null) {
  return (node && node.ownerDocument) || document;
}

function ownerWindow(node: Node | null) {
  const doc = ownerDocument(node);
  return doc.defaultView || window;
}

type Props = {
  className?: string;
  children: ReactNode;
  value: number;
};

export default function Tabs({ className, children, value }: Props) {
  const defaultIndicatorStyle: {
    left?: number;
    width?: number;
  } = {};

  const [indicatorStyle, setIndicatorStyle] = useState(defaultIndicatorStyle);
  const [displayStartScroll, setDisplayStartScroll] = useState(false);
  const [displayEndScroll, setDisplayEndScroll] = useState(false);

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
        tabMeta = tab ? tab.getBoundingClientRect() : undefined;
      }
    }

    return { tabsMeta, tabMeta };
  };

  const scrollSelectedIntoView = useCallback(
    (animate: boolean) => {
      const { tabsMeta, tabMeta } = getTabsMeta();

      const behavior = animate ? 'smooth' : 'instant';

      if (!tabMeta || !tabsMeta || !tabListRef.current) return;

      if (tabMeta.left < tabsMeta.left) {
        const nextScrollStart =
          tabsMeta.scrollLeft + (tabMeta.left - tabsMeta.left);

        tabListRef.current.scroll({
          left: nextScrollStart,
          behavior,
        });
      } else if (tabMeta.right > tabsMeta.right) {
        const nextScrollStart =
          tabsMeta.scrollLeft +
          (tabMeta.right + tabMeta.width - tabsMeta.right);

        tabListRef.current.scroll({
          left: nextScrollStart,
          behavior,
        });
      }
    },
    [value, getTabsMeta],
  );

  /**
   * Don't animate on the first render.
   */
  useEffect(() => {
    scrollSelectedIntoView(defaultIndicatorStyle !== indicatorStyle);
  }, [scrollSelectedIntoView, defaultIndicatorStyle, indicatorStyle]);

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

  const updateIndicatorState = useCallback(() => {
    const { tabsMeta, tabMeta } = getTabsMeta();

    let startValue = 0;

    if (tabMeta && tabsMeta) {
      const correction = tabsMeta.scrollLeft;
      startValue = tabMeta.left - tabsMeta.left + correction;
    }

    const newIndicatorStyle = {
      left: startValue,
      width: tabMeta ? tabMeta.width : 0,
    };

    if (indicatorStyle.left === undefined || indicatorStyle.width === undefined)
      setIndicatorStyle(newIndicatorStyle);
    else {
      const dStart = Math.abs(indicatorStyle.left - newIndicatorStyle.left);
      const dSize = Math.abs(indicatorStyle.width - newIndicatorStyle.width);

      if (dStart >= 1 || dSize >= 1) setIndicatorStyle(newIndicatorStyle);
    }
  }, [value, getTabsMeta, indicatorStyle.left, indicatorStyle.width]);

  const handleResize = useDebounce(() => {
    if (tabsRef.current) updateIndicatorState();
  }, 100);

  useEffect(() => {
    if (tabsRef.current === null || tabListRef.current === null) return;

    const window = ownerWindow(tabsRef.current);
    window.addEventListener('resize', handleResize);

    let resizeObserver: ResizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(handleResize);

      Array.from(tabListRef.current.children).forEach((child) => {
        resizeObserver.observe(child);
      });
    }

    return () => {
      handleResize.clear();
      window.removeEventListener('resize', handleResize);

      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [updateIndicatorState]);

  return (
    <div
      id='category-toggle'
      className={cn(
        'flex flex-row items-center justify-center overflow-hidden',
        className,
      )}
    >
      <button className='px-2.5 py-3'>
        <ChevronLeftIcon
          className={cn('w-3', { 'opacity-0': !displayStartScroll })}
        />
      </button>

      <div
        className='relative inline-block flex-1 overflow-x-auto overflow-y-hidden whitespace-nowrap pb-0'
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        ref={tabsRef}
      >
        <div className='flex flex-row' ref={tabListRef}>
          {children}
        </div>

        <span
          className='absolute bottom-0 h-[1px] bg-primary-600 transition-all duration-300 ease-in-out'
          style={{ ...indicatorStyle }}
        />
      </div>

      <button className='px-2.5 py-3'>
        <ChevronRightIcon
          className={cn('w-3', { 'opacity-0': !displayEndScroll })}
        />
      </button>
    </div>
  );
}
