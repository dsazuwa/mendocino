import { cn } from '@/lib/utils';

export default function ContentHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'h-18 flex w-full flex-row items-center gap-4 border-b border-neutral-200 p-4 sm:h-20 sm:p-6',
        className,
      )}
      {...props}
    />
  );
}

ContentHeader.displayName = 'ContentHeader';
