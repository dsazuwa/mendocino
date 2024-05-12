// 'use client';

// /* WIP based on MUI Tabs */

// import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
// import React, {
//   ReactNode,
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from 'react';

// import useDebounce from '@/hooks/use-debounce';
// import { cn } from '@/lib/utils';

// function ownerDocument(node: Node | null) {
//   return (node && node.ownerDocument) || document;
// }

// function ownerWindow(node: Node | null) {
//   const doc = ownerDocument(node);
//   return doc.defaultView || window;
// }

// type Props = {
//   className?: string;
//   children: ReactNode;
//   value: number;
// };

// export default function Tabs({
//   className,
//   children: childrenProp,
//   value,
// }: Props) {
//   const defaultIndicatorStyle: {
//     left?: number;
//     width?: number;
//   } = {};

//   const [mounted, setMounted] = useState(false);
//   const [indicatorStyle, setIndicatorStyle] = useState(defaultIndicatorStyle);
//   const [displayStartScroll, setDisplayStartScroll] = useState(false);
//   const [displayEndScroll, setDisplayEndScroll] = useState(false);

//   const tabsRef = useRef<HTMLDivElement>(null);
//   const tabListRef = useRef<HTMLDivElement>(null);

//   const getTabsMeta = () => {
//     const tabsNode = tabsRef.current;

//     let tabsMeta;
//     let tabMeta;

//     if (tabsNode) {
//       const rect = tabsNode.getBoundingClientRect();

//       tabsMeta = {
//         clientWidth: tabsNode.clientWidth,
//         scrollLeft: tabsNode.scrollLeft,
//         scrollTop: tabsNode.scrollTop,
//         scrollWidth: tabsNode.scrollWidth,
//         top: rect.top,
//         bottom: rect.bottom,
//         left: rect.left,
//         right: rect.right,
//       };

//       const children = tabListRef.current?.children;
//       if (children !== undefined && children.length > 0) {
//         const tab = children[value];
//         tabMeta = tab ? tab.getBoundingClientRect() : undefined;
//       }
//     }

//     return { tabsMeta, tabMeta };
//   };

//   const scrollSelectedIntoView = useCallback(
//     (animate: boolean) => {
//       const { tabsMeta, tabMeta } = getTabsMeta();

//       const behavior = animate ? 'smooth' : 'instant';

//       if (!tabMeta || !tabsMeta || !tabListRef.current) return;

//       if (tabMeta.left < tabsMeta.left) {
//         const nextScrollStart =
//           tabsMeta.scrollLeft + (tabMeta.left - tabsMeta.left);

//         tabListRef.current.scroll({
//           left: nextScrollStart,
//           behavior,
//         });
//       } else if (tabMeta.right > tabsMeta.right) {
//         const nextScrollStart =
//           tabsMeta.scrollLeft +
//           (tabMeta.right + tabMeta.width - tabsMeta.right);

//         tabListRef.current.scroll({
//           left: nextScrollStart,
//           behavior,
//         });
//       }
//     },
//     [value, getTabsMeta],
//   );

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   /**
//    * Don't animate on the first render.
//    */
//   useEffect(() => {
//     scrollSelectedIntoView(defaultIndicatorStyle !== indicatorStyle);
//   }, [scrollSelectedIntoView, defaultIndicatorStyle, indicatorStyle]);

//   /**
//    * Toggle visibility of start and end scroll buttons
//    * Using IntersectionObserver on first and last Tabs.
//    */
//   useEffect(() => {
//     if (tabListRef.current === null) return;

//     const tabListChildren = Array.from(tabListRef.current.children);
//     const { length } = tabListChildren;

//     if (typeof IntersectionObserver !== 'undefined' && length > 0) {
//       const firstTab = tabListChildren[0];
//       const lastTab = tabListChildren[length - 1];
//       const observerOptions = {
//         root: tabsRef.current,
//         threshold: 0.99,
//       };

//       const firstObserver = new IntersectionObserver((entries) => {
//         setDisplayStartScroll(!entries[0].isIntersecting);
//       }, observerOptions);
//       firstObserver.observe(firstTab);

//       const lastObserver = new IntersectionObserver((entries) => {
//         setDisplayEndScroll(!entries[0].isIntersecting);
//       }, observerOptions);
//       lastObserver.observe(lastTab);

//       return () => {
//         firstObserver.disconnect();
//         lastObserver.disconnect();
//       };
//     }
//   }, []);

