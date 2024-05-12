'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import * as React from 'react';
import { isFragment } from 'react-is';

import useDebounce from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import animate from './animate';
import ownerWindow from './owner-window';
import { detectScrollType, getNormalizedScrollLeft } from './scroll-left';
import Tab from './tab';

let warnedOnceTabPresent = false;

type TOwnerState = {
  vertical: boolean;
  fixed: boolean;
  hideScrollbar: boolean;
  scrollableX: boolean;
  scrollableY: boolean;
  centered: boolean;
  scrollButtonsHideMobile: boolean;
  isRtl?: boolean;
};

type TIndicatorStyle = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  height: number;
  width: number;
};

type InnerProps = {
  className?: string;
  style?: React.CSSProperties;
};

type TabsActions = {
  updateIndicator: () => void;
  updateScrollButtons: () => void;
};

type TabsProps = {
  action?: React.Ref<TabsActions>;
  allowScrollButtonsMobile?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  centered?: boolean;
  children: React.ReactNode;
  className?: string;
  onChange?: (e: React.SyntheticEvent, value: any) => void;
  orientation?: 'horizontal' | 'vertical';
  scrollButtons: 'auto' | false | true;
  selectionFollowsFocus?: boolean;
  TabIndicatorProps?: InnerProps;
  TabScrollButtonProps?: InnerProps;
  value: any;
  variant?: 'fullWidth' | 'scrollable' | 'standard';
  visibleScrollbar?: boolean;
};

const TabsRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> & {
    ownerState: TOwnerState;
  }
>(({ className, ownerState, style, ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        'flex min-h-12 flex-row items-center justify-center overflow-hidden',
        ownerState.vertical && 'flex-col',
        className,
      )}
      style={{ WebkitOverflowScrolling: 'touch', ...style }}
    />
  );
});

TabsRoot.displayName = 'TabsRoot';

const TabScrollButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'> & {
    ownerState: TOwnerState;
    orientation: 'horizontal' | 'vertical';
    direction: 'left' | 'right';
    disabled?: boolean;
  }
>(
  (
    { className, ownerState, orientation, disabled, direction, ...props },
    ref,
  ) => {
    const Icon = direction === 'left' ? ChevronLeftIcon : ChevronRightIcon;
    const degree = ownerState.isRtl ? -90 : 90;

    return (
      <button
        {...props}
        ref={ref}
        className={cn(
          'shrink-0 px-2.5 py-3 opacity-80',
          {
            'opacity-0': disabled,
            'max-sm:hidden': ownerState.scrollButtonsHideMobile,
            'h-10 w-full': orientation === 'vertical',
          },
          className,
        )}
      >
        <Icon
          className={cn(
            'w-3',
            `rotate-[${degree}]` && orientation === 'vertical',
          )}
        />
      </button>
    );
  },
);

TabScrollButton.displayName = 'TabScrollButton';

const TabsScroller = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> & {
    ownerState: TOwnerState;
  }
>(({ className, ownerState, style, ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        'relative inline-block flex-auto whitespace-nowrap',
        ownerState.fixed && 'w-full overflow-x-hidden',
        ownerState.scrollableX && 'overflow-x-auto overflow-y-hidden',
        ownerState.scrollableY && 'overflow-y-auto overflow-x-hidden',
        className,
      )}
      style={{
        ...(ownerState.hideScrollbar
          ? { scrollbarWidth: 'none', msOverflowStyle: 'none' }
          : {}),
        ...style,
      }}
    />
  );
});

TabsScroller.displayName = 'TabsScroller';

const FlexContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> & {
    ownerState: TOwnerState;
  }
>(({ className, ownerState, ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        'flex flex-row',
        ownerState.vertical && 'flex-col',
        ownerState.centered && 'justify-center',
        className,
      )}
    />
  );
});

FlexContainer.displayName = 'FlexContainer';

const TabsIndicator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'> & {
    ownerState: TOwnerState;
  }
>(({ className, ownerState, ...props }, ref) => {
  return (
    <span
      {...props}
      ref={ref}
      className={cn(
        'absolute bottom-0 h-[2px] bg-primary-600 transition-all duration-300 ease-in-out',
        ownerState.vertical && 'right-0 h-full w-[2px]',
        className,
      )}
    />
  );
});

TabsIndicator.displayName = 'TabsIndicator';

const TabsScrollbarSize = () => {
  return (
    <div
      className='tabs_scrollbar absolute top-[-9999px] h-[99px] w-[99px] overflow-scroll'
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    />
  );
};

