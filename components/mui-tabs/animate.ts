function easeInOutSin(time: number) {
  return (1 + Math.sin(Math.PI * time - Math.PI / 2)) / 2;
}

export default function animate(
  property: 'scrollTop' | 'scrollLeft',
  element: HTMLDivElement,
  to: number,
  options: {
    ease?: (time: number) => number;
    duration?: number;
  } = {},
  // cb = () => {},
) {
  const {
    ease = easeInOutSin,
    duration = 300, // standard
  } = options;

  const start: number | null = null;
  const from = element[property];

  let cancelled = false;
  const cancel = () => {
    cancelled = true;
  };

  const step = (timestamp: number) => {
    if (cancelled) {
      // cb(new Error('Animation cancelled'));
      return;
    }

    // if (start === null) start = timestamp;

    const time = Math.min(1, (timestamp - (start || timestamp)) / duration);
    element[property] = ease(time) * (to - from) + from;
    if (time >= 1) {
      // requestAnimationFrame(() => {
      //   cb(null);
      // });

      requestAnimationFrame(() => {});
      return;
    }

    requestAnimationFrame(step);
  };

  if (from === to) {
    // cb(new Error('Element already at target position'));
    return cancel;
  }

  requestAnimationFrame(step);
  return cancel;
}
