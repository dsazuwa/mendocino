import { SVGProps } from 'react';

export default function Check(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' {...props}>
      <path d='M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'></path>
    </svg>
  );
}
