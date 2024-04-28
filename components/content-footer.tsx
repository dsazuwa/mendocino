import { cn } from '@/lib/utils';

export default function ContentFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'mt-auto border-t border-neutral-200 p-4 sm:p-6',
        className,
      )}
      {...props}
    />
  );
}

ContentFooter.displayName = 'ContentFooter';
