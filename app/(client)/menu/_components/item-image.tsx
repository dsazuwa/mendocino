'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function ItemImage({ alt, url }: { alt: string; url: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Skeleton className='aspect-[3/2] w-full' />}

      <Image
        src={`${process.env.NEXT_PUBLIC_CDN_URL}/${url}`}
        alt={alt}
        width={0}
        height={0}
        sizes='100vw'
        className={cn('rounded-md object-cover', {
          'h-auto w-full': loaded,
          'h-0 w-auto': !loaded,
        })}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}
