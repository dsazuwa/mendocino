import { Cross2Icon } from '@radix-ui/react-icons';

import { DialogClose } from '@/components/ui/dialog';
import { Button } from '../ui/button';

export default function DialogHeader({ text }: { text: string }) {
  return (
    <div className='flex h-12 w-full flex-row items-center justify-between px-2'>
      <span className='font-semibold text-neutral-800'>{text}</span>

      <DialogClose asChild>
        <Button variant='ghost' size='icon'>
          <Cross2Icon className='h-4 w-4' />

          <span className='sr-only'>Close</span>
        </Button>
      </DialogClose>
    </div>
  );
}
