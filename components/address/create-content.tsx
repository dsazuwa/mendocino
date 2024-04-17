import { Cross2Icon } from '@radix-ui/react-icons';

import { DialogClose } from '@/components/ui/dialog';
import ContentHeader from '../content-header';
import { Button } from '../ui/button';
import { SheetClose } from '../ui/sheet';
import CreateForm from './create-form';

type Props = { isDialog: boolean };

export default function CreateContent({ isDialog }: Props) {
  const Comp = isDialog ? DialogClose : SheetClose;

  return (
    <>
      <ContentHeader>
        <Comp asChild>
          <Button variant='ghost' size='icon'>
            <Cross2Icon className='h-4 w-4 fill-neutral-500' />

            <span className='sr-only'>Close</span>
          </Button>
        </Comp>

        <span className='flex-1 text-sm font-semibold text-neutral-800'>
          Create Address
        </span>
      </ContentHeader>

      <CreateForm />
    </>
  );
}
