import { Fragment } from 'react';

export default function ItemTag({ tags }: { tags: string[] }) {
  return (
    <div className='flex flex-row items-center gap-1 md:gap-2'>
      {tags.map((tag, index) => (
        <Fragment key={index}>
          <div className='text-[10px]/4 font-semibold text-neutral-500'>
            {tag}
          </div>

          {index < tags.length - 1 && (
            <div className='h-full w-[1px] bg-neutral-300' />
          )}
        </Fragment>
      ))}
    </div>
  );
}
