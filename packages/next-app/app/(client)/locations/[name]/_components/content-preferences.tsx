import { ArrowLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

import OptionHeader from './option-header';
import { Button } from '@/components/ui/button';
import ContentHeader from '@/components/content-header';
import ContentFooter from '@/components/content-footer';

export function Preferences({ open }: { open: () => void }) {
  return (
    <div>
      <OptionHeader name='Preferences' isRequired={false} />

      <button
        className='inline-flex w-full items-center justify-between py-2'
        onClick={open}
      >
        <span className='text-xs font-medium text-neutral-800 sm:text-sm'>
          Add Special Instructions
        </span>

        <ChevronRightIcon className='h-3 w-3' />
      </button>
    </div>
  );
}

export function PreferencesContent({ back }: { back: () => void }) {
  return (
    <>
      <ContentHeader className='border-none'>
        <Button
          variant='ghost'
          size='icon'
          className='ml-[-8px]'
          onClick={back}
        >
          <ArrowLeftIcon className='h-4 w-4 fill-neutral-500' />

          <span className='sr-only'>Return</span>
        </Button>
      </ContentHeader>

      <ContentFooter className='inline-flex sm:py-4'>
        <Button variant='primary' className='ml-auto rounded-2xl'>
          SAVE
        </Button>
      </ContentFooter>
    </>
  );
}