//   const updateIndicatorState = useCallback(() => {
//     const { tabsMeta, tabMeta } = getTabsMeta();

//     let startValue = 0;

//     if (tabMeta && tabsMeta) {
//       const correction = tabsMeta.scrollLeft;
//       startValue = tabMeta.left - tabsMeta.left + correction;
//     }

//     const newIndicatorStyle = {
//       left: startValue,
//       width: tabMeta ? tabMeta.width : 0,
//     };

//     if (indicatorStyle.left === undefined || indicatorStyle.width === undefined)
//       setIndicatorStyle(newIndicatorStyle);
//     else {
//       const dStart = Math.abs(indicatorStyle.left - newIndicatorStyle.left);
//       const dSize = Math.abs(indicatorStyle.width - newIndicatorStyle.width);

//       if (dStart >= 1 || dSize >= 1) setIndicatorStyle(newIndicatorStyle);
//     }
//   }, [value, getTabsMeta, indicatorStyle.left, indicatorStyle.width]);

//   const handleResize = useDebounce(() => {
//     if (tabsRef.current) updateIndicatorState();
//   }, 100);

//   useEffect(() => {
//     updateIndicatorState();
//   });

//   useEffect(() => {
//     if (tabsRef.current === null || tabListRef.current === null) return;

//     const window = ownerWindow(tabsRef.current);
//     window.addEventListener('resize', handleResize);

//     let resizeObserver: ResizeObserver;
//     if (typeof ResizeObserver !== 'undefined') {
//       resizeObserver = new ResizeObserver(handleResize);

//       Array.from(tabListRef.current.children).forEach((child) => {
//         resizeObserver.observe(child);
//       });
//     }

//     return () => {
//       handleResize.clear();
//       window.removeEventListener('resize', handleResize);

//       if (resizeObserver) resizeObserver.disconnect();
//     };
//   }, [updateIndicatorState, handleResize]);

//   const scroll = (scrollValue: number, { animation = true } = {}) => {
//     if (tabsRef.current === null) return;

//     if (animation) {
//       animate('scrollLeft', tabsRef.current, scrollValue);
//     } else {
//       tabsRef.current.scrollLeft = scrollValue;
//     }
//   };

//   const moveTabsScroll = (delta: number) => {
//     if (tabsRef.current === null) return;

//     const scrollValue = (tabsRef.current.scrollLeft += delta);

//     scroll(scrollValue);
//   };

//   const getScrollSize = () => {
//     if (tabsRef.current && tabListRef.current) {
//       const containerSize = tabsRef.current.clientWidth;
//       let totalSize = 0;

//       const children = Array.from(tabListRef.current.children);
//       for (let i = 0; i < children.length; i += 1) {
//         const tab = children[i];

//         if (totalSize + tab.clientWidth > containerSize) {
//           // If the first item is longer than the container size, then only scroll
//           // by the container size.
//           if (i === 0) totalSize = containerSize;

//           break;
//         }
//         totalSize += tab.clientWidth;
//       }

//       return totalSize;
//     }

//     return 0;
//   };

//   const handleStartScrollClick = () => {
//     moveTabsScroll(-1 * getScrollSize());
//   };

//   const handleEndScrollClick = () => {
//     moveTabsScroll(getScrollSize());
//   };

//   // const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
//   //   const list = tabListRef.current;
//   //   const currentFocus = ownerDocument(list).activeElement;

//   //   if (list === null || currentFocus === null) return;

//   //   const role = currentFocus.getAttribute('role');
//   //   if (role !== 'tab') return;

//   //   let previousItemKey = 'ArrowLeft';
//   //   let nextItemKey = 'ArrowRight';

//   //   switch (event.key) {
//   //     case previousItemKey:
//   //       event.preventDefault();
//   //       moveFocus(list, currentFocus, previousItem);
//   //       break;
//   //     case nextItemKey:
//   //       event.preventDefault();
//   //       moveFocus(list, currentFocus, nextItem);
//   //       break;
//   //     case 'Home':
//   //       event.preventDefault();
//   //       moveFocus(list, null, nextItem);
//   //       break;
//   //     case 'End':
//   //       event.preventDefault();
//   //       moveFocus(list, null, previousItem);
//   //       break;
//   //     default:
//   //       break;
//   //   }
//   // };

