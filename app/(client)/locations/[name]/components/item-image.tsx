'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type Props = { src: string; alt: string };

export default function ItemImage({ src, alt }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Skeleton className='h-full w-full rounded-r-lg' />}

      <Image
        src={src}
        alt={alt}
        width={0}
        height={0}
        sizes='100vw'
        className={cn('rounded-r-lg object-cover', {
          'h-full w-full': loaded,
          'h-0 w-auto': !loaded,
        })}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}