TabsScrollbarSize.displayName = 'TabsScrollbarSize';

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  function Tabs(props, ref) {
    const {
      action,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      centered = false,
      children: childrenProp,
      className,
      allowScrollButtonsMobile = false,
      onChange,
      orientation = 'horizontal',
      scrollButtons = 'auto',
      selectionFollowsFocus,
      TabIndicatorProps = {},
      TabScrollButtonProps = {},
      value,
      variant = 'standard',
      visibleScrollbar = false,
      ...other
    } = props;

    const scrollable = variant === 'scrollable';
    const vertical = orientation === 'vertical';
    const scrollStart = vertical ? 'scrollTop' : 'scrollLeft';
    const start = vertical ? 'top' : 'left';
    const end = vertical ? 'bottom' : 'right';
    const clientSize = vertical ? 'clientHeight' : 'clientWidth';
    const size = vertical ? 'height' : 'width';
    const isRtl = false;

    const ownerState = {
      isRtl,
      vertical,
      scrollButtons,
      variant,
      visibleScrollbar,
      fixed: !scrollable,
      hideScrollbar: scrollable && !visibleScrollbar,
      scrollableX: scrollable && !vertical,
      scrollableY: scrollable && vertical,
      centered: centered && !scrollable,
      scrollButtonsHideMobile: !allowScrollButtonsMobile,
    };

    const defaultIndicatorStyle: TIndicatorStyle = React.useMemo(
      () => ({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        height: 0,
        width: 0,
      }),
      [],
    );

    if (process.env.NODE_ENV !== 'production') {
      if (centered && scrollable)
        console.error(
          'MUI: You can not use the `centered={true}` and `variant="scrollable"` properties ' +
            'at the same time on a `Tabs` component.',
        );
    }

    const [mounted, setMounted] = React.useState(false);
    const [indicatorStyle, setIndicatorStyle] = React.useState<TIndicatorStyle>(
      defaultIndicatorStyle,
    );
    const [displayStartScroll, setDisplayStartScroll] = React.useState(false);
    const [displayEndScroll, setDisplayEndScroll] = React.useState(false);
    const [updateScrollObserver, setUpdateScrollObserver] =
      React.useState(false);

    const scrollButtonsActive = displayStartScroll || displayEndScroll;
    const showScrollButtons =
      scrollable &&
      ((scrollButtons === 'auto' && scrollButtonsActive) ||
        scrollButtons === true);

    const valueToIndex = new Map();

    const tabsRef = React.useRef<HTMLDivElement>(null);
    const tabListRef = React.useRef<HTMLDivElement>(null);

    const getTabsMeta = () => {
      const tabsNode = tabsRef.current;

      let tabsMeta;
      if (tabsNode) {
        const rect = tabsNode.getBoundingClientRect();

        // create a new object with ClientRect class props + scrollLeft
        tabsMeta = {
          clientWidth: tabsNode.clientWidth,
          scrollLeft: tabsNode.scrollLeft,
          scrollTop: tabsNode.scrollTop,
          scrollLeftNormalized: getNormalizedScrollLeft(tabsNode, 'ltr'),
          scrollWidth: tabsNode.scrollWidth,
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
        };
      }

      let tabMeta;
      if (tabListRef.current && tabsNode && value !== false) {
        const children = tabListRef.current.children;
        if (children.length > 0) {
          const tab = children[valueToIndex.get(value)];

          if (process.env.NODE_ENV !== 'production') {
            if (!tab) {
              console.error(
                [
                  `MUI: The \`value\` provided to the Tabs component is invalid.`,
                  `None of the Tabs' children match with "${value}".`,
                  valueToIndex.keys
                    ? `You can provide one of the following values: ${Array.from(valueToIndex.keys()).join(', ')}.`
                    : null,
                ].join('\n'),
              );
            }
          }

          tabMeta = tab ? tab.getBoundingClientRect() : null;

          if (process.env.NODE_ENV !== 'production') {
            if (
              process.env.NODE_ENV !== 'test' &&
              !warnedOnceTabPresent &&
              tabMeta &&
              tabMeta.width === 0 &&
              tabMeta.height === 0 &&
              // if the whole Tabs component is hidden, don't warn
              tabsMeta?.clientWidth !== 0
            ) {
              tabsMeta = null;

              console.error(
                [
                  'MUI: The `value` provided to the Tabs component is invalid.',
                  `The Tab with this \`value\` ("${value}") is not part of the document layout.`,
                  "Make sure the tab item is present in the document or that it's not `display: none`.",
                ].join('\n'),
              );

              warnedOnceTabPresent = true;
            }
          }
        }
      }

      return { tabsMeta, tabMeta };
    };

    const updateIndicatorState = React.useCallback(() => {
      const { tabsMeta, tabMeta } = getTabsMeta();
      let startValue = 0;
      let startIndicator: 'top' | 'right' | 'left';

      if (vertical) {
        startIndicator = 'top';
        if (tabMeta && tabsMeta) {
          startValue = tabMeta.top - tabsMeta.top + tabsMeta.scrollTop;
        }
      } else {
        startIndicator = isRtl ? 'right' : 'left';
        if (tabMeta && tabsMeta) {
          const correction = isRtl
            ? tabsMeta.scrollLeftNormalized +
              tabsMeta.clientWidth -
              tabsMeta.scrollWidth
            : tabsMeta.scrollLeft;

          startValue =
            (isRtl ? -1 : 1) *
            (tabMeta[startIndicator] - tabsMeta[startIndicator] + correction);
        }
      }

      const newIndicatorStyle = {
        [startIndicator]: startValue,
        [size]: tabMeta ? tabMeta[size] : 0,
      };

      // IE11 support, replace with Number.isNaN
      if (
        isNaN(indicatorStyle[startIndicator]) ||
        isNaN(indicatorStyle[size])
      ) {
        setIndicatorStyle(newIndicatorStyle as TIndicatorStyle);
      } else {
        const dStart = Math.abs(
          indicatorStyle[startIndicator] - newIndicatorStyle[startIndicator],
        );
        const dSize = Math.abs(indicatorStyle[size] - newIndicatorStyle[size]);
        if (dStart >= 1 || dSize >= 1) {
          setIndicatorStyle(newIndicatorStyle as TIndicatorStyle);
        }
      }
    }, [
      value,
      isRtl,
      size,
      vertical,
      // getTabsMeta,
      indicatorStyle.left,
      indicatorStyle.width,
    ]);

    const scroll = (scrollValue: number, { animation = true } = {}) => {
      if (tabsRef.current === null) return;

      if (animation) {
        animate(scrollStart, tabsRef.current, scrollValue, {});
      } else if (tabsRef.current) {
        tabsRef.current[scrollStart] = scrollValue;
      }
    };

    const moveTabsScroll = (delta: number) => {
      if (tabsRef.current === null) return;

      let scrollValue = tabsRef.current[scrollStart];

      if (vertical) {
        scrollValue += delta;
      } else {
        scrollValue += delta * (isRtl ? -1 : 1);
        // Fix for Edge
        scrollValue *= isRtl && detectScrollType() === 'reverse' ? -1 : 1;
      }

      scroll(scrollValue);
    };

    const getScrollSize = () => {
      if (tabsRef.current === null || tabListRef.current === null) return 0;

      const containerSize = tabsRef.current[clientSize];
      const children = Array.from(tabListRef.current.children);
      let totalSize = 0;

      for (let i = 0; i < children.length; i += 1) {
        const tab = children[i];
        if (totalSize + tab[clientSize] > containerSize) {
          // If the first item is longer than the container size, then only scroll
          // by the container size.
          if (i === 0) totalSize = containerSize;

          break;
        }
        totalSize += tab[clientSize];
      }

      return totalSize;
    };

    const handleStartScrollClick = () => {
      moveTabsScroll(-1 * getScrollSize());
    };

    const handleEndScrollClick = () => {
      moveTabsScroll(getScrollSize());
    };

    const scrollSelectedIntoView = React.useCallback(
      (animation: boolean) => {
        const { tabsMeta, tabMeta } = getTabsMeta();
        if (!tabMeta || !tabsMeta) return;

        if (tabMeta[start] < tabsMeta[start]) {
          // left side of button is out of view
          const nextScrollStart =
            tabsMeta[scrollStart] + (tabMeta[start] - tabsMeta[start]);

          scroll(nextScrollStart, { animation });
        } else if (tabMeta[end] > tabsMeta[end]) {
          // right side of button is out of view
          const nextScrollStart =
            tabsMeta[scrollStart] + (tabMeta[end] - tabsMeta[end]);

          scroll(nextScrollStart, { animation });
        }
      },
      [value],
    );

    const updateScrollButtonState = React.useCallback(() => {
      if (scrollable && scrollButtons !== false) {
        setUpdateScrollObserver(!updateScrollObserver);
      }
    }, []);

    const handleResize = useDebounce(() => {
      // If the Tabs component is replaced by Suspense with a fallback, the last
      // ResizeObserver's handler that runs because of the change in the layout is trying to
      // access a dom node that is no longer there (as the fallback component is being shown instead).
      // See https://github.com/mui/material-ui/issues/33276
      // TODO: Add tests that will ensure the component is not failing when
      // replaced by Suspense with a fallback, once React is updated to version 18
      if (tabsRef.current) updateIndicatorState();
    });

    React.useEffect(() => {
      const win = ownerWindow(tabsRef.current);
      win.addEventListener('resize', handleResize);

      let resizeObserver: ResizeObserver;
      if (typeof ResizeObserver !== 'undefined' && tabListRef.current) {
        resizeObserver = new ResizeObserver(handleResize);

        Array.from(tabListRef.current.children).forEach((child) => {
          resizeObserver.observe(child);
        });
      }

      return () => {
        handleResize.clear();
        win.removeEventListener('resize', handleResize);

        if (resizeObserver) resizeObserver.disconnect();
      };
    }, [updateIndicatorState]);

    /**
     * Toggle visibility of start and end scroll buttons
     * Using IntersectionObserver on first and last Tabs.
     */
    React.useEffect(() => {
      if (tabListRef.current === null) return;

      const tabListChildren = Array.from(tabListRef.current.children);
      const length = tabListChildren.length;

      if (
        typeof IntersectionObserver !== 'undefined' &&
        length > 0 &&
        scrollable &&
        scrollButtons !== false
      ) {
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
      return undefined;
    }, [
      scrollable,
      scrollButtons,
      updateScrollObserver,
      // childrenProp == null ? void 0 : childrenProp.length,
    ]);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    React.useEffect(() => {
      updateIndicatorState();
    });

    // Don't animate on the first render.
    React.useEffect(() => {
      scrollSelectedIntoView(defaultIndicatorStyle !== indicatorStyle);
    }, [scrollSelectedIntoView, defaultIndicatorStyle, indicatorStyle]);

    React.useImperativeHandle(
      action,
      () => ({
        updateIndicator: updateIndicatorState,
        updateScrollButtons: updateScrollButtonState,
      }),
      [updateIndicatorState, updateScrollButtonState],
    );

    let childIndex = 0;
    const children = React.Children.map(childrenProp, (child) => {
      if (!React.isValidElement(child)) return null;

      if (child.type !== Tab) {
        if (process.env.NODE_ENV !== 'production')
          console.error(
            'MUI: The Tabs component can only have children of type Tab.',
          );

        return null;
      }

      if (process.env.NODE_ENV !== 'production' && isFragment(child))
        console.error(
          [
            "MUI: The Tabs component doesn't accept a Fragment as a child.",
            'Consider providing an array instead.',
          ].join('\n'),
        );

      const childProps = child.props as { value: any; tabIndex?: number };

      const childValue =
        childProps.value === undefined ? childIndex : childProps.value;
      valueToIndex.set(childValue, childIndex);
      const selected = childValue === value;
      childIndex += 1;

      return React.cloneElement(child, {
        ...child.props,
        fullWidth: variant === 'fullWidth',
        indicator: selected && !mounted, // && indicator,
        selected,
        selectionFollowsFocus,
        onChange,
        value: childValue,
        ...(childIndex === 1 && value === false && !child.props.tabIndex
          ? { tabIndex: 0 }
          : {}),
      });
    });

    return (
      <TabsRoot
        id='category-toggle'
        ref={ref}
        ownerState={ownerState}
        className={className}
        {...other}
      >
        {showScrollButtons && (
          <TabScrollButton
            direction={isRtl ? 'right' : 'left'}
            orientation={orientation}
            ownerState={ownerState}
            onClick={handleStartScrollClick}
            disabled={!displayStartScroll}
            className={TabScrollButtonProps.className}
          />
        )}

        <TabsScroller
          ownerState={ownerState}
          ref={tabsRef}
          className='tabs_scrollbar'
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            [vertical ? `margin${isRtl ? 'Left' : 'Right'}` : 'marginBottom']:
              visibleScrollbar ? undefined : 0,
          }}
        >
          <FlexContainer
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            role='tablist'
            ref={tabListRef}
            ownerState={ownerState}
          >
            {children}
          </FlexContainer>

          <TabsIndicator
            ownerState={ownerState}
            className={TabIndicatorProps.className}
            style={{ ...indicatorStyle, ...TabIndicatorProps.style }}
          />
        </TabsScroller>

        {showScrollButtons && (
          <TabScrollButton
            direction={isRtl ? 'left' : 'right'}
            ownerState={ownerState}
            orientation={orientation}
            onClick={handleEndScrollClick}
            disabled={!displayEndScroll}
            className={TabScrollButtonProps.className}
          />
        )}
      </TabsRoot>
    );
  },
);

Tabs.displayName = 'Tabs';

export default Tabs;
