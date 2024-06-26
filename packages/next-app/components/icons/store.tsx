import { SVGProps } from 'react';

export default function Store(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' {...props}>
      <path d='M20 4H4v2h16zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6zm-9 4H6v-4h6z'></path>
    </svg>
  );
}
