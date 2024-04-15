import { SVGProps } from 'react';

export default function Circle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' {...props}>
      <path d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2'></path>
    </svg>
  );
}