//   let childIndex = 0;
//   const children = React.Children.map(childrenProp, (child) => {
//     if (!React.isValidElement(child)) return null;

//     const childValue =
//       child.props.value === undefined ? childIndex : child.props.value;

//     // valueToIndex.set(childValue, childIndex);
//     const selected = childValue === value;
//     childIndex += 1;
//     // return React.cloneElement(
//     //   child,
//     //   _extends(
//     //     {
//     //       indicator: selected && !mounted && indicator,
//     //       selected,
//     //       onChange,
//     //       value: childValue,
//     //     },
//     //     childIndex === 1 && value === false && !child.props.tabIndex
//     //       ? { tabIndex: 0 }
//     //       : {},
//     //   ),
//     // );
//   });

//   return (
//     <div
//       id='category-toggle'
//       className={cn(
//         'inline-flex items-center justify-center overflow-hidden',
//         className,
//       )}
//     >
//       <button
//         className='px-2.5 py-3'
//         onClick={handleStartScrollClick}
//         disabled={!displayStartScroll}
//       >
//         <ChevronLeftIcon
//           className={cn('w-3', { 'opacity-0': !displayStartScroll })}
//         />
//       </button>

//       <div
//         className='relative inline-block flex-1 overflow-x-auto overflow-y-hidden whitespace-nowrap pb-0'
//         style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//         ref={tabsRef}
//       >
//         <div
//           className='inline-flex'
//           role='tablist'
//           ref={tabListRef}
//           // onKeyDown={handleKeyDown}
//         >
//           {childrenProp}
//         </div>

//         <span
//           className='absolute bottom-0 h-[1px] bg-primary-600 transition-all duration-300 ease-in-out'
//           style={{ ...indicatorStyle }}
//         />
//       </div>

//       <button
//         className='px-2.5 py-3'
//         onClick={handleEndScrollClick}
//         disabled={!displayEndScroll}
//       >
//         <ChevronRightIcon
//           className={cn('w-3', { 'opacity-0': !displayEndScroll })}
//         />
//       </button>
//     </div>
//   );
// }

// function easeInOutSin(time: number) {
//   return (1 + Math.sin(Math.PI * time - Math.PI / 2)) / 2;
// }
// function animate(
//   property: 'scrollLeft',
//   element: HTMLDivElement,
//   to: number,
//   // options = {},
//   cb = () => {},
// ) {
//   const ease = easeInOutSin,
//     duration = 300;

//   let start: number | null = null;
//   const from = element[property];
//   let cancelled = false;

//   const cancel = () => {
//     cancelled = true;
//   };

//   const step = (timestamp: number) => {
//     if (cancelled) {
//       // cb(new Error('Animation cancelled'));
//       return;
//     }

//     if (start === null) start = timestamp;

//     const time = Math.min(1, (timestamp - start) / duration);
//     element[property] = ease(time) * (to - from) + from;
//     if (time >= 1) {
//       requestAnimationFrame(() => {
//         // cb(null);
//       });
//       return;
//     }

//     requestAnimationFrame(step);
//   };

//   requestAnimationFrame(step);
//   return cancel;
// }

// // const nextItem = (list: HTMLDivElement, item: Element) => {
// //   if (list === item) return list.firstChild;

// //   if (item && item.nextElementSibling) return item.nextElementSibling;

// //   return list.firstChild;
// // };

// // const previousItem = (list: HTMLDivElement, item: Element) => {
// //   if (list === item) return list.lastChild;

// //   if (item && item.previousElementSibling) return item.previousElementSibling;

// //   return list.lastChild;
// // };

// // const moveFocus = (
// //   list: HTMLDivElement,
// //   currentFocus: Element,
// //   traversalFunction: (list: HTMLDivElement, item: Element) => ChildNode | null,
// // ) => {
// //   let wrappedOnce = false;
// //   let nextFocus = traversalFunction(list, currentFocus);

// //   while (nextFocus) {
// //     if (nextFocus === list.firstChild) {
// //       if (wrappedOnce) return;
// //       wrappedOnce = true;
// //     }

// //     const nextFocusDisabled =
// //       nextFocus.disabled || nextFocus.getAttribute('aria-disabled') === 'true';

// //     if (!nextFocus.hasAttribute('tabindex') || nextFocusDisabled) {
// //       nextFocus = traversalFunction(list, nextFocus);
// //     } else {
// //       nextFocus.focus();
// //       return;
// //     }
// //   }
// // };
