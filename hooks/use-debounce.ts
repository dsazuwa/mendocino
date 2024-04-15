/* eslint-disable  @typescript-eslint/no-explicit-any */

export default function useDebounce(func: () => void, wait = 166) {
  let timeout: ReturnType<typeof setTimeout>;

  function debounced(...args: any[]) {
    const later = () => {
      // @ts-expect-error: TypeScript cannot infer types properly for this legacy function.
      func.apply(this, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }

  debounced.clear = () => {
    clearTimeout(timeout);
  };

  return debounced;
}
