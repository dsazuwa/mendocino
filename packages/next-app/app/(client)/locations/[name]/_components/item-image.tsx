'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type Props = { src: string; alt: string; className?: string };

export default function ItemImage({ src, alt, className }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Skeleton className={cn('h-full w-full', className)} />}

      <Image
        src={src}
        alt={alt}
        width={0}
        height={0}
        sizes='100vw'
        className={cn('object-cover', className, {
          'h-full w-full': loaded,
          'h-0 w-auto': !loaded,
        })}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}
